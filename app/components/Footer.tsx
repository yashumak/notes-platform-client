import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-10 text-gray-300 sm:py-12">
      <div className="mx-auto mt-0 grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-2 sm:gap-10 sm:px-6 lg:grid-cols-4">

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
            <li><Link href="/dashboard" className="hover:text-white">dashboard</Link></li>
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
          <h3 className="text-xl font-semibold cursor-pointer text-white mb-4">Connect With Us</h3>
          <a className="break-all text-gray-400 transition-colors hover:text-white" href="mailto:genteryourname296@gmail.com">Email: genteryourname296@gmail.com</a>

        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 border-t border-gray-700 px-4 pt-6 text-center text-gray-400 sm:mt-10 sm:px-6">
        <p className="text-sm sm:text-base">
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
