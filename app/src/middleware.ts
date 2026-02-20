import { defineMiddleware } from "astro:middleware";
import { validateSession, getSessionFromCookies, isAuthEnabled } from "./lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  // If auth is not configured, allow everything
  if (!isAuthEnabled()) {
    return next();
  }

  const { pathname } = context.url;

  // Always allow: login page, auth API, static assets
  if (
    pathname === "/login" ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/_astro/") ||
    pathname.startsWith("/favicon")
  ) {
    return next();
  }

  // Check session cookie
  const cookieHeader = context.request.headers.get("cookie");
  const sessionId = getSessionFromCookies(cookieHeader);

  if (sessionId) {
    const session = validateSession(sessionId);
    if (session) {
      // Valid session — allow through
      return next();
    }
  }

  // Not authenticated
  if (pathname.startsWith("/api/")) {
    // API routes return 401
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Page routes redirect to login
  return context.redirect("/login");
});
