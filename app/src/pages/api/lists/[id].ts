import type { APIRoute } from "astro";
import { asc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { items, lists } from "../../../db/schema";

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) return new Response("Missing id", { status: 400 });

  const [list] = await db.select().from(lists).where(eq(lists.id, id));
  if (!list) return new Response("Not found", { status: 404 });

  const allItems = await db
    .select()
    .from(items)
    .where(eq(items.listId, id))
    .orderBy(asc(items.sortOrder), asc(items.createdAt));

  // Nest sub-items under parent items
  const parentItems = allItems.filter((i) => !i.parentId);
  const childMap = new Map<string, typeof allItems>();
  for (const item of allItems) {
    if (item.parentId) {
      const arr = childMap.get(item.parentId) || [];
      arr.push(item);
      childMap.set(item.parentId, arr);
    }
  }
  const itemsWithChildren = parentItems.map((item) => ({
    ...item,
    children: childMap.get(item.id) || [],
  }));

  return new Response(JSON.stringify({ ...list, items: itemsWithChildren }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const { id } = params;
  if (!id) return new Response("Missing id", { status: 400 });

  const body = await request.json();
  const [updated] = await db
    .update(lists)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(lists.id, id))
    .returning();

  if (!updated) return new Response("Not found", { status: 404 });

  return new Response(JSON.stringify(updated), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) return new Response("Missing id", { status: 400 });

  await db.delete(lists).where(eq(lists.id, id));
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
