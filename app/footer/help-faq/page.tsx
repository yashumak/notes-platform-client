/**
 * HelpFaqPage Component
 *
 * This component renders the "Help / FAQ" page for the Notes Platform. It provides
 * answers to frequently asked questions, covering topics such as uploading notes,
 * managing content, downloading, and reporting issues. The content is static and
 * styled using Tailwind CSS.
 *
 * @returns {JSX.Element} The Help / FAQ page.
 */
export default function HelpFaqPage() {
  return (
    <main className="min-h-screen px-4 py-20 text-slate-100 sm:px-6 sm:py-30">
      <div className="mx-auto max-w-4xl">
        <header className="border-b border-slate-700 pb-10">
          <p className="mb-3 text-sm font-semibold uppercase text-cyan-300">Help center</p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Frequently asked questions</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Quick answers about sharing and finding study materials.</p>
        </header>

        <div className="divide-y divide-slate-700">
          <details className="group py-6">
            <summary className="cursor-pointer list-none pr-8 text-lg font-semibold text-white marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
              How do I upload notes?<span className="float-right text-cyan-300 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 max-w-3xl leading-7 text-slate-300">Open the Upload page, choose your file, add its course details, then select Upload study material.</p>
          </details>
          <details className="group py-6">
            <summary className="cursor-pointer list-none pr-8 text-lg font-semibold text-white marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
              What materials can I share?<span className="float-right text-cyan-300 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 max-w-3xl leading-7 text-slate-300">Notes, assignments, papers, question banks, presentations, reports, and other resources you have permission to share.</p>
          </details>
          <details className="group py-6">
            <summary className="cursor-pointer list-none pr-8 text-lg font-semibold text-white marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
              Is downloading free?<span className="float-right text-cyan-300 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 max-w-3xl leading-7 text-slate-300">Yes. Study materials are shared to help the student community learn.</p>
          </details>
          <details className="group py-6">
            <summary className="cursor-pointer list-none pr-8 text-lg font-semibold text-white marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
              How do I report a problem?<span className="float-right text-cyan-300 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 max-w-3xl leading-7 text-slate-300">
              Email <a className="break-all text-cyan-300 underline underline-offset-4 hover:text-cyan-100" href="mailto:genteryourname296@gmail.com">genteryourname296@gmail.com</a> with the page or material details.
            </p>
          </details>
        </div>
      </div>
    </main>
  );
}
