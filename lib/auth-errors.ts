/** Map Supabase / network errors to text people can act on. */
export function friendlyAuthError(message: string): string {
  const m = message.trim();
  if (!m || /failed to fetch/i.test(m) || /networkerror/i.test(m) || /load failed/i.test(m)) {
    return "Could not reach your account server. Check your internet connection, or whether your Supabase project is paused.";
  }
  return m;
}