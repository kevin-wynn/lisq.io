import type { APIRoute } from "astro";
import { nanoid } from "nanoid";
import { db } from "../../db";
import { items } from "../../db/schema";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const id = nanoid();
  const now = new Date();

  const [newItem] = await db
    .insert(items)
    .values({
      id,
      listId: body.listId,
      parentId: body.parentId || null,
      content: body.content,
      checked: body.checked ?? false,
      notes: body.notes || null,
      quantity: body.quantity || null,
      priority: body.priority || null,
      sortOrder: body.sortOrder ?? 0,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return new Response(JSON.stringify(newItem), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
