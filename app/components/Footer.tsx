import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Logo + About */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-blue-400">NotesHub</h2>
          <p className="text-white leading-relaxed">
            A collaborative platform for students to upload, share, and explore
            high-quality study materials across all universities.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/notes" className="hover:text-white">Notes</Link></li>
            <li><Link href="/upload" className="hover:text-white">Upload Notes</Link></li>
            <li><Link href="/signup" className="hover:text-white">Signup</Link></li>
            <li><Link href="/login" className="hover:text-white">Login</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Resources</h3>
          <ul className="space-y-2">
            <li><Link href="/footer/about" className="hover:text-white">About</Link></li>
            <li><Link href="/footer/cookies" className="hover:text-white">Cookies</Link></li>
            <li><Link href="/footer/help-faq" className="hover:text-white">Help-FAQ</Link></li> 
            <li><Link href="/footer/privacy" className="hover:text-white">Privacy</Link></li>
            <li><Link href="/footer/terms" className="hover:text-white">Terms & Conditions</Link></li> 
          </ul>
        </div>

        {/* Contact + Socials */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Connect With Us</h3>
          <p className="text-gray-400">Email: support@noteshub.com</p>

          <div className="flex gap-4 mt-4">
            <span className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer">
              <i className="fa-brands fa-instagram text-white text-lg" />
            </span>
            <span className="w-9 h-9 bg-gray-800 hover:bg-blue-500 rounded-full flex items-center justify-center cursor-pointer">
              <i className="fa-brands fa-facebook text-white text-lg" />
            </span>
            <span className="w-9 h-9 bg-gray-800 hover:bg-sky-400 rounded-full flex items-center justify-center cursor-pointer">
              <i className="fa-brands fa-twitter text-white text-lg" />
            </span>
            <span className="w-9 h-9 bg-gray-800 hover:bg-red-500 rounded-full flex items-center justify-center cursor-pointer">
              <i className="fa-brands fa-youtube text-white text-lg" />
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center border-t border-gray-700 mt-10 pt-6 text-gray-400">
        <p>
          © {new Date().getFullYear()} <span className="text-white font-semibold">NotesHub</span>.
          All Rights Reserved.
        </p>
        <p className="mt-1 text-sm">
          Made with <span className="text-red-500">❤️</span> by <span className="text-white font-medium">Yash Patil</span>
        </p>
      </div>
    </footer>
  );
}
