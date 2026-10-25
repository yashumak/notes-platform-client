"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NavbarUser {
  name: string;
  profilePhotoUrl?: string | null;
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<NavbarUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchApplied, setSearchApplied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = window.location.pathname === "/notes" ? params.get("q")?.trim() || "" : "";
    setSearchText(query);
    setSearchApplied(Boolean(query));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const sessionExpiresAt = { current: 0 };
    let expirationTimer: number | undefined;

    const checkSessionExpiry = () => {
      window.clearTimeout(expirationTimer);
      const remaining = sessionExpiresAt.current - Date.now();
      if (remaining > 0) {
        expirationTimer = window.setTimeout(checkSessionExpiry, remaining);
        return;
      }
      if (!sessionExpiresAt.current) return;

      sessionExpiresAt.current = 0;
      setUser(null);
      router.replace("/");
      fetch("/api/auth/logout", { method: "POST", credentials: "include" })
        .then((response) => {
          if (!response.ok) throw new Error("Could not clear expired session cookie");
        })
        .catch((error) => console.error("Could not clear expired session:", error));
    };

    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          credentials: "include",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Not authenticated");
        const data: { isAuthenticated: boolean; expiresAt?: number; user?: NavbarUser } = await response.json();
        if (data.isAuthenticated && data.user) {
          setUser(data.user);
          if (typeof data.expiresAt === "number" && Number.isFinite(data.expiresAt)) {
            sessionExpiresAt.current = data.expiresAt;
            checkSessionExpiry();
          } else {
            sessionExpiresAt.current = 0;
            window.clearTimeout(expirationTimer);
          }
        } else {
          sessionExpiresAt.current = 0;
          window.clearTimeout(expirationTimer);
          setUser(null);
        }
      } catch {
        if (!controller.signal.aborted) {
          sessionExpiresAt.current = 0;
          window.clearTimeout(expirationTimer);
          setUser(null);
        }
      } finally {
        if (!controller.signal.aborted) setAuthChecked(true);
      }
    };

    const refreshUser = () => loadUser();
    loadUser();
    window.addEventListener("profile-photo-updated", refreshUser);
    window.addEventListener("auth-state-updated", refreshUser);
    document.addEventListener("visibilitychange", checkSessionExpiry);

    return () => {
      controller.abort();
      window.clearTimeout(expirationTimer);
      window.removeEventListener("profile-photo-updated", refreshUser);
      window.removeEventListener("auth-state-updated", refreshUser);
      document.removeEventListener("visibilitychange", checkSessionExpiry);
    };
  }, [router]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex w-full items-center justify-between border-b border-blue-100 bg-linear-to-r from-blue-50 to-white px-6 py-3 shadow-md">

      {/* Left Logo */}
      <Link href="/" className="text-3xl font-extrabold text-blue-700 tracking-wide hover:text-blue-800 transition-colors">
        NotesHub
      </Link>

      {/* Center Search Bar */}
      <div className="flex-1 flex justify-center px-6">
        <form action="/notes" method="get" role="search" className="relative w-full max-w-lg">
          <input
            type="text"
            name="q"
            aria-label="Search uploaded notes"
            placeholder="Search Notes, Assignments, Papers, Que Banks, PPT, Reports..."
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
              setSearchApplied(false);
            }}
            className="w-full rounded-full border border-blue-200 py-2.5 pl-5 pr-12 shadow-sm transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {searchApplied ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setSearchText("");
                setSearchApplied(false);
                router.push("/notes");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              aria-label="Search notes"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
        </form>
      </div>

      {/* Right Links */}
      <div className="flex items-center font-semibold gap-6 text-gray-700">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <Link href="/notes" className="hover:text-blue-600 transition-colors">Notes</Link>

        {authChecked && (user ? (
          <Link
            href="/dashboard"
            aria-label={`Account for ${user.name}`}
            className="flex max-w-44 items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-2 text-blue-700 shadow transition-colors hover:bg-blue-50"
          >
            {user.profilePhotoUrl ? (
              <Image
                src={user.profilePhotoUrl}
                alt=""
                width={32}
                height={32}
                unoptimized
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
            ) : (
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 21a8 8 0 0 0-16 0m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              </svg>
            )}
            <span className="truncate">{user.name}</span>
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-full bg-blue-600 px-5 py-2 text-white shadow transition-all hover:bg-blue-700"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-full border-2 border-blue-600 bg-white px-5 py-2 text-blue-600 shadow transition-all hover:bg-blue-50"
            >
              Register
            </Link>
          </>
        ))}

      </div>
    </nav>
  );
}
