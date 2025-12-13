// utils/api.ts
export async function logout() {
  await fetch("/auth/logout", { method: "POST" });
  // Optionally redirect client
  // window.location.href = '/auth/login';
}
