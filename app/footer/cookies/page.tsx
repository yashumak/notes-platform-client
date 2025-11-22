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
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-4">Cookies Policy</h1>
        <p className="text-gray-700 mb-4">
          We use cookies to improve site functionality, remember preferences, and
          analyze usage to enhance the user experience.
        </p>
        <p className="text-gray-700 mb-4">
          You can control cookies through your browser settings. By continuing to
          use this site, you consent to our use of cookies as described here.
        </p>
        <p className="text-gray-700">
          Essential cookies keep the site running. Analytics cookies help us
          understand performance. No cookies are used to sell personal data.
        </p>
      </div>
    </div>
  );
}
