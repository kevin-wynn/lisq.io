import type { Item, List, NewItem, NewList, NewNote, Note } from "../db/schema";

const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || res.statusText);
  }
  return res.json();
}

// Lists
export const api = {
  lists: {
    getAll: () => request<List[]>("/lists"),
    get: (id: string) => request<List & { items: Item[] }>(`/lists/${id}`),
    create: (data: Omit<NewList, "id" | "createdAt" | "updatedAt">) =>
      request<List>("/lists", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<NewList>) =>
      request<List>(`/lists/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) => request<void>(`/lists/${id}`, { method: "DELETE" }),
  },

  items: {
    create: (data: Omit<NewItem, "id" | "createdAt" | "updatedAt">) =>
      request<Item>("/items", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<NewItem>) =>
      request<Item>(`/items/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) => request<void>(`/items/${id}`, { method: "DELETE" }),
    reorder: (items: { id: string; sortOrder: number }[]) =>
      request<void>("/items/reorder", {
        method: "POST",
        body: JSON.stringify({ items }),
      }),
  },

  notes: {
    getAll: () => request<Note[]>("/notes"),
    get: (id: string) => request<Note>(`/notes/${id}`),
    create: (data: Omit<NewNote, "id" | "createdAt" | "updatedAt">) =>
      request<Note>("/notes", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<NewNote>) =>
      request<Note>(`/notes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) => request<void>(`/notes/${id}`, { method: "DELETE" }),
  },
};
