import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-6">NotesPlatform</h2>

        <nav className="space-y-3">
          <Link href="/dashboard" className="block py-2 px-3 rounded-lg hover:bg-gray-100">🏠 Dashboard</Link>
          <Link href="/upload" className="block py-2 px-3 rounded-lg hover:bg-gray-100">📤 Upload Notes</Link>
          <Link href="/notes" className="block py-2 px-3 rounded-lg hover:bg-gray-100">📚 Browse Notes</Link>
          <Link href="/profile" className="block py-2 px-3 rounded-lg hover:bg-gray-100">👤 Profile</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        
        {/* User Profile Box */}
        <div className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center text-xl font-bold">
            U
          </div>
          <div>
            <h3 className="text-xl font-semibold">Welcome, User</h3>
            <p className="text-gray-600 text-sm">Have a productive day ✨</p>
          </div>
        </div>

        {/* Recently Uploaded Notes */}
        <h3 className="text-lg font-bold mb-3">Recently Uploaded Notes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((note) => (
            <div
              key={note}
              className="bg-white p-4 shadow rounded-xl hover:shadow-lg transition"
            >
              <h4 className="font-semibold">Notes Title {note}</h4>
              <p className="text-sm text-gray-600 mt-2">Short description here...</p>
              <a
                href="#"
                className="text-blue-600 text-sm font-medium mt-3 inline-block"
              >
                View Note →
              </a>
            </div>
          ))}
        </div>

        {/* Recommended Notes */}
        <h3 className="text-lg font-bold mb-3">Recommended For You</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((note) => (
            <div
              key={note}
              className="bg-white p-4 shadow rounded-xl hover:shadow-lg transition"
            >
              <h4 className="font-semibold">Recommended Note {note}</h4>
              <p className="text-sm text-gray-600 mt-2">Helpful study material...</p>
              <a
                href="#"
                className="text-blue-600 text-sm font-medium mt-3 inline-block"
              >
                View Note →
              </a>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
