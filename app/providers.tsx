"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import {
  anonymousSession,
  checkingSession,
  fetchSessionIdentity,
  noteKeys,
  sessionIdentityKey,
} from "./notes/queries";
import { ApiResponseError } from "./auth/apiErrors";

export default function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            gcTime: 5 * 60_000,
            retry: (failureCount, error) =>
              !(error instanceof ApiResponseError && error.status === 429) &&
              failureCount < 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    const channel = typeof BroadcastChannel === "undefined"
      ? undefined
      : new BroadcastChannel("noteshub-auth");
    const refreshSession = async (broadcast: boolean) => {
      await queryClient.cancelQueries({ queryKey: sessionIdentityKey, exact: true });
      queryClient.setQueryData(sessionIdentityKey, checkingSession);
      queryClient.removeQueries({ queryKey: noteKeys.root });
      if (broadcast) channel?.postMessage("session-changed");

      try {
        await queryClient.fetchQuery({
          queryKey: sessionIdentityKey,
          queryFn: () => fetchSessionIdentity(),
          staleTime: 0,
        });
      } catch (error) {
        console.error("Could not verify the session after an authentication change.", error);
        queryClient.setQueryData(sessionIdentityKey, anonymousSession);
      }
    };
    const onAuthStateUpdated = () => void refreshSession(true);
    if (channel) channel.onmessage = () => void refreshSession(false);

    window.addEventListener("auth-state-updated", onAuthStateUpdated);
    return () => {
      window.removeEventListener("auth-state-updated", onAuthStateUpdated);
      channel?.close();
    };
  }, [queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
