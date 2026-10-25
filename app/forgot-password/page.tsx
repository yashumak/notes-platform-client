"use client";

import { useState, type FormEvent } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PasswordInput from "../components/PasswordInput";

interface ForgotPasswordErrors {
  email?: string;
  newPassword?: string;
  confirmPassword?: string;
  api?: string;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    const validationErrors: ForgotPasswordErrors = {};
    if (!email.trim()) validationErrors.email = "Email is required.";
    if (!newPassword) validationErrors.newPassword = "New password is required.";
    else if (newPassword.length < 6) {
      validationErrors.newPassword = "Password must be at least 6 characters.";
    }
    if (!confirmPassword) {
      validationErrors.confirmPassword = "Please confirm your new password.";
    } else if (confirmPassword !== newPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "/api/auth/forgot-password",
        { email: email.trim(), newPassword },
        { withCredentials: true }
      );
      router.replace("/login");
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      setErrors({ api: message || "Could not update your password. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <section className="w-full max-w-md rounded-xl border border-slate-700 border-t-2 border-t-cyan-400 bg-slate-900/90 p-7 shadow-2xl shadow-slate-950/40 sm:p-9">
        <p className="mb-3 text-center text-sm font-semibold uppercase text-cyan-300">
          Account recovery
        </p>
        <h1 className="mb-2 text-center text-3xl font-bold text-white">Reset Password</h1>
        <p className="mb-7 text-center text-slate-400">
          Choose a new password for your NotesHub account.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {errors.api && (
            <p role="alert" className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-center text-sm text-rose-200">
              {errors.api}
            </p>
          )}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            />
            {errors.email && <p id="email-error" className="mt-2 text-sm text-rose-300">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-slate-200">
              New Password
            </label>
            <PasswordInput
              id="new-password"
              autoComplete="new-password"
              placeholder="Enter a new password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              aria-invalid={Boolean(errors.newPassword)}
              aria-describedby={errors.newPassword ? "new-password-error" : undefined}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            />
            {errors.newPassword && <p id="new-password-error" className="mt-2 text-sm text-rose-300">{errors.newPassword}</p>}
          </div>

          <div>
            <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-slate-200">
              Confirm New Password
            </label>
            <PasswordInput
              id="confirm-password"
              autoComplete="new-password"
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            />
            {errors.confirmPassword && <p id="confirm-password-error" className="mt-2 text-sm text-rose-300">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg py-3 font-semibold text-white shadow-lg shadow-cyan-950/30 transition focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              loading
                ? "cursor-not-allowed bg-slate-700 text-slate-400"
                : "bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
            }`}
          >
            {loading ? "Updating password..." : "Update Password"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-400">
          Remembered your password?{" "}
          <Link href="/login" className="font-medium text-cyan-300 transition-colors hover:text-cyan-200 hover:underline">
            Back to Login
          </Link>
        </p>
      </section>
    </main>
  );
}
