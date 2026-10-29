/**
 * TermsPage Component
 *
 * This component renders the "Terms & Conditions" page for the Notes Platform. It outlines
 * the rules and guidelines users must adhere to when using the platform, including
 * content submission, intellectual property, and disclaimers. The content is static
 * and styled using Tailwind CSS.
 *
 * @returns {JSX.Element} The Terms & Conditions page.
 */
export default function TermsPage() {
  return (
    <main className="min-h-screen px-4 py-20 text-slate-100 sm:px-6 sm:py-30">
      <article className="mx-auto max-w-4xl">
        <header className="border-b border-slate-700 pb-10">
          <p className="mb-3 text-sm font-semibold uppercase text-cyan-300">Policies</p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Terms of use</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Guidelines for using NotesHub and contributing material to the student community.
          </p>
        </header>

        <div className="divide-y divide-slate-700">
          <section className="py-8">
            <h2 className="text-xl font-semibold text-cyan-200">Sharing content</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Upload only materials you created or have permission to share. Respect copyrights, privacy, and the rights of other students.
            </p>
          </section>
          <section className="py-8">
            <h2 className="text-xl font-semibold text-blue-200">Using shared materials</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Materials are provided for study support. Check their accuracy and suitability before relying on them; user submissions may contain errors or become outdated.
            </p>
          </section>
          <section className="py-8">
            <h2 className="text-xl font-semibold text-fuchsia-200">Moderation and questions</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Content that violates these terms or applicable law may be removed. For questions about these terms, contact <a className="break-all text-cyan-300 underline underline-offset-4 hover:text-cyan-100" href="mailto:genteryourname296@gmail.com">genteryourname296@gmail.com</a>.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
