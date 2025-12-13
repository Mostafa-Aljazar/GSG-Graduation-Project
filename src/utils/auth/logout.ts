import { cookieClient } from "./cookies/clientCookies";

// utils/auth/logout.ts
export async function logout(redirect = true) {
  try {
    // call server to clear cookie (server route sets Set-Cookie to expire)
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  } catch (err) {
    // ignore network errors and continue clearing client cookie
    console.error('Logout request failed', err);
  }

  // clear client-side cookie
  cookieClient.clear();

  // redirect to login page if running in browser
  if (redirect && typeof window !== 'undefined') {
    window.location.href = '/';
  }
}
