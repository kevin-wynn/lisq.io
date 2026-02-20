import type { APIRoute } from "astro";
import {
  deleteSession,
  getSessionFromCookies,
  buildClearSessionCookie,
} from "../../../lib/auth";

export const POST: APIRoute = async ({ request }) => {
  const cookieHeader = request.headers.get("cookie");
  const sessionId = getSessionFromCookies(cookieHeader);

  if (sessionId) {
    deleteSession(sessionId);
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": buildClearSessionCookie(),
    },
  });
};
