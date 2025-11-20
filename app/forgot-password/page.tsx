export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
        
        <h2 className="text-3xl font-bold text-center mb-2">Forgot Password</h2>
        <p className="text-center text-gray-500 mb-6">
          Don’t worry! Enter your email and we’ll send a reset link.
        </p>

        <form className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium">Email Address</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Remembered your password?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Go back to Login
          </a>
        </p>
      </div>
    </div>
  );
}
