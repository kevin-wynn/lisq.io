import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { items } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const PATCH: APIRoute = async ({ params, request }) => {
  const { id } = params;
  if (!id) return new Response('Missing id', { status: 400 });

  const body = await request.json();
  const [updated] = await db.update(items)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(items.id, id))
    .returning();

  if (!updated) return new Response('Not found', { status: 404 });

  return new Response(JSON.stringify(updated), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) return new Response('Missing id', { status: 400 });

  await db.delete(items).where(eq(items.id, id));
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
