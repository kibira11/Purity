/** Map Supabase / network errors to text people can act on. */
export function friendlyAuthError(message: string): string {
  const m = message.trim();
  if (!m || /failed to fetch/i.test(m) || /networkerror/i.test(m) || /load failed/i.test(m)) {
    return "Could not reach your account server. Check your internet connection, or whether your Supabase project is paused.";
  }
  if (/rate limit/i.test(m) || /over_email_send_rate_limit/i.test(m)) {
    return "Too many sign-in emails were sent recently (Supabase free limit). Wait about an hour and try again, or enable custom SMTP in Supabase.";
  }
  if (/provider is not enabled/i.test(m) || /unsupported provider/i.test(m)) {
    return "Google sign-in is not turned on yet. In Supabase go to Authentication → Providers → Google and enable it (see README).";
  }
  return m;
}