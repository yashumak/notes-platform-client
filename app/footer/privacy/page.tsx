/**
 * PrivacyPage Component
 *
 * This component renders the "Privacy Policy" page for the Notes Platform. It details
 * how user data is collected, used, stored, and protected. It also explains user
 * rights regarding their personal information. The content is static and styled
 * using Tailwind CSS.
 *
 * @returns {JSX.Element} The Privacy Policy page.
 */
export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-30 text-slate-100">
      <article className="mx-auto max-w-4xl">
        <header className="border-b border-slate-700 pb-10">
          <p className="mb-3 text-sm font-semibold uppercase text-cyan-300">Policies</p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Privacy</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            A clear overview of the information used to provide your NotesHub account and study library.
          </p>
        </header>

        <div className="divide-y divide-slate-700">
          <section className="py-8">
            <h2 className="text-xl font-semibold text-cyan-200">Information we use</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Account and profile details, including your name, email, university, course, and year, help provide account features. Uploaded materials and their descriptions are stored so they can be listed and downloaded.
            </p>
          </section>
          <section className="py-8">
            <h2 className="text-xl font-semibold text-blue-200">How it is used</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Information is used to operate the platform, display study materials, and support account access. We do not sell personal information.
            </p>
          </section>
          <section className="py-8">
            <h2 className="text-xl font-semibold text-fuchsia-200">Requests and questions</h2>
            <p className="mt-3 leading-7 text-slate-300">
              To ask about your information or request account and content removal, email <a className="text-cyan-300 underline underline-offset-4 hover:text-cyan-100" href="mailto:genteryourname296@gmail.com">genteryourname296@gmail.com</a>.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
