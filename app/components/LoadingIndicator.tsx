"use client";

import { useEffect, useState } from "react";

interface LoadingIndicatorProps {
  label: string;
  compact?: boolean;
  className?: string;
  progress?: number;
}

export default function LoadingIndicator({
  label,
  compact = false,
  className = "",
  progress,
}: LoadingIndicatorProps) {
  const spinnerSize = compact ? "h-4 w-4" : "h-9 w-9";
  const [estimatedProgress, setEstimatedProgress] = useState(4);
  const percentage = Math.round(Math.max(0, Math.min(100, progress ?? estimatedProgress)));

  useEffect(() => {
    if (compact || progress !== undefined) return;
    const timer = window.setInterval(() => {
      setEstimatedProgress((value) => Math.min(95, value + Math.max(1, Math.ceil((95 - value) * 0.08))));
    }, 250);
    return () => window.clearInterval(timer);
  }, [compact, progress]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={compact ? label : `${label}, ${percentage}% complete`}
      className={`flex items-center ${compact ? "inline-flex gap-2" : "flex-col gap-3"} ${className}`}
    >
      {compact ? (
        <span
          className={`${spinnerSize} rounded-full border-2 border-slate-500 border-t-cyan-200 motion-safe:animate-spin motion-reduce:border-cyan-200`}
          aria-hidden="true"
        />
      ) : (
        <>
          <span className="relative flex h-20 w-20 items-center justify-center" aria-hidden="true">
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="3" />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="url(#loading-progress-gradient)"
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={2 * Math.PI * 44 * (1 - percentage / 100)}
                strokeLinecap="round"
                strokeWidth="3.5"
                className="transition-[stroke-dashoffset] duration-300 ease-out"
              />
              <defs>
                <linearGradient id="loading-progress-gradient">
                  <stop stopColor="#22D3EE" />
                  <stop offset="1" stopColor="#818CF8" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-2 rounded-full border border-dashed border-cyan-300/30 loading-orbit" />
            <span className="absolute inset-4 rounded-full border border-blue-300/20" />
            <span className="absolute right-2 top-3 h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />
            <svg
              viewBox="0 0 32 38"
              className="relative z-10 h-9 w-8 drop-shadow-[0_8px_12px_rgba(34,211,238,0.3)] loading-note"
              fill="none"
            >
              <path
                d="M5 2.75h14l8 8V33a2.25 2.25 0 0 1-2.25 2.25H5A2.25 2.25 0 0 1 2.75 33V5A2.25 2.25 0 0 1 5 2.75Z"
                fill="#E0F2FE"
                stroke="#67E8F9"
                strokeWidth="1.5"
              />
              <path d="M19 3v7a1 1 0 0 0 1 1h7" fill="#BAE6FD" stroke="#67E8F9" strokeWidth="1.5" />
              <path d="M8 17h14M8 22h14M8 27h9" stroke="#0891B2" strokeLinecap="round" strokeWidth="1.5" />
            </svg>
            <span className="absolute bottom-2 h-1.5 w-8 rounded-full bg-cyan-300/20 blur-sm" />
          </span>
          <span className="text-center">
            <span className="block text-sm font-medium text-slate-300">{label}</span>
            <span className="mt-1 block text-xs font-semibold tabular-nums text-cyan-200">{percentage}% complete</span>
          </span>
        </>
      )}
      {!compact && (
        <span className="flex items-center gap-1" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="h-1 w-1 rounded-full bg-cyan-300 motion-safe:animate-pulse"
              style={{ animationDelay: `${index * 180}ms` }}
            />
          ))}
        </span>
      )}
    </div>
  );
}
