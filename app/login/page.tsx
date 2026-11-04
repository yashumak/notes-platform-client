"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getRedirectDestination } from "../authRedirect";
import { showToast } from "../components/ToastNotifications";
import PasswordInput from "../components/PasswordInput";
import { encryptAuthPayload, prepareAuthEncryptionKey } from "../auth/encryptAuthPayload";
import { getApiErrorMessage } from "../auth/apiErrors";
import LoadingIndicator from "../components/LoadingIndicator";

interface LoginErrors {
  email?: string;
  password?: string;
  api?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void prepareAuthEncryptionKey().catch((error: unknown) => {
      console.warn("Login encryption key prefetch failed; it will be retried on submit.", error);
    });
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setErrors({});
    const newErrors: LoginErrors = {};

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "/api/auth/login",
        await encryptAuthPayload({ email, password }),
        { withCredentials: true }
      );

      showToast(response.data.message || "Login successful!");
      window.dispatchEvent(new Event("auth-state-updated"));
      router.replace(getRedirectDestination("/"));
    } catch (error: unknown) {
      setErrors({ api: getApiErrorMessage(error, "Something went wrong") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-slate-700 border-t-2 border-t-cyan-400 bg-slate-900/90 p-7 shadow-2xl shadow-slate-950/40 sm:p-9">

        <p className="mb-3 text-center text-sm font-semibold uppercase text-cyan-300">Welcome back</p>
        <h2 className="mb-2 text-center text-3xl font-bold text-white">Login</h2>
        <p className="mb-7 text-center text-slate-400">
          Welcome back! Please enter your credentials.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {errors.api && (
            <p className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-center text-sm text-rose-200">{errors.api}</p>
          )}

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-rose-300">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
            <PasswordInput
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            />

            {errors.password && (
              <p className="mt-2 text-sm text-rose-300">{errors.password}</p>
            )}

            {password.length > 0 && password.length < 7 && (
              <p className="mt-2 text-sm text-rose-300">
                Password must be at least 7 characters
              </p>
            )}
          </div>

          {/* Forgot password */}
          <div className="flex items-center justify-end">
            <a
              href="/forgot-password"
              className="text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200 hover:underline"
            >
              Change Password
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full rounded-lg py-3 font-semibold text-white shadow-lg shadow-cyan-950/30 transition focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900 ${loading
              ? "cursor-not-allowed bg-slate-700 text-slate-400"
              : "bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
              }`}
            disabled={loading}
          >
            {loading ? <LoadingIndicator label="Logging in..." compact /> : "Login"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-400">
          Don’t have an account?{" "}
          <a
            href="/signup"
            onClick={(event) => {
              const destination = getRedirectDestination("/");
              if (destination !== "/") {
                event.preventDefault();
                router.push(`/signup?redirect=${encodeURIComponent(destination)}`);
              }
            }}
            className="font-medium text-cyan-300 transition-colors hover:text-cyan-200 hover:underline"
          >
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}
