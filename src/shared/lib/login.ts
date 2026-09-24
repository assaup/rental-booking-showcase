export function getSafeRedirect(redirectTo: string | null): string {
  if (
    !redirectTo ||
    redirectTo.startsWith("//") ||
    redirectTo.startsWith("/\\")
  ) {
    return '/';
  }
  if (redirectTo.startsWith("/")) {
    return redirectTo;
  }
  return "/";
}
