"use client";

import { useRef, useState, type FormEvent } from "react";

const MAX_FEEDBACK_LENGTH = 2000;
const SUCCESS_MESSAGE =
  "Thank you for your feedback! Your response has been submitted successfully.";

interface FeedbackResponse {
  message?: string;
}

export default function FooterFeedbackForm() {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const submissionInProgress = useRef(false);

  const submitFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedFeedback = feedback.trim();
    if (!trimmedFeedback || submissionInProgress.current) return;

    submissionInProgress.current = true;
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: trimmedFeedback }),
      });
      const result = await response.json().catch(() => ({} as FeedbackResponse));
      if (!response.ok) {
        throw new Error(result.message || "Could not submit your feedback. Please try again.");
      }

      setFeedback("");
      setSuccessMessage(SUCCESS_MESSAGE);
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message !== "Failed to fetch"
          ? error.message
          : "Could not submit your feedback. Check your connection and try again."
      );
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <section className="sm:col-span-2 lg:col-span-2" aria-labelledby="footer-feedback-heading">
      <h3 id="footer-feedback-heading" className="mb-2 text-xl font-semibold text-white">
        Share Your Feedback
      </h3>
      <form onSubmit={submitFeedback}>
        <label className="sr-only" htmlFor="footer-feedback">
          Your feedback
        </label>
        <textarea
          id="footer-feedback"
          name="feedback"
          required
          maxLength={MAX_FEEDBACK_LENGTH}
          rows={5}
          value={feedback}
          onChange={(event) => {
            setFeedback(event.target.value);
            setSuccessMessage("");
            setErrorMessage("");
          }}
          placeholder="Help us improve NotesHub! Share any issues you&apos;re facing, report errors, or suggest features you&apos;d like to see."
          aria-describedby="footer-feedback-count"
          className="min-h-32 w-full resize-y rounded-lg border border-gray-600 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
        />
        <div className="mt-1 flex items-center justify-between gap-3">
          <span id="footer-feedback-count" className="text-xs text-gray-500">
            {feedback.length}/{MAX_FEEDBACK_LENGTH}
          </span>
          <button
            type="submit"
            disabled={!feedback.trim() || isSubmitting}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
        {successMessage && (
          <p className="mt-3 text-sm text-emerald-300" role="status" aria-live="polite">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="mt-3 text-sm text-red-300" role="alert">
            {errorMessage}
          </p>
        )}
      </form>
    </section>
  );
}
