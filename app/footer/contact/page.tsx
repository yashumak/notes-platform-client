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
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-4">Contact</h1>
        <p className="text-gray-700 mb-4">
          Reach out for support, feedback, or partnership inquiries.
        </p>
        <div className="space-y-2 text-gray-700">
          <p>Email: support@noteshub.example</p>
          <p>Response Time: 1–3 business days</p>
        </div>
      </div>
    </div>
  );
}