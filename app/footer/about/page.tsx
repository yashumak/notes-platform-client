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
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-4">About</h1>
        <p className="text-gray-700 mb-4">
          Notes Platform helps students share, browse, and download study materials
          across subjects and semesters. Our goal is to make learning resources
          accessible, organized, and easy to discover.
        </p>
        <p className="text-gray-700">
          Upload your notes to help others. Explore curated content, search by
          categories and tags, and find what you need faster.
        </p>
      </div>
    </div>
  );
}
