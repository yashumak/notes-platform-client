"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface NoteSummary {
  university?: string;
  studyType?: string;
}

export default function Home() {
  const [notes, setNotes] = useState<NoteSummary[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/notes", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load note totals");
        return response.json();
      })
      .then((data) => setNotes(data.notes || []))
      .catch((error) => {
        if (error.name !== "AbortError") console.error("Could not load note totals:", error);
      });

    const elements = document.querySelectorAll(".fade-up");
    const timers = Array.from(elements, (element, index) =>
      window.setTimeout(() => element.classList.add("opacity-100", "translate-y-0"), index * 100)
    );

    return () => {
      controller.abort();
      timers.forEach(window.clearTimeout);
    };
  }, []);

  const universityCount = new Set(notes.map((note) => note.university).filter(Boolean)).size;
  const materialCount = new Set(notes.map((note) => note.studyType).filter(Boolean)).size;

  return (
    <div className="text-white">
      <section className="relative isolate flex min-h-[560px] items-center overflow-hidden px-6 py-20 md:min-h-[640px] md:py-24">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=2000&q=85')" }}
        />
        <div className="absolute inset-0 -z-10 bg-slate-950/75" />
        <div className="mx-auto w-full max-w-6xl fade-up translate-y-4 opacity-0 transition-all duration-700">
          <p className="mb-7 inline-flex items-center gap-2 border-l-2 border-cyan-400 pl-3 text-sm font-semibold uppercase text-cyan-200">
            NotesHub · Student study library
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Study notes, <span className="text-cyan-300">shared by students.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
            Find course notes, past papers, assignments, and presentations from students across universities.
          </p>

          <form action="/notes" method="get" className="mt-10 flex max-w-2xl flex-col gap-4 sm:flex-row">
            <label className="sr-only" htmlFor="home-note-search">Search study materials</label>
            <input
              id="home-note-search"
              name="q"
              type="search"
              placeholder="Search a subject, course, or topic"
              className="min-w-0 flex-1 rounded-lg border border-white/20 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/50"
            />
            <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950">
              Search notes
            </button>
          </form>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link href="/upload" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950">
              Upload study material
            </Link>
            <Link href="/notes" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-fuchsia-300/60 bg-slate-950/50 px-5 py-2.5 text-sm font-semibold text-fuchsia-100 transition hover:-translate-y-0.5 hover:border-fuchsia-300 hover:bg-fuchsia-500/15 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:ring-offset-2 focus:ring-offset-slate-950">
              Browse all notes
            </Link>
          </div>
        </div>
      </section>

      <section id="stats" className="border-y border-slate-700 bg-slate-950/35 px-6 py-10 md:py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-7 sm:grid-cols-3 sm:gap-0">
          {[
            { label: "Shared study materials", value: notes.length, color: "text-cyan-300" },
            { label: "Universities represented", value: universityCount, color: "text-blue-300" },
            { label: "Material types", value: materialCount, color: "text-fuchsia-300" },
          ].map((stat, index) => (
            <div key={stat.label} className={`flex items-center gap-5 sm:px-8 ${index > 0 ? "sm:border-l sm:border-slate-700" : "sm:pl-0"}`}>
              <p className={`min-w-16 text-4xl font-bold tabular-nums ${stat.color}`}>{stat.value}</p>
              <p className="max-w-36 text-sm leading-6 text-slate-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <section className="fade-up translate-y-4 opacity-0 transition-all duration-700">
          <div className="mb-11 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase text-cyan-300">Getting started</p>
              <h2 className="text-3xl font-bold text-white">From search to study session</h2>
            </div>
            <p className="max-w-md text-slate-300">A simple place to find helpful material or share what you’ve learned.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { number: "01", title: "Find your subject", text: "Search notes and materials by topic or course.", accent: "border-cyan-400" },
              { number: "02", title: "Choose a resource", text: "Compare notes, assignments, papers, and presentations.", accent: "border-blue-400" },
              { number: "03", title: "Share your work", text: "Upload useful materials for students in your community.", accent: "border-fuchsia-400" },
            ].map((step) => (
              <article key={step.number} className={`fade-up translate-y-4 opacity-0 min-h-44 rounded-lg border border-slate-700 border-t-2 ${step.accent} bg-slate-800/60 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-slate-500 hover:bg-slate-800`}>
                <p className="text-sm font-bold text-slate-500">{step.number}</p>
                <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-24 border-t border-slate-700 pt-16 fade-up translate-y-4 opacity-0 transition-all duration-700">
          <p className="mb-2 text-sm font-semibold uppercase text-fuchsia-300">A shared campus library</p>
          <h2 className="text-3xl font-bold text-white">Resources for every part of the semester</h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              "Class notes",
              "Assignments",
              "Previous year papers",
              "Question banks",
              "Presentations",
              "Research papers",
              "Reports",
              "Project documents",
              "Posters",
              "Revision guides",
            ].map((type, index) => (
              <article
                key={type}
                className={`fade-up translate-y-4 opacity-0 min-h-32 rounded-lg border border-slate-700 border-t-2 ${
                  index % 3 === 0 ? "border-t-cyan-400" : index % 3 === 1 ? "border-t-blue-400" : "border-t-fuchsia-400"
                } bg-slate-800/60 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-slate-500 hover:bg-slate-800`}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-md text-xs font-bold ${
                  index % 3 === 0
                    ? "bg-cyan-400/10 text-cyan-300"
                    : index % 3 === 1
                      ? "bg-blue-400/10 text-blue-300"
                      : "bg-fuchsia-400/10 text-fuchsia-300"
                }`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-semibold text-slate-100">{type}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-24 flex flex-col items-start justify-between gap-8 border-t border-slate-700 pt-14 sm:flex-row sm:items-center fade-up translate-y-4 opacity-0 transition-all duration-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Have something worth sharing?</h2>
            <p className="mt-3 text-slate-300">Add your notes to the library and help another student prepare.</p>
          </div>
          <Link href="/upload" className="shrink-0 rounded-lg bg-fuchsia-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:ring-offset-2 focus:ring-offset-slate-950">
            Upload notes
          </Link>
        </section>
      </div>
    </div>
  );
}
