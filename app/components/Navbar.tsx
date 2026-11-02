"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchSessionIdentity,
  sessionIdentityKey,
  type AuthenticatedSession,
} from "../notes/queries";

type NavbarUser = Pick<AuthenticatedSession["user"], "name" | "profilePhotoUrl">;

export default function Navbar() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const sessionQuery = useQuery({
    queryKey: sessionIdentityKey,
    queryFn: ({ signal }) => fetchSessionIdentity(signal),
    staleTime: 30_000,
  });
  const session = sessionQuery.data;
  const user: NavbarUser | null =
    session?.status === "authenticated" ? session.user : null;
  const authChecked =
    sessionQuery.isError ||
    (sessionQuery.isSuccess && session?.status !== "checking");
  const [searchText, setSearchText] = useState("");
  const [searchApplied, setSearchApplied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = window.location.pathname === "/notes" ? params.get("q")?.trim() || "" : "";
    startTransition(() => {
      setSearchText(query);
      setSearchApplied(Boolean(query));
    });
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    let expirationTimer: number | undefined;
    const expiresAt = session?.status === "authenticated" ? session.expiresAt : undefined;
    if (expiresAt === undefined) return;
    const checkSessionExpiry = () => {
      window.clearTimeout(expirationTimer);
      const remaining = expiresAt - Date.now();
      if (remaining > 0) {
        expirationTimer = window.setTimeout(checkSessionExpiry, remaining);
        return;
      }

      window.dispatchEvent(new Event("auth-state-updated"));
      router.replace("/");
      fetch("/api/auth/logout", { method: "POST", credentials: "include" })
        .then((response) => {
          if (!response.ok) throw new Error("Could not clear expired session cookie");
        })
        .catch(() => undefined);
    };

    checkSessionExpiry();
    document.addEventListener("visibilitychange", checkSessionExpiry);

    return () => {
      window.clearTimeout(expirationTimer);
      document.removeEventListener("visibilitychange", checkSessionExpiry);
    };
  }, [router, session]);

  useEffect(() => {
    const refreshUser = () => {
      void queryClient.invalidateQueries({ queryKey: sessionIdentityKey });
    };
    window.addEventListener("profile-photo-updated", refreshUser);
    return () => window.removeEventListener("profile-photo-updated", refreshUser);
  }, [queryClient]);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 w-full border-b border-blue-100 bg-linear-to-r from-blue-50 to-white px-3 py-3 shadow-md sm:px-6">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <Link href="/" className="text-2xl font-extrabold tracking-wide text-blue-700 transition-colors hover:text-blue-800 sm:text-3xl">
          NotesHub
        </Link>

        <form action="/notes" method="get" role="search" className="relative hidden min-w-0 max-w-lg flex-1 justify-center lg:flex">
          <input
            type="search"
            name="q"
            aria-label="Search uploaded notes"
            placeholder="Search notes, assignments, papers, and more..."
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

        <div className="hidden items-center gap-4 font-semibold text-gray-700 lg:flex xl:gap-6">
          <Link href="/" className="transition-colors hover:text-blue-600">Home</Link>
          <Link href="/notes" className="transition-colors hover:text-blue-600">Notes</Link>
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
              <Link href="/login" className="rounded-full bg-blue-600 px-5 py-2 text-white shadow transition-all hover:bg-blue-700">
                Login
              </Link>
              <Link href="/signup" className="rounded-full border-2 border-blue-600 bg-white px-5 py-2 text-blue-600 shadow transition-all hover:bg-blue-50">
                Register
              </Link>
            </>
          ))}
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-blue-200 text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden"
        >
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 6 12 12M18 6 6 18" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <div
          id="mobile-navigation"
          className={`${menuOpen ? "flex" : "hidden"} w-full flex-col gap-3 border-t border-blue-100 pt-3 lg:hidden`}
        >
          <form action="/notes" method="get" role="search" onSubmit={() => setMenuOpen(false)} className="relative w-full">
            <input
              type="search"
              name="q"
              aria-label="Search uploaded notes"
              placeholder="Search notes, courses, and topics"
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
                setSearchApplied(false);
              }}
              className="w-full rounded-full border border-blue-200 py-2.5 pl-4 pr-12 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {searchApplied ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearchText("");
                  setSearchApplied(false);
                  setMenuOpen(false);
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
          <Link href="/" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700">Home</Link>
          <Link href="/notes" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700">Notes</Link>
          {authChecked && (user ? (
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700">My account</Link>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-full bg-blue-600 px-4 py-2.5 text-center font-semibold text-white shadow hover:bg-blue-700">Login</Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)} className="rounded-full border-2 border-blue-600 bg-white px-4 py-2.5 text-center font-semibold text-blue-600 shadow hover:bg-blue-50">Register</Link>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
