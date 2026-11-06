import type { QueryClient } from "@tanstack/react-query";
import { ApiResponseError, getRateLimitMessage } from "../auth/apiErrors";

export const notesPageSize = 30;

export interface NoteQueryParams {
  page: number;
  limit: number;
  q: string;
  university: string;
  course: string;
  subject: string;
  studyType: string;
  year: string;
  sort: "createdAt:desc";
}

export interface Note {
  _id: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize?: number;
  fileUrl?: string;
  university?: string;
  subject?: string;
  branch?: string;
  course?: string;
  studyType?: string;
  year?: number;
  tags?: string[];
  visibility?: "public" | "private";
  createdAt: string;
}

export interface NotesPage {
  notes: Note[];
  total: number;
  totalPages: number;
  legacyPagination: boolean;
}

export interface MyNotesPage {
  notes: Note[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface SessionIdentity {
  status: "checking";
  userId: null;
}

export interface AnonymousSession {
  status: "anonymous";
  userId: null;
}

export interface AuthenticatedSession {
  status: "authenticated";
  accountKey: string;
  expiresAt?: number;
  user: {
    id: string;
    name: string;
    email: string;
    university?: string;
    course?: string;
    year?: string;
    profilePhotoUrl?: string | null;
  };
}

export type CachedSession = SessionIdentity | AnonymousSession | AuthenticatedSession;

export const sessionIdentityKey = ["session", "identity"] as const;
export const checkingSession: SessionIdentity = { status: "checking", userId: null };
export const anonymousSession: AnonymousSession = { status: "anonymous", userId: null };

const isSafeInteger = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value);

export const noteKeys = {
  root: ["notes"] as const,
  publicRoot: ["notes", "public"] as const,
  public: (accountKey: string, params: NoteQueryParams) =>
    [...noteKeys.publicRoot, accountKey, params] as const,
  mineRoot: ["notes", "mine"] as const,
  mine: (accountKey: string, page: number) => [...noteKeys.mineRoot, accountKey, page] as const,
};

async function readJsonWithProgress<T>(
  response: Response,
  onProgress?: (progress: number | undefined) => void
): Promise<T> {
  const totalBytes = Number(response.headers.get("content-length"));
  if (!onProgress || !response.body || !Number.isFinite(totalBytes) || totalBytes <= 0) {
    onProgress?.(undefined);
    return response.json() as Promise<T>;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    receivedBytes += value.length;
    onProgress(Math.min(99, Math.floor((receivedBytes / totalBytes) * 100)));
  }

  const body = new Uint8Array(receivedBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.length;
  }
  onProgress(100);
  return JSON.parse(new TextDecoder().decode(body)) as T;
}

async function readError(response: Response, fallback: string): Promise<Error> {
  const errorData: { message?: string; retryAfterSeconds?: number } | null =
    await response.json().catch(() => null);
  if (response.status === 429) {
    const header = response.headers.get("retry-after");
    const headerSeconds = header && /^\d+$/.test(header) ? Number(header) : undefined;
    return new ApiResponseError(
      getRateLimitMessage(
        errorData?.message,
        errorData?.retryAfterSeconds ?? headerSeconds
      ),
      response.status,
      errorData?.retryAfterSeconds ?? headerSeconds
    );
  }
  return new ApiResponseError(
    errorData?.message || `${fallback} (HTTP ${response.status}).`,
    response.status
  );
}

export async function fetchSessionIdentity(signal?: AbortSignal): Promise<CachedSession> {
  const response = await fetch("/api/auth/verify", {
    cache: "no-store",
    credentials: "include",
    signal,
  });
  if (response.status === 401) return anonymousSession;
  if (!response.ok) throw await readError(response, "Could not verify your session");

  const data: {
    isAuthenticated?: boolean;
    expiresAt?: number;
    user?: Partial<AuthenticatedSession["user"]>;
  } = await response.json();
  if (!data.isAuthenticated) return anonymousSession;

  const profileResponse = await fetch("/api/auth/profile", {
    cache: "no-store",
    credentials: "include",
    signal,
  });
  if (profileResponse.status === 401) return anonymousSession;
  if (!profileResponse.ok && profileResponse.status !== 404) {
    throw await readError(profileResponse, "Could not load your profile");
  }

  const profileData: {
    user?: Partial<AuthenticatedSession["user"]>;
  } = profileResponse.ok ? await profileResponse.json() : { user: data.user };
  if (profileResponse.status === 404 && !profileData.user) {
    throw await readError(profileResponse, "Could not load your profile");
  }
  const profile = profileData.user;
  if (
    typeof profile?.id !== "string" ||
    !profile.id.trim() ||
    typeof profile.email !== "string" ||
    !profile.email.trim() ||
    typeof profile.name !== "string"
  ) {
    throw new Error("The profile service returned an invalid profile.");
  }
  const accountKey = profile.id;
  const expiresAt =
    typeof data.expiresAt === "number" && Number.isFinite(data.expiresAt)
      ? data.expiresAt
      : undefined;
  const user = {
    id: accountKey,
    name: profile.name,
    email: profile.email,
    university: profile.university,
    course: profile.course,
    year: profile.year,
    profilePhotoUrl: profile.profilePhotoUrl,
  };
  return {
    status: "authenticated",
    accountKey,
    expiresAt,
    user,
  };
}

export async function fetchPublicNotes(
  params: NoteQueryParams,
  signal: AbortSignal,
  onProgress?: (progress: number | undefined) => void
): Promise<NotesPage> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  for (const key of ["q", "university", "course", "subject", "studyType", "year"] as const) {
    if (params[key]) searchParams.set(key, params[key]);
  }

