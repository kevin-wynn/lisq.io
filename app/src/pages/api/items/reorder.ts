import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { items } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { items: itemUpdates } = body as { items: { id: string; sortOrder: number }[] };

  if (!Array.isArray(itemUpdates)) {
    return new Response('Invalid payload', { status: 400 });
  }

  for (const item of itemUpdates) {
    await db.update(items)
      .set({ sortOrder: item.sortOrder, updatedAt: new Date() })
      .where(eq(items.id, item.id));
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
