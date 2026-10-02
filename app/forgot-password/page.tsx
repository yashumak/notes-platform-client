"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    if (!newPassword) newErrors.newPassword = "New password is required";
    if (newPassword.length < 6) newErrors.newPassword = "Password must be 6+ characters";
    if (confirmPassword !== newPassword) newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email, newPassword },
        { withCredentials: true }
      );

      alert(response.data.message || "Password updated successfully!");
      router.push("/login");
    } catch (error) {
      if (error.response) {
        setErrors({ api: error.response.data.message });
      } else {
        setErrors({ api: "Something went wrong!" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-2">Reset Password</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {errors.api && (
            <p className="text-red-500 text-sm text-center">{errors.api}</p>
          )}

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium">Email Address</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* New Password */}
          <div>
            <label className="block mb-1 text-sm font-medium">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white transition ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Updating..." : "Reset Password"}
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
