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
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-700 mb-4">
          We collect minimal data necessary for account management and platform
          functionality, such as your name, email, and uploaded materials.
        </p>
        <p className="text-gray-700 mb-4">
          Your data is not sold. We use security measures to protect information
          and only share data when required by law or to operate core services.
        </p>
        <p className="text-gray-700">
          You may request deletion of your account and uploaded content. For
          privacy inquiries, contact support.
        </p>
      </div>
    </div>
  );
}
