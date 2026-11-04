import axios from "axios";

interface ApiErrorResponse {
  message?: string;
  retryAfterSeconds?: number;
}

export class ApiResponseError extends Error {
  readonly status: number;
  readonly retryAfterSeconds?: number;

  constructor(message: string, status: number, retryAfterSeconds?: number) {
    super(message);
    this.name = "ApiResponseError";
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

const formatRetryDelay = (seconds: number) =>
  seconds < 60
    ? `${seconds} ${seconds === 1 ? "second" : "seconds"}`
    : `${Math.ceil(seconds / 60)} ${Math.ceil(seconds / 60) === 1 ? "minute" : "minutes"}`;

export function getRateLimitMessage(message?: string, retryAfterSeconds?: number): string {
  const safeRetryAfter =
    typeof retryAfterSeconds === "number" &&
    Number.isFinite(retryAfterSeconds) &&
    retryAfterSeconds > 0
      ? Math.ceil(retryAfterSeconds)
      : undefined;

  if (message && /(try again|wait).{0,30}\d+\s*(second|minute|hour)/i.test(message)) {
    return message;
  }
  const prefix = message || "You're making requests too quickly.";
  return safeRetryAfter
    ? `${prefix} Please try again in ${formatRetryDelay(safeRetryAfter)}.`
    : `${prefix} Please wait a moment before trying again.`;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const response = error.response;
  const body = response?.data;
  if (response?.status === 429) {
    const header = response.headers?.["retry-after"];
    const headerSeconds =
      typeof header === "string" && /^\d+$/.test(header)
        ? Number(header)
        : undefined;
    return getRateLimitMessage(
      body?.message,
      body?.retryAfterSeconds ?? headerSeconds
    );
  }
  return body?.message || error.message || fallback;
}
