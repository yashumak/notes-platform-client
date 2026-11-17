"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getRateLimitMessage } from "./auth/apiErrors";

interface NoteSummary {
  total: number;
  universities: number;
  studyTypes: number;
}

export default function Home() {
  const [stats, setStats] = useState<NoteSummary>({ total: 0, universities: 0, studyTypes: 0 });
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/notes/stats", { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 429) {
          const errorData: { message?: string; retryAfterSeconds?: number } | null =
            await response.json().catch(() => null);
          const retryAfter = response.headers.get("retry-after");
          const retryAfterSeconds =
            typeof errorData?.retryAfterSeconds === "number"
              ? errorData.retryAfterSeconds
              : retryAfter && /^\d+$/.test(retryAfter)
                ? Number(retryAfter)
                : undefined;
          setStatsError(getRateLimitMessage(errorData?.message, retryAfterSeconds));
          return null;
        }
        if (!response.ok) throw new Error("Unable to load note totals");
        return response.json();
      })
      .then((data) => {
        if (data?.stats) setStats(data.stats);
      })
      .catch(() => undefined);

    const elements = document.querySelectorAll(".fade-up");
    const timers = Array.from(elements, (element, index) =>
      window.setTimeout(() => element.classList.add("opacity-100", "translate-y-0"), index * 120)
    );

    return () => {
      controller.abort();
      timers.forEach(window.clearTimeout);
    };
  }, []);

  return (
    <div className="text-white">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative isolate flex min-h-[680px] items-center overflow-hidden px-6 py-24 md:min-h-[780px] md:py-32 lg:min-h-[860px]">

        {/* Background image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=2400&q=85')",
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 -z-10 bg-slate-950/80" />

        {/* Subtle radial glow */}
        <div
          aria-hidden="true"
          className="absolute -z-10 left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-600/10 blur-3xl"
        />

        {/* Floating decorative cards – right side, hidden on small screens */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-4 xl:flex"
        >
          {[
            { label: "Unit 3 – Data Structures", sub: "CS Engineering · 2024", accent: "border-cyan-400/50" },
            { label: "Applied Thermodynamics", sub: "Mechanical Engg · 2023", accent: "border-blue-400/50" },
            { label: "Previous Year Paper", sub: "Electronics · Mid Sem", accent: "border-fuchsia-400/50" },
          ].map((card, i) => (
            <div
              key={card.label}
              style={{ animationDelay: `${i * 0.4}s` }}
              className={`w-64 animate-[float_4s_ease-in-out_infinite] rounded-xl border ${card.accent} bg-slate-800/70 p-4 shadow-xl backdrop-blur-sm`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded bg-cyan-500/20 text-xs font-bold text-cyan-300">
                  PDF
                </span>
                <div className="h-2 flex-1 rounded bg-slate-600/60" />
              </div>
              <p className="text-sm font-semibold text-slate-100">{card.label}</p>
              <p className="mt-1 text-xs text-slate-400">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Hero content */}
        <div className="mx-auto w-full max-w-screen-xl fade-up translate-y-6 opacity-0 transition-all duration-700">
          <p className="mb-8 inline-flex items-center gap-2 border-l-2 border-cyan-400 pl-3 text-sm font-semibold uppercase tracking-widest text-cyan-200">
            NotesHub &middot; Student Academic Library
          </p>

          <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Your Knowledge.{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Your Resources.
            </span>{" "}
            Your Engineering Community.
          </h1>

          <p className="mt-8 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg sm:leading-9">
            Welcome to <span className="font-semibold text-cyan-200">NotesHub</span> – a collaborative academic
            resource-sharing platform built for engineering students. Discover, upload, organize, and share
            valuable educational materials from different engineering branches and universities. Whether you are
            preparing for semester examinations, completing assignments, working on projects, or revising
            important concepts, NotesHub brings useful academic resources together in one place.
          </p>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Learn together, contribute your knowledge, and make quality study resources accessible to everyone.
          </p>

          {/* Search bar */}
          <form action="/notes" method="get" className="mt-10 flex max-w-2xl flex-col gap-4 sm:flex-row">
            <label className="sr-only" htmlFor="home-note-search">Search study materials</label>
            <input
              id="home-note-search"
              name="q"
              type="search"
              placeholder="Search a subject, course, or topic…"
              className="min-w-0 flex-1 rounded-xl border border-white/20 bg-slate-950/70 px-5 py-4 text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/50"
            />
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Search Notes
            </button>
          </form>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/upload"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:-translate-y-0.5 hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Upload Study Material
            </Link>
            <Link
              href="/notes"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-fuchsia-300/60 bg-slate-950/50 px-7 py-3 text-sm font-semibold text-fuchsia-100 transition hover:-translate-y-0.5 hover:border-fuchsia-300 hover:bg-fuchsia-500/15 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Browse All Notes
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATISTICS ────────────────────────────────────────────────────── */}
      <section id="stats" className="border-y border-slate-700 bg-slate-950/50 px-6 py-14 md:py-16">
        <div className="mx-auto max-w-screen-xl">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-0">
            {[
              { label: "Shared study materials", value: stats.total, color: "text-cyan-300", glow: "bg-cyan-400/10" },
              { label: "Universities represented", value: stats.universities, color: "text-blue-300", glow: "bg-blue-400/10" },
              { label: "Material types", value: stats.studyTypes, color: "text-fuchsia-300", glow: "bg-fuchsia-400/10" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center gap-3 text-center sm:px-10 ${
                  index > 0 ? "sm:border-l sm:border-slate-700" : ""
                }`}
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${stat.glow}`}>
                  <p className={`text-5xl font-extrabold tabular-nums ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <p className="text-base font-medium text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
          {statsError && (
            <p role="status" className="mt-6 text-center text-sm text-slate-400">
              {statsError}
            </p>
          )}
        </div>
      </section>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-screen-xl px-6 py-28 sm:py-32">

        {/* ── GETTING STARTED ───────────────────────────────────────────── */}
        <section className="fade-up translate-y-6 opacity-0 transition-all duration-700">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Getting Started
              </p>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                From Search to Study Session
              </h2>
            </div>
            <p className="max-w-md text-slate-300">
              A simple, focused place to find helpful material or share what you have learned.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                number: "01",
                title: "Find Your Subject",
                text: "Explore educational materials using subjects, courses, and relevant topics. Use the search bar or browse by branch to quickly locate what you need.",
                accent: "border-t-cyan-400",
                icon: "🔍",
                iconBg: "bg-cyan-400/10 text-cyan-300",
              },
              {
                number: "02",
                title: "Explore Resources",
                text: "Discover notes, assignments, previous examination papers, presentations, and other academic documents uploaded by students from your community.",
                accent: "border-t-blue-400",
                icon: "📚",
                iconBg: "bg-blue-400/10 text-blue-300",
              },
              {
                number: "03",
                title: "Share Your Knowledge",
                text: "Upload useful educational materials and help other students learn. Every document you share strengthens the community library for everyone.",
                accent: "border-t-fuchsia-400",
                icon: "🚀",
                iconBg: "bg-fuchsia-400/10 text-fuchsia-300",
              },
            ].map((step) => (
              <article
                key={step.number}
                className={`fade-up translate-y-6 opacity-0 rounded-xl border border-slate-700 border-t-2 ${step.accent} bg-slate-800/60 p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-slate-500 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-950/40`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold tracking-widest text-slate-500">{step.number}</p>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg ${step.iconBg}`}>
                    {step.icon}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── PLATFORM INTRODUCTION ─────────────────────────────────────── */}
        <section className="mt-28 border-t border-slate-700 pt-20 fade-up translate-y-6 opacity-0 transition-all duration-700">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20 lg:items-center">

            {/* Text side */}
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-300">
                About NotesHub
              </p>
              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                Everything You Need for Your{" "}
                <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  Academic Journey
                </span>
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-300">
                NotesHub makes academic resource sharing simple and accessible. Students can discover
                learning materials, contribute their own documents, and explore resources organized
                around their academic needs.
              </p>

              <div className="mt-10 flex flex-col gap-6">
                {[
                  {
                    icon: "🔎",
                    title: "Discover",
                    text: "Find relevant academic materials quickly. Search by subject, course, university, or material type to get exactly what you need.",
                    color: "text-cyan-300",
                    bg: "bg-cyan-400/10",
                  },
                  {
                    icon: "📤",
                    title: "Contribute",
                    text: "Upload and share useful educational documents. Your notes, assignments, and papers could be exactly what another student is looking for.",
                    color: "text-blue-300",
                    bg: "bg-blue-400/10",
                  },
                  {
                    icon: "🎓",
                    title: "Learn",
                    text: "Access shared knowledge and prepare more effectively. Build on what others have contributed and strengthen your own understanding.",
                    color: "text-fuchsia-300",
                    bg: "bg-fuchsia-400/10",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-5">
                    <span className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${item.bg}`}>
                      {item.icon}
                    </span>
                    <div>
                      <h3 className={`text-base font-bold ${item.color}`}>{item.title}</h3>
                      <p className="mt-1 text-sm leading-7 text-slate-300">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual side */}
            <div className="hidden lg:block">
              <div className="relative rounded-2xl border border-slate-700 bg-slate-800/60 p-8 shadow-2xl">
                {/* Mock document cards */}
                <div className="flex flex-col gap-4">
                  {[
                    { title: "Data Structures – Unit 2 Notes", meta: "CS Engineering · B.Tech · 2024", tag: "Notes", tagColor: "bg-cyan-500/20 text-cyan-300" },
                    { title: "Previous Year Question Paper", meta: "Electronics & Comm · Mid Sem 2023", tag: "Paper", tagColor: "bg-blue-500/20 text-blue-300" },
                    { title: "Thermodynamics Assignment", meta: "Mechanical Engg · 3rd Year", tag: "Assignment", tagColor: "bg-fuchsia-500/20 text-fuchsia-300" },
                    { title: "Machine Learning PPT Slides", meta: "AI & ML Branch · Final Year", tag: "PPT", tagColor: "bg-emerald-500/20 text-emerald-300" },
                  ].map((doc) => (
                    <div
                      key={doc.title}
                      className="flex items-center gap-4 rounded-lg border border-slate-700 bg-slate-900/60 p-4 transition hover:border-slate-500 hover:bg-slate-900"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-sm font-bold text-slate-300">
                        PDF
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-100">{doc.title}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-400">{doc.meta}</p>
                      </div>
                      <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${doc.tagColor}`}>
                        {doc.tag}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Decorative glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"
                />
              </div>
            </div>

          </div>
        </section>

        {/* ── RESOURCE COLLECTIONS ──────────────────────────────────────── */}
        <section className="mt-28 border-t border-slate-700 pt-20 fade-up translate-y-6 opacity-0 transition-all duration-700">
          <div className="mb-14">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-fuchsia-300">
              Resource Collections
            </p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Resources for Every Part of the Semester
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              From day-one lecture notes to final examination prep — every material type you need is here.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { type: "Class Notes",           desc: "Lecture notes and in-class summaries.",              icon: "📝", accent: 0 },
              { type: "Assignments",           desc: "Solved and reference assignment documents.",          icon: "✏️", accent: 1 },
              { type: "Previous Year Papers",  desc: "Past semester and university exam papers.",           icon: "📄", accent: 2 },
              { type: "Question Banks",        desc: "Collections of important practice questions.",        icon: "❓", accent: 0 },
              { type: "Presentations",         desc: "Slide decks and visual study materials.",             icon: "📊", accent: 1 },
              { type: "Research Papers",       desc: "Academic papers and reference literature.",           icon: "🔬", accent: 2 },
              { type: "Reports",               desc: "Lab reports, project reports, and case studies.",     icon: "📋", accent: 0 },
              { type: "Project Documents",     desc: "Full project documentation and final submissions.",   icon: "🗂️", accent: 1 },
              { type: "Posters",               desc: "Academic and conference presentation posters.",       icon: "🖼️", accent: 2 },
              { type: "Revision Guides",       desc: "Quick-reference sheets and exam preparation guides.", icon: "📌", accent: 0 },
            ].map((item, index) => {
              const accentBorder  = ["border-t-cyan-400",    "border-t-blue-400",    "border-t-fuchsia-400"   ][item.accent];
              const accentIconBg  = ["bg-cyan-400/10",       "bg-blue-400/10",       "bg-fuchsia-400/10"      ][item.accent];
              const accentIconTxt = ["text-cyan-300",        "text-blue-300",        "text-fuchsia-300"       ][item.accent];
              return (
                <article
                  key={item.type}
                  style={{ transitionDelay: `${index * 40}ms` }}
                  className={`fade-up translate-y-6 opacity-0 rounded-xl border border-slate-700 border-t-2 ${accentBorder} bg-slate-800/60 p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-slate-500 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-950/40`}
                >
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl text-xl ${accentIconBg} ${accentIconTxt}`}>
                    {item.icon}
                  </span>
                  <h3 className="mt-4 font-bold text-slate-100">{item.type}</h3>
                  <p className="mt-2 text-xs leading-6 text-slate-400">{item.desc}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── UPLOAD CTA ────────────────────────────────────────────────── */}
        <section className="mt-28 border-t border-slate-700 pt-20 fade-up translate-y-6 opacity-0 transition-all duration-700">
          <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-950/80 p-10 sm:p-14 lg:p-16">

            {/* Background glows */}
            <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />

            <div className="relative flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-center">
              <div className="max-w-2xl">
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-fuchsia-300">
                  Contribute
                </p>
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  Your Notes Can Help{" "}
                  <span className="bg-gradient-to-r from-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                    Someone Succeed.
                  </span>
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-300">
                  Share your academic resources with the student community. Upload notes, assignments,
                  question papers, and other useful materials — and become part of a growing library
                  that helps engineering students across the country.
                </p>
              </div>

              <Link
                href="/upload"
                className="shrink-0 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-fuchsia-950/30 transition hover:-translate-y-0.5 hover:from-fuchsia-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Upload Notes →
              </Link>
            </div>
          </div>
        </section>

      </div>

      {/* ── Floating animation keyframe ───────────────────────────────────── */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>

    </div>
  );
}
