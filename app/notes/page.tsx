'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useClickOutside } from "../hooks/useClickOutside";
import LoadingIndicator from "../components/LoadingIndicator";
import {
  fetchPublicNotes,
  fetchSessionIdentity,
  noteKeys,
  notesPageSize,
  sessionIdentityKey,
  type Note,
  type NoteQueryParams,
} from "./queries";

interface NoteFilters {
  university: string;
  course: string;
  subject: string;
  studyType: string;
  year: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const isAllSelection = (value: string) => value.trim().toLowerCase() === "all";

const getPageNumbers = (currentPage: number, totalPages: number) => {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages] as const;
  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages] as const;
  }
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages] as const;
};

const sameNoteFilters = (first: NoteQueryParams, second: NoteQueryParams) =>
  first.limit === second.limit &&
  first.q === second.q &&
  first.university === second.university &&
  first.course === second.course &&
  first.subject === second.subject &&
  first.studyType === second.studyType &&
  first.year === second.year &&
  first.sort === second.sort;

function NotesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const searchQuery = searchParams.get("q")?.trim() || "";
  const [pageSelection, setPageSelection] = useState({ searchQuery, page: 1 });
  const currentPage = pageSelection.searchQuery === searchQuery ? pageSelection.page : 1;
  const sessionQuery = useQuery({
    queryKey: sessionIdentityKey,
    queryFn: ({ signal }) => fetchSessionIdentity(signal),
    staleTime: 30_000,
  });

  const [universities, setUniversities] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);

  const [uniSearch, setUniSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");

  const [showUniList, setShowUniList] = useState(false);
  const universityDropdownRef = useRef<HTMLDivElement>(null);
  const [showCourseList, setShowCourseList] = useState(false);
  const courseDropdownRef = useRef<HTMLDivElement>(null);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [studyTypeFilter, setStudyTypeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<NoteFilters>({
    university: "",
    course: "",
    subject: "",
    studyType: "",
    year: "",
  });
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [notesProgressState, setNotesProgressState] = useState<{
    key: string;
    value: number | undefined;
  }>();
  const accountKey =
    sessionQuery.data?.status === "authenticated"
      ? sessionQuery.data.accountKey
      : "anonymous";
  const noteParams = useMemo<NoteQueryParams>(() => ({
    page: currentPage,
    limit: notesPageSize,
    q: searchQuery,
    university: appliedFilters.university && !isAllSelection(appliedFilters.university)
      ? appliedFilters.university
      : "",
    course: appliedFilters.course && !isAllSelection(appliedFilters.course)
      ? appliedFilters.course
      : "",
    subject: appliedFilters.subject,
    studyType: appliedFilters.studyType,
    year: appliedFilters.year,
    sort: "createdAt:desc",
  }), [appliedFilters, currentPage, searchQuery]);
  const noteParamsKey = JSON.stringify(noteParams);
  const notesProgress = notesProgressState?.key === noteParamsKey
    ? notesProgressState.value
    : undefined;
  const notesQuery = useQuery({
    queryKey: noteKeys.public(accountKey, noteParams),
    queryFn: ({ signal }) => fetchPublicNotes(
      noteParams,
      signal,
      (value) => setNotesProgressState({ key: noteParamsKey, value })
    ),
    enabled: sessionQuery.data?.status !== "checking" && sessionQuery.isSuccess && !sessionQuery.isFetching,
    placeholderData: (previousData, previousQuery) => {
      const previousParams = previousQuery?.queryKey[3] as NoteQueryParams | undefined;
      if (
        previousQuery?.queryKey[0] !== "notes" ||
        previousQuery.queryKey[1] !== "public" ||
        previousQuery.queryKey[2] !== accountKey ||
        !previousParams
      ) {
        return undefined;
      }

      return sameNoteFilters(previousParams, noteParams) ? previousData : undefined;
    },
  });
  const uploadedNotes = notesQuery.data?.notes ?? [];
  const legacyPagination = notesQuery.data?.legacyPagination ?? false;
  const totalNotes = notesQuery.data?.total ?? 0;
  const loadingNotes = sessionQuery.isPending || (sessionQuery.isSuccess && notesQuery.isPending);
  const notesError = sessionQuery.error ?? notesQuery.error;

  useClickOutside(universityDropdownRef, () => setShowUniList(false), showUniList);
  useClickOutside(courseDropdownRef, () => setShowCourseList(false), showCourseList);

  // ✅ Load JSON automatically from public folder
  useEffect(() => {
    fetch("/data/engineeringData.json")
      .then((res) => res.json())
      .then((data) => {
        setUniversities(data.colleges || []);
        setCourses(data.branches || []);
      })
      .catch(() => {
        setUniversities([]);
        setCourses([]);
      });
  }, []);

  useEffect(() => {
    const pageData = notesQuery.data;
    if (
      !sessionQuery.isSuccess ||
      !pageData ||
      notesQuery.isPlaceholderData ||
      currentPage >= pageData.totalPages
    ) {
      return;
    }

    const nextPageParams = { ...noteParams, page: currentPage + 1 };
    void queryClient.prefetchQuery({
      queryKey: noteKeys.public(accountKey, nextPageParams),
      queryFn: ({ signal }) => fetchPublicNotes(nextPageParams, signal),
    });
  }, [
    currentPage,
    noteParams,
    notesQuery.data,
    notesQuery.isPlaceholderData,
    queryClient,
    sessionQuery.isSuccess,
    accountKey,
  ]);

  const retryNotes = () => {
    setNotesProgressState({ key: noteParamsKey, value: undefined });
    if (sessionQuery.isError) {
      void sessionQuery.refetch();
    } else {
      void notesQuery.refetch();
    }
  };

  // Filter logic
  const filteredUniversities = universities.filter((u) =>
    u.toLowerCase().startsWith(uniSearch.toLowerCase())
  );

  const filteredCourses = courses.filter((c) =>
    c.toLowerCase().startsWith(courseSearch.toLowerCase())
  );

  const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
  const subjectTerms = appliedFilters.subject.toLowerCase().split(/\s+/).filter(Boolean);
  const getNoteSearchText = (note: Note) =>
    [
      note.title,
      note.description,
      note.fileName,
      note.university,
      note.subject,
      note.branch,
      note.course,
      note.studyType,
      note.year,
      ...(note.tags || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

  const filteredNotes = uploadedNotes.filter((note) => {
    const searchText = getNoteSearchText(note);
    const queryMatches = searchTerms.every((term) => searchText.includes(term));
    const subjectMatches = subjectTerms.every((term) => searchText.includes(term));
    const universityFilter = isAllSelection(appliedFilters.university) ? "" : appliedFilters.university;
    const courseFilter = isAllSelection(appliedFilters.course) ? "" : appliedFilters.course;

    return (
      queryMatches &&
      subjectMatches &&
      (!universityFilter || note.university?.toLowerCase().includes(universityFilter.toLowerCase())) &&
      (!courseFilter || (note.branch || note.course)?.toLowerCase().includes(courseFilter.toLowerCase())) &&
      (!appliedFilters.studyType || note.studyType === appliedFilters.studyType) &&
      (!appliedFilters.year || String(note.year || "") === appliedFilters.year)
    );
  });
  const displayedNotes = filteredNotes;
  const notesPerPage = notesPageSize;
  const displayedTotal = legacyPagination ? displayedNotes.length : totalNotes;
  const totalPages = Math.ceil(displayedTotal / notesPerPage);
  const visibleNotes = legacyPagination
    ? displayedNotes.slice((currentPage - 1) * notesPerPage, currentPage * notesPerPage)
    : displayedNotes;
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const hasActiveFilters = Boolean(
    searchQuery ||
      Object.entries(appliedFilters).some(
        ([key, value]) => value && !(key === "university" || key === "course" ? isAllSelection(value) : false)
      )
  );

  const applyFilters = () => {
    setAppliedFilters({
      university: uniSearch.trim(),
      course: courseSearch.trim(),
      subject: subjectSearch.trim(),
      studyType: studyTypeFilter,
      year: yearFilter,
    });
    setFiltersApplied(true);
    setPageSelection({ searchQuery, page: 1 });
    setShowUniList(false);
    setShowCourseList(false);
  };

  const clearFilters = () => {
    setUniSearch("");
    setCourseSearch("");
    setSubjectSearch("");
    setStudyTypeFilter("");
    setYearFilter("");
    setAppliedFilters({ university: "", course: "", subject: "", studyType: "", year: "" });
    setFiltersApplied(false);
    setPageSelection({ searchQuery, page: 1 });
    setShowUniList(false);
    setShowCourseList(false);
  };

  const goToPage = (page: number) => {
    if (page < 1) return;
    setPageSelection({ searchQuery, page });
    requestAnimationFrame(() => {
      document.getElementById("notes-results")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "start",
      });
    });
  };



  return (
    <div className="flex min-h-screen mt-17 flex-col text-slate-100 lg:flex-row">

      {/* LEFT FILTER SIDEBAR */}
      <aside className="mt-1 w-full border-b border-slate-700 bg-slate-900/80 p-4 shadow-xl lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Filter</h2>
        </div>

        {/* University */}
        <div className="mt-4 relative">
          <label className="text-slate-300 text-sm font-medium">University</label>

          <div ref={universityDropdownRef}>
            <input
              type="text"
              placeholder="Search & select your college"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-slate-100 placeholder:text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
              value={uniSearch}
              onChange={(e) => {
                setUniSearch(e.target.value);
                setShowUniList(true);
              }}
              onFocus={() => setShowUniList(true)}
            />

            {/* Dropdown list */}
            {showUniList && (
              <ul className="absolute z-20 w-full bg-slate-800 border border-slate-600 shadow-xl max-h-56 overflow-y-auto rounded-lg mt-1">
                {filteredUniversities.length > 0 ? (
                  filteredUniversities.map((uni, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 text-slate-200 hover:bg-slate-700 hover:text-cyan-200 cursor-pointer"
                      onClick={() => {
                        setUniSearch(uni);

                        setShowUniList(false);
                      }}
                    >
                      {uni}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-slate-400">No matches found</li>
                )}
              </ul>
            )}
          </div>
        </div>


        {/* Course / Branch */}
        <div ref={courseDropdownRef} className="mt-4 relative">
          <label className="text-slate-300 text-sm font-medium">Course / Branch</label>

          <input
            type="text"
            placeholder="Search & select your branch"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-slate-100 placeholder:text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
            value={courseSearch}
            onChange={(e) => {
              setCourseSearch(e.target.value);
              setShowCourseList(true);
            }}
            onFocus={() => setShowCourseList(true)}
          />

          {/* Dropdown list */}
          {showCourseList && (
            <ul className="absolute z-20 w-full bg-slate-800 border border-slate-600 shadow-xl max-h-56 overflow-y-auto rounded-lg mt-1">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 text-slate-200 hover:bg-slate-700 hover:text-cyan-200 cursor-pointer"
                    onClick={() => {
                      setCourseSearch(course);
                      setShowCourseList(false);
                    }}
                  >
                    {course}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-slate-400">No matches found</li>
              )}
            </ul>
          )}
        </div>


        {/* Subject */}
        <div className="mt-4">
          <label className="text-slate-300 text-sm font-medium">Subject</label>
          <input
            type="text"
            placeholder="Enter subject"
            className="w-full mt-1 p-2 bg-slate-800 border border-slate-600 text-slate-100 placeholder:text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
            value={subjectSearch}
            onChange={(event) => setSubjectSearch(event.target.value)}
          />
        </div>

        {/* Study Material Type */}
        <div className="mt-5">
          <label className="text-slate-300 text-sm font-medium">
            Study Material Type
          </label>

          <div className="flex flex-wrap gap-2 mt-2">
            {["Notes", "Assignments", "Papers", "Que Banks", "PPT", "Reports", "Other"].map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={studyTypeFilter === t}
                onClick={() => setStudyTypeFilter(studyTypeFilter === t ? "" : t)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${studyTypeFilter === t ? "border-cyan-400 bg-cyan-400/15 text-cyan-200" : "border-slate-600 text-slate-200 hover:border-cyan-400 hover:bg-slate-800 hover:text-cyan-200"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Academic Year (Dropdown) */}
        <div className="mt-5">
          <label className="text-slate-300 text-sm font-medium">
            Academic Year
          </label>

          <select value={yearFilter} onChange={(event) => setYearFilter(event.target.value)} className="w-full mt-2 p-2 bg-slate-800 border border-slate-600 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400">
            <option value="">Select Year</option>

            {/* Generate last 10 years */}
            {Array.from({ length: 12 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={applyFilters}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Search
          </button>
          {filtersApplied && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-slate-600 px-4 py-2.5 font-medium text-slate-200 transition-colors hover:border-cyan-400 hover:text-cyan-200"
            >
              Clear
            </button>
          )}
        </div>


        {/* Language */}
        {/* <div className="mt-5">
          <label className="text-gray-700 text-sm font-medium">Language</label>
          <select className="w-full p-2 border rounded-lg mt-1">
            <option>All</option>
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div> */}
      </aside>

      {/* RIGHT SIDE NOTES LIST */}
      <main className="min-w-0 flex-1 p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Notes & Study Materials</h1>

        <section id="notes-results" className="scroll-mt-24">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              {searchQuery && (
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">
                    Uploaded notes matching &quot;{searchQuery}&quot;
                  </h2>
                  <button
                    type="button"
                    onClick={() => router.push("/notes")}
                    className="mt-2 cursor-pointer text-sm font-medium text-cyan-300 underline-offset-4 hover:text-cyan-200 hover:underline"
                  >
                    Clear search and browse all notes
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-slate-400">
              {!loadingNotes && `${displayedTotal} ${displayedTotal === 1 ? "note" : "notes"}`}
            </p>
          </div>

          {loadingNotes && (
            <LoadingIndicator
              label="Loading your study notes"
              progress={notesProgress}
              className="min-h-48 rounded-xl border border-slate-700 bg-slate-900/50"
            />
          )}
          {!loadingNotes && notesError && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-rose-400/30 bg-rose-400/10 p-4">
              <p className="text-sm text-rose-200" role="alert">
                We couldn’t load your notes. {notesError.message}
              </p>
              <button
                type="button"
                onClick={retryNotes}
                className="rounded-lg border border-rose-300/50 px-4 py-2 text-sm font-semibold text-rose-100 transition-colors hover:bg-rose-300/10 focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                Try again
              </button>
            </div>
          )}
          {notesQuery.isFetching && !loadingNotes && !notesError && (
            <p className="mb-3 text-sm text-cyan-200" role="status">
              Loading page {currentPage}; showing the previously loaded notes.
            </p>
          )}
          {!loadingNotes && !notesError && displayedTotal === 0 && (
            <p className="mb-4 rounded-lg border border-slate-700 bg-slate-900/50 p-6 text-slate-300">
              {hasActiveFilters
                ? "No notes match your search and filters. Try changing or clearing them."
                : "No notes have been uploaded yet."}
            </p>
          )}

          {!loadingNotes && !notesError && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {visibleNotes.map((note) => (
              <article key={note._id} className="flex min-w-0 flex-col rounded-lg border border-slate-700 bg-slate-800/80 p-5 shadow-lg transition-colors hover:border-cyan-500/70">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="truncate rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                    {note.studyType || "Study material"}
                  </span>
                  {note.year && <span className="shrink-0 text-xs text-slate-400">{note.year}</span>}
                </div>
                <h3 className="wrap-break-word text-lg font-semibold text-white">{note.title}</h3>
                {note.description && <p className="mt-2 line-clamp-3 text-sm text-slate-300">{note.description}</p>}

                <dl className="mt-4 space-y-2 text-sm">
                  {note.university && (
                    <div className="flex flex-wrap gap-2">
                      <dt className="shrink-0 text-slate-500">University</dt>
                      <dd className="min-w-0 wrap-break-word text-slate-300">{note.university}</dd>
                    </div>
                  )}
                  {note.course && (
                    <div className="flex flex-wrap gap-2">
                      <dt className="shrink-0 text-slate-500">Course</dt>
                      <dd className="min-w-0 wrap-break-word text-slate-300">{note.course}</dd>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <dt className="shrink-0 text-slate-500">File</dt>
                    <dd className="min-w-0 wrap-break-word text-slate-300">{note.fileName}</dd>
                  </div>
                  {note.fileSize !== undefined && (
                    <div className="flex gap-2">
                      <dt className="shrink-0 text-slate-500">Size</dt>
                      <dd className="text-slate-300">{formatFileSize(note.fileSize)}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-700 pt-4">
                  <time className="text-xs text-slate-500" dateTime={note.createdAt}>
                    {new Date(note.createdAt).toLocaleDateString()}
                  </time>
                  <a
                    href={note.fileUrl || `/api/notes/${note._id}/file`}
                    download={note.fileName}
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                  >
                    Download
                  </a>
                </div>
              </article>
            ))}
          </div>}
          {!loadingNotes && !notesError && totalPages > 1 && (
            <nav aria-label="Notes pages" className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 transition-colors hover:border-cyan-400 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              {pageNumbers.map((page, index) =>
                typeof page === "number" ? (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    aria-label={`Page ${page}`}
                    className={`min-w-10 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      currentPage === page
                        ? "border-cyan-400 bg-cyan-400/15 font-semibold text-cyan-200"
                        : "border-slate-600 text-slate-200 hover:border-cyan-400 hover:text-cyan-200"
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={`ellipsis-${index}`} className="px-1 text-slate-400" aria-hidden="true">
                    …
                  </span>
                )
              )}
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 transition-colors hover:border-cyan-400 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}
        </section>
      </main>
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={<LoadingIndicator label="Opening notes" className="min-h-64" />}>
      <NotesContent />
    </Suspense>
  );
}
