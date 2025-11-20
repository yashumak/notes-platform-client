export default function Home() {
  return (
    <div className="px-6 py-12 max-w-5xl mx-auto">
      {/* Hero */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Share & Download Notes Easily
        </h1>
        <p className="text-gray-600 mb-6">
          Upload your notes and help others learn faster. Access notes from students worldwide.
        </p>

        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
            Upload Notes
          </button>
          <button className="px-6 py-3 bg-gray-200 rounded-lg">
            Browse Notes
          </button>
        </div>
      </section>

      {/* Search */}
      <div className="flex justify-center mt-10">
        <input
          type="text"
          placeholder="Search notes..."
          className="w-full max-w-xl px-4 py-3 border rounded-lg shadow-sm"
        />
      </div>

      {/* Trending Notes */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-4">Trending Notes</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4 border rounded-lg shadow-sm">
              <h3 className="font-bold">Sample Note {item}</h3>
              <p className="text-sm text-gray-600">Short description...</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
