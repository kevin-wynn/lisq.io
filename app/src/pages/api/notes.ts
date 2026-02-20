import type { APIRoute } from 'astro';
import { db } from '../../db';
import { notes } from '../../db/schema';
import { nanoid } from 'nanoid';
import { desc } from 'drizzle-orm';

export const GET: APIRoute = async () => {
  const allNotes = await db.select().from(notes).orderBy(desc(notes.pinned), desc(notes.createdAt));
  return new Response(JSON.stringify(allNotes), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const id = nanoid();
  const now = new Date();

  const [newNote] = await db.insert(notes).values({
    id,
    title: body.title,
    content: body.content || '',
    pinned: body.pinned ?? false,
    createdAt: now,
    updatedAt: now,
  }).returning();

  return new Response(JSON.stringify(newNote), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
