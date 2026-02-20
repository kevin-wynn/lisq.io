import type { APIRoute } from "astro";
import {
  validateSession,
  getSessionFromCookies,
  isAuthEnabled,
} from "../../../lib/auth";

export const GET: APIRoute = async ({ request }) => {
  // If auth is not enabled, always return authenticated
  if (!isAuthEnabled()) {
    return new Response(
      JSON.stringify({ authenticated: true, auth: false }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  const cookieHeader = request.headers.get("cookie");
  const sessionId = getSessionFromCookies(cookieHeader);

  if (!sessionId) {
    return new Response(
      JSON.stringify({ authenticated: false }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const session = validateSession(sessionId);
  if (!session) {
    return new Response(
      JSON.stringify({ authenticated: false }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({
      authenticated: true,
      user: { id: session.userId, username: session.username },
    }),
    { headers: { "Content-Type": "application/json" } }
  );
};
