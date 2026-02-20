import type { APIRoute } from "astro";
import {
  verifyCredentials,
  createSession,
  buildSessionCookie,
  isAuthEnabled,
} from "../../../lib/auth";

export const POST: APIRoute = async ({ request }) => {
  // If auth is not enabled, just return ok
  if (!isAuthEnabled()) {
    return new Response(JSON.stringify({ ok: true, auth: false }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await request.json();
  const { username, password } = body;

  if (!username || !password) {
    return new Response(
      JSON.stringify({ error: "Username and password are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const user = await verifyCredentials(username, password);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "Invalid username or password" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const sessionId = createSession(user.id);

  return new Response(
    JSON.stringify({ ok: true, user: { id: user.id, username: user.username } }),
    {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": buildSessionCookie(sessionId),
      },
    }
  );
};
