"use client";

import { useEffect, useState } from "react";

type ToastKind = "success" | "error";

interface ToastMessage {
  message: string;
  kind: ToastKind;
  id: number;
}

interface ToastEventDetail {
  message: string;
  kind: ToastKind;
}

export function showToast(message: string, kind: ToastKind = "success") {
  window.dispatchEvent(
    new CustomEvent<ToastEventDetail>("app-toast", { detail: { message, kind } })
  );
}

export default function ToastNotifications() {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const detail = (event as CustomEvent<ToastEventDetail>).detail;
      setToast({ ...detail, id: Date.now() });
    };

    window.addEventListener("app-toast", handleToast);
    return () => window.removeEventListener("app-toast", handleToast);
  }, []);

  if (!toast) return null;

  const isSuccess = toast.kind === "success";

  return (
    <div
      key={toast.id}
      role={isSuccess ? "status" : "alert"}
      aria-live={isSuccess ? "polite" : "assertive"}
      onAnimationEnd={() => setToast((current) => current?.id === toast.id ? null : current)}
      className={`fixed right-4 top-20 z-[60] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur-md sm:right-6 ${
        isSuccess
          ? "border-emerald-300/30 bg-slate-900/95 text-emerald-100 shadow-emerald-950/30"
          : "border-rose-300/30 bg-slate-900/95 text-rose-100 shadow-rose-950/30"
      }`}
      style={{ animation: "toast-lifecycle 2s ease-in-out both" }}
    >
      <span
        aria-hidden="true"
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isSuccess ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/15 text-rose-300"
        }`}
      >
        {isSuccess ? "✓" : "!"}
      </span>
      <span>{toast.message}</span>
    </div>
  );
}
