import type { APIRoute } from "astro";
import { desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../../db";
import { lists } from "../../db/schema";

export const GET: APIRoute = async () => {
  const allLists = await db.select().from(lists).orderBy(desc(lists.createdAt));
  return new Response(JSON.stringify(allLists), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const id = nanoid();
  const now = new Date();

  const [newList] = await db
    .insert(lists)
    .values({
      id,
      name: body.name,
      description: body.description || null,
      type: body.type || "general",
      icon: body.icon || "list",
      color: body.color || "#6366f1",
      mode: body.mode || "checklist",
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return new Response(JSON.stringify(newList), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
