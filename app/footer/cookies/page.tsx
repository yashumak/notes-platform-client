/**
 * CookiesPage Component
 *
 * This component renders the "Cookies Policy" page for the Notes Platform. It informs
 * users about the types of cookies used, their purpose, and how users can manage
 * their cookie preferences. The content is static and styled using Tailwind CSS.
 *
 * @returns {JSX.Element} The Cookies Policy page.
 */
export default function CookiesPage() {
  return (
    <main className="min-h-screen px-4 py-20 text-slate-100 sm:px-6 sm:py-30">
      <article className="mx-auto max-w-4xl">
        <header className="border-b border-slate-700 pb-10">
          <p className="mb-3 text-sm font-semibold uppercase text-cyan-300">Policies</p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Cookies</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            How essential browser storage supports sign-in and the basic operation of NotesHub.
          </p>
        </header>

        <div className="divide-y divide-slate-700">
          <section className="py-8">
            <h2 className="text-xl font-semibold text-cyan-200">Essential cookies</h2>
            <p className="mt-3 leading-7 text-slate-300">
              NotesHub uses an authentication cookie to maintain your signed-in session and protect account features. The site needs this cookie to provide functions such as uploading materials.
            </p>
          </section>
          <section className="py-8">
            <h2 className="text-xl font-semibold text-blue-200">Your browser controls</h2>
            <p className="mt-3 leading-7 text-slate-300">
              You can view, block, or remove cookies through your browser settings. Blocking essential cookies may prevent sign-in and other account features from working.
            </p>
          </section>
          <section className="py-8">
            <h2 className="text-xl font-semibold text-fuchsia-200">Questions</h2>
            <p className="mt-3 leading-7 text-slate-300">
              For questions about this policy, contact <a className="break-all text-cyan-300 underline underline-offset-4 hover:text-cyan-100" href="mailto:genteryourname296@gmail.com">genteryourname296@gmail.com</a>.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