  const response = await fetch(`/api/notes?${searchParams.toString()}`, {
    cache: "no-store",
    credentials: "omit",
    signal,
  });
  if (!response.ok) throw await readError(response, "Notes request failed");

  const data: { notes?: Note[]; pagination?: { total?: number; totalPages?: number } } | Note[] =
    await readJsonWithProgress(response, onProgress);
  const notes = Array.isArray(data) ? data : data.notes;
  const pagination = Array.isArray(data) ? undefined : data.pagination;
  if (
    !Array.isArray(notes) ||
    (pagination !== undefined &&
      (typeof pagination.total !== "number" ||
        !Number.isFinite(pagination.total) ||
        pagination.total < 0 ||
        (pagination.totalPages !== undefined &&
          (!Number.isSafeInteger(pagination.totalPages) || pagination.totalPages < 0))))
  ) {
    throw new Error("The notes service returned an invalid response.");
  }

  const total = pagination?.total ?? notes.length;
  return {
    notes,
    total,
    totalPages: pagination?.totalPages ?? Math.ceil(total / params.limit),
    legacyPagination: pagination === undefined,
  };
}

export async function fetchMyNotes(
  userId: string,
  page: number,
  signal: AbortSignal
): Promise<MyNotesPage> {
  if (!userId) throw new Error("A verified user is required to load private notes.");

  const searchParams = new URLSearchParams({ page: String(page), limit: String(notesPageSize) });
  const response = await fetch(`/api/notes/mine?${searchParams.toString()}`, {
    cache: "no-store",
    credentials: "include",
    signal,
  });
  if (!response.ok) throw await readError(response, "Could not load your uploads");
  const payload: unknown = await response.json();
  const data = Array.isArray(payload)
    ? { notes: payload as Note[] }
    : payload && typeof payload === "object"
      ? payload as {
          notes?: unknown;
          pagination?: { page?: unknown; limit?: unknown; total?: unknown; totalPages?: unknown };
        }
      : undefined;
  if (!Array.isArray(data?.notes)) {
    throw new Error("The uploads service returned an invalid response.");
  }

  const notes = data.notes as Note[];
  const pagination = data.pagination;
  if (pagination === undefined) {
    const total = notes.length;
    const totalPages = Math.ceil(total / notesPageSize);
    const offset = (page - 1) * notesPageSize;
    return {
      notes: notes.slice(offset, offset + notesPageSize),
      total,
      totalPages,
      page,
      limit: notesPageSize,
    };
  }
  if (
    !pagination ||
    !isSafeInteger(pagination.page) ||
    !isSafeInteger(pagination.limit) ||
    !isSafeInteger(pagination.total) ||
    !isSafeInteger(pagination.totalPages) ||
    pagination.page < 1 ||
    pagination.limit < 1 ||
    pagination.total < 0 ||
    pagination.totalPages < 0
  ) {
    throw new Error("The uploads service returned an invalid response.");
  }

  return {
    notes,
    total: pagination.total,
    totalPages: pagination.totalPages,
    page: pagination.page,
    limit: pagination.limit,
  };
}

export function invalidateNotes(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: noteKeys.root });
}
