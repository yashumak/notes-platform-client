/**
 * AboutPage Component
 *
 * This component renders the "About Us" page for the Notes Platform. It provides
 * information about the platform's mission, purpose, and how it benefits users.
 * The content is static and styled using Tailwind CSS for a clean, readable layout.
 *
 * @returns {JSX.Element} The About Us page.
 */
export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-30 text-slate-100">
      <div className="mx-auto max-w-4xl">
        <header className="border-b border-slate-700 pb-10">
          <p className="mb-3 text-sm font-semibold uppercase text-cyan-300">About NotesHub</p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Learning gets better when we share.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            NotesHub helps students find and share useful study materials across subjects, courses, and universities.
          </p>
        </header>

        <div className="grid gap-10 border-b border-slate-700 py-10 md:grid-cols-2 md:gap-14">
          <section>
            <h2 className="text-xl font-semibold text-cyan-200">Our purpose</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Make study resources easier to discover, organized by the details students need, and available to a wider learning community.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-fuchsia-200">Built for sharing</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Browse notes, assignments, papers, question banks, presentations, and other materials. Share resources you have the right to distribute to help another student prepare.
            </p>
          </section>
        </div>

        <p className="pt-8 text-sm text-slate-400">
          A student-powered library for learning, revision, and discovery.
        </p>
      </div>
    </main>
  );
}
