import { clearSessionCookie } from "./cookies/serverCookies";

// utils/api.ts
export async function logout() {
  // await fetch("/auth/logout", { method: "POST" });
  clearSessionCookie()
  // Optionally redirect client
  window.location.href = '/auth/login';
}
