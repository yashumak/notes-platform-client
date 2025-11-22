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
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-4">Help / FAQ</h1>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">How do I upload notes?</h2>
            <p className="text-gray-700">Go to the Upload page, fill details, and attach your file.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Can I edit or delete my notes?</h2>
            <p className="text-gray-700">Yes, from your dashboard you can manage your uploads.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Is downloading free?</h2>
            <p className="text-gray-700">Yes. Notes are shared to help the community learn.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">How do I report an issue?</h2>
            <p className="text-gray-700">Use the Contact page to reach support with details.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
