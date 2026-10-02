"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AccountProfile {
  name: string;
  email: string;
  university?: string;
  course?: string;
  year?: string;
  profilePhotoUrl?: string | null;
}

interface UploadedNote {
  _id: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize?: number;
  fileUrl: string;
  university?: string;
  course?: string;
  studyType?: string;
  year?: number;
  createdAt: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [uploadedNotes, setUploadedNotes] = useState<UploadedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadDashboard = async () => {
      try {
        const requestOptions = {
          credentials: "include" as RequestCredentials,
          signal: controller.signal,
        };
        const [profileResponse, notesResponse] = await Promise.all([
          fetch("/api/auth/verify", requestOptions),
          fetch("/api/notes/mine", requestOptions),
        ]);

        if (profileResponse.status === 401 || notesResponse.status === 401) {
          router.replace("/login");
          return;
        }
        if (!profileResponse.ok || !notesResponse.ok) {
          throw new Error("Could not load your dashboard. Please try again.");
        }

        const [profileData, notesData] = await Promise.all([
          profileResponse.json(),
          notesResponse.json(),
        ]);
        if (!profileData.isAuthenticated || !profileData.user) {
          router.replace("/login");
          return;
        }

        setProfile(profileData.user);
        setUploadedNotes(notesData.notes || []);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError instanceof Error ? loadError.message : "Could not load your dashboard.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadDashboard();
    return () => controller.abort();
  }, [router]);

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const photo = event.target.files?.[0];
    if (!photo) return;

    setPhotoError("");
    setPhotoUploading(true);
    const formData = new FormData();
    formData.append("photo", photo);

    try {
      const response = await fetch("/api/auth/profile/photo", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not update profile photo");

      setProfile((currentProfile) => currentProfile
        ? { ...currentProfile, profilePhotoUrl: `${data.profilePhotoUrl}?v=${Date.now()}` }
        : currentProfile);
      window.dispatchEvent(new Event("profile-photo-updated"));
    } catch (uploadError) {
      setPhotoError(uploadError instanceof Error ? uploadError.message : "Could not update profile photo");
    } finally {
      setPhotoUploading(false);
      event.target.value = "";
    }
  };

  if (loading) {
    return <main className="min-h-screen px-6 pb-16 pt-28 text-slate-300">Loading your dashboard...</main>;
  }

  if (error) {
    return (
      <main className="min-h-screen px-6 pb-16 pt-28 text-rose-200" role="alert">
        {error}
      </main>
    );
  }

  if (!profile) return null;

  return (
    <main className="min-h-screen px-4 pb-20 pt-28 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center gap-5 border-b border-slate-700 pb-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-300/40 bg-cyan-400/10 text-2xl font-bold text-cyan-200">
            {profile.profilePhotoUrl ? (
              <Image
                src={profile.profilePhotoUrl}
                alt={`${profile.name}'s profile`}
                width={80}
                height={80}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              profile.name.trim().charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase text-cyan-300">Student account</p>
            <h1 className="mt-1 wrap-break-word text-3xl font-bold text-white">{profile.name}</h1>
            <p className="mt-1 break-all text-slate-400">{profile.email}</p>
          </div>
          <div className="sm:ml-auto">
            <label
              htmlFor="profile-photo"
              className={`inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${photoUploading ? "pointer-events-none border-slate-700 text-slate-500" : "border-cyan-400/50 text-cyan-200 hover:bg-cyan-400/10"}`}
            >
              {photoUploading ? "Uploading photo..." : profile.profilePhotoUrl ? "Change photo" : "Add profile photo"}
            </label>
            <input
              id="profile-photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={photoUploading}
              onChange={handlePhotoChange}
            />
            {photoError && <p className="mt-2 max-w-56 text-sm text-rose-300" role="alert">{photoError}</p>}
          </div>
        </header>

        <section className="border-b border-slate-700 py-8">
          <h2 className="text-xl font-semibold text-white">Study profile</h2>
          <dl className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-sm text-slate-500">University</dt>
              <dd className="mt-1 wrap-break-word font-medium text-slate-200">{profile.university || "Not provided"}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Branch</dt>
              <dd className="mt-1 wrap-break-word font-medium text-slate-200">{profile.course || "Not provided"}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Year</dt>
              <dd className="mt-1 font-medium text-slate-200">{profile.year || "Not provided"}</dd>
            </div>
          </dl>
        </section>

        <section className="pt-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-white">My uploaded notes</h2>
              <p className="mt-1 text-sm text-slate-400">{uploadedNotes.length} {uploadedNotes.length === 1 ? "upload" : "uploads"}</p>
            </div>
            <Link href="/upload" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-300">
              Upload material
            </Link>
          </div>

          {uploadedNotes.length === 0 ? (
            <p className="border-t border-slate-700 py-6 text-slate-400">You haven’t uploaded any materials yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {uploadedNotes.map((note) => (
                <article key={note._id} className="flex min-w-0 flex-col border-t-2 border-cyan-500 bg-slate-900/60 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="wrap-break-word text-lg font-semibold text-white">{note.title}</h3>
                    <span className="shrink-0 text-xs text-cyan-200">{note.studyType || "Study material"}</span>
                  </div>
                  {note.description && <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-300">{note.description}</p>}
                  <dl className="mt-4 space-y-2 text-sm text-slate-400">
                    <div className="truncate">{note.fileName}</div>
                    {note.university && <div className="truncate">{note.university}</div>}
                    {note.course && <div className="truncate">{note.course}{note.year ? ` · ${note.year}` : ""}</div>}
                    {note.fileSize !== undefined && <div>{formatFileSize(note.fileSize)}</div>}
                  </dl>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-700 pt-4">
                    <time className="text-xs text-slate-500" dateTime={note.createdAt}>
                      {new Date(note.createdAt).toLocaleDateString()}
                    </time>
                    <a href={note.fileUrl} download={note.fileName} className="text-sm font-semibold text-cyan-300 hover:text-cyan-100 hover:underline">
                      Download
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
