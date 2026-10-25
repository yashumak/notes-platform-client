export function getRedirectDestination(fallback: string): string {
  const requestedDestination = new URLSearchParams(window.location.search).get("redirect");
  if (!requestedDestination) return fallback;

  const destinationUrl = new URL(requestedDestination, window.location.origin);
  return destinationUrl.origin === window.location.origin
    ? `${destinationUrl.pathname}${destinationUrl.search}${destinationUrl.hash}`
    : fallback;
}
