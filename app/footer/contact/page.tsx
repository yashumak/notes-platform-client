/**
 * ContactPage Component
 *
 * This component renders the "Contact Us" page for the Notes Platform. It provides
 * information on how users can get in touch for support, feedback, or partnership
 * inquiries, including email contact details and expected response times. The content
 * is static and styled using Tailwind CSS.
 *
 * @returns {JSX.Element} The Contact Us page.
 */
export default function ContactPage() {
  return (
    <main className="min-h-screen px-6 py-30 text-slate-100">
      <div className="mx-auto max-w-4xl">
        <header className="border-b border-slate-700 pb-10">
          <p className="mb-3 text-sm font-semibold uppercase text-cyan-300">Contact</p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Let’s get in touch.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Send a note about support, feedback, content, or a possible collaboration.
          </p>
        </header>

        <section className="grid gap-8 py-10 sm:grid-cols-2 sm:gap-12">
          <div>
            <p className="text-sm font-semibold uppercase text-slate-400">Email</p>
            <a
              href="mailto:genteryourname296@gmail.com"
              className="mt-3 inline-block break-all text-xl font-semibold text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 transition-colors hover:text-cyan-100"
            >
              genteryourname296@gmail.com
            </a>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase text-slate-400">Response time</p>
            <p className="mt-3 text-xl font-semibold text-white">1–3 business days</p>
            <p className="mt-2 leading-7 text-slate-300">Please include enough detail for us to understand your question.</p>
          </div>
        </section>
      </div>
    </main>
  );
}