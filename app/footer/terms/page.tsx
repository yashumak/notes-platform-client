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
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
        <p className="text-gray-700 mb-4">
          By using Notes Platform, you agree to upload only content you have the
          right to share and to respect intellectual property rights.
        </p>
        <p className="text-gray-700 mb-4">
          We are not responsible for the accuracy of user-uploaded content. We
          may remove content that violates these terms or applicable laws.
        </p>
        <p className="text-gray-700">
          Continued use of the platform constitutes acceptance of updates to these
          terms. If you do not agree, please discontinue use.
        </p>
      </div>
    </div>
  );
}
