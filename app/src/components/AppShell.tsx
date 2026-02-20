import { useCallback, useEffect, useState } from "react";
import type { Item, List, Note } from "../db/schema";
import { api } from "../lib/api";
import { CreateListModal } from "./CreateListModal";
import { EmptyState } from "./EmptyState";
import { ImportMarkdownModal } from "./ImportMarkdownModal";
import { ListDetail } from "./ListDetail";
import type { ItemWithChildren } from "./ListItem";
import { NoteEditor } from "./NoteEditor";
import { NotesList } from "./NotesList";
import { Sidebar } from "./Sidebar";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeSelector } from "./ThemeSelector";

type View = "lists" | "notes" | "themes";

interface ListWithItems extends List {
  items: ItemWithChildren[];
}

export default function AppShell() {
  const [view, setView] = useState<View>("lists");
  const [lists, setLists] = useState<List[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [activeList, setActiveList] = useState<ListWithItems | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  const fetchLists = useCallback(async () => {
    try {
      const data = await api.lists.getAll();
      setLists(data);
    } catch (err) {
      console.error("Failed to fetch lists:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActiveList = useCallback(async (id: string) => {
    try {
      const data = await api.lists.get(id);
      // API returns items with children[] already nested
      setActiveList(data as any);
    } catch (err) {
      console.error("Failed to fetch list:", err);
    }
  }, []);

  const fetchNotes = useCallback(async () => {
    try {
      const data = await api.notes.getAll();
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    }
  }, []);

  useEffect(() => {
    fetchLists();
    fetchNotes();
  }, [fetchLists, fetchNotes]);

  useEffect(() => {
    if (activeListId) {
      fetchActiveList(activeListId);
    } else {
      setActiveList(null);
    }
  }, [activeListId, fetchActiveList]);

  const handleUpdateList = async (id: string, updates: Partial<List>) => {
    try {
      const updated = await api.lists.update(id, updates as any);
      setLists((prev) => prev.map((l) => (l.id === id ? updated : l)));
      if (activeList && activeList.id === id) {
        setActiveList((prev) => (prev ? { ...prev, ...updated } : null));
      }
    } catch (err) {
      console.error("Failed to update list:", err);
    }
  };

  const handleCreateList = async (data: {
    name: string;
    type: string;
    mode: string;
    description?: string;
    icon?: string;
    color?: string;
  }) => {
    try {
      const newList = await api.lists.create(data as any);
      setLists((prev) => [newList, ...prev]);
      setActiveListId(newList.id);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create list:", err);
    }
  };

  const handleDeleteList = async (id: string) => {
    try {
      await api.lists.delete(id);
      setLists((prev) => prev.filter((l) => l.id !== id));
      if (activeListId === id) {
        setActiveListId(null);
        setActiveList(null);
      }
    } catch (err) {
      console.error("Failed to delete list:", err);
    }
  };

  const handleAddItem = async (content: string, priority?: string) => {
    if (!activeList) return;
    try {
      const newItem = await api.items.create({
        listId: activeList.id,
        content,
        priority: priority as any,
        sortOrder: activeList.items.length,
      });
      setActiveList((prev) =>
        prev
          ? { ...prev, items: [...prev.items, { ...newItem, children: [] }] }
          : null,
      );
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  const handleToggleItem = async (itemId: string, checked: boolean) => {
    try {
      await api.items.update(itemId, { checked } as any);
      setActiveList((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((i) =>
                i.id === itemId ? { ...i, checked } : i,
              ),
            }
          : null,
      );
    } catch (err) {
      console.error("Failed to toggle item:", err);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await api.items.delete(itemId);
      setActiveList((prev) =>
        prev
          ? { ...prev, items: prev.items.filter((i) => i.id !== itemId) }
          : null,
      );
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const handleUpdateItem = async (itemId: string, updates: Partial<Item>) => {
    try {
      await api.items.update(itemId, updates as any);
      setActiveList((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((i) =>
                i.id === itemId ? { ...i, ...updates } : i,
              ),
            }
          : null,
      );
    } catch (err) {
      console.error("Failed to update item:", err);
    }
  };

  // --- Sub-item handlers ---
  const handleAddSubItem = async (parentId: string, content: string) => {
    if (!activeList) return;
    try {
      const newItem = await api.items.create({
        listId: activeList.id,
        parentId,
        content,
        sortOrder: 0,
      } as any);
      setActiveList((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((i) =>
                i.id === parentId
                  ? { ...i, children: [...(i.children || []), newItem] }
                  : i,
              ),
            }
          : null,
      );
    } catch (err) {
      console.error("Failed to add sub-item:", err);
    }
  };

  const handleToggleSubItem = async (itemId: string, checked: boolean) => {
    try {
      await api.items.update(itemId, { checked } as any);
      setActiveList((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((i) => ({
                ...i,
                children: (i.children || []).map((c) =>
                  c.id === itemId ? { ...c, checked } : c,
                ),
              })),
            }
          : null,
      );
    } catch (err) {
      console.error("Failed to toggle sub-item:", err);
    }
  };

  const handleDeleteSubItem = async (itemId: string, parentId: string) => {
    try {
      await api.items.delete(itemId);
      setActiveList((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((i) =>
                i.id === parentId
                  ? {
                      ...i,
                      children: (i.children || []).filter(
                        (c) => c.id !== itemId,
                      ),
                    }
                  : i,
              ),
            }
          : null,
      );
    } catch (err) {
      console.error("Failed to delete sub-item:", err);
    }
  };

  const handleUpdateSubItem = async (
    itemId: string,
    parentId: string,
    updates: Partial<Item>,
  ) => {
    try {
      await api.items.update(itemId, updates as any);
      setActiveList((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((i) =>
                i.id === parentId
                  ? {
                      ...i,
                      children: (i.children || []).map((c) =>
                        c.id === itemId ? { ...c, ...updates } : c,
                      ),
                    }
                  : i,
              ),
            }
          : null,
      );
    } catch (err) {
      console.error("Failed to update sub-item:", err);
    }
  };

  // --- Reorder handler ---
  const handleReorderItems = async (reorderedItems: ItemWithChildren[]) => {
    if (!activeList) return;
    // Optimistic update
    setActiveList((prev) => (prev ? { ...prev, items: reorderedItems } : null));
    // Persist sort order
    try {
      await api.items.reorder(
        reorderedItems.map((item, index) => ({
          id: item.id,
          sortOrder: index,
        })),
      );
    } catch (err) {
      console.error("Failed to reorder items:", err);
      // Refetch on error
      if (activeListId) fetchActiveList(activeListId);
    }
  };

  // --- Markdown import handlers ---
  const handleImportList = async (data: {
    name: string;
    mode: "checklist" | "inventory";
    items: { content: string; checked: boolean; quantity?: number }[];
  }) => {
    try {
      const newList = await api.lists.create({
        name: data.name,
        type: "general",
        mode: data.mode,
      } as any);
      setLists((prev) => [newList, ...prev]);
      // Add items sequentially
      for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];
        await api.items.create({
          listId: newList.id,
          content: item.content,
          checked: item.checked,
          quantity: item.quantity || null,
          sortOrder: i,
        } as any);
      }
      setActiveListId(newList.id);
      setView("lists");
    } catch (err) {
      console.error("Failed to import list:", err);
    }
  };

  const handleImportNote = async (data: { title: string; content: string }) => {
    try {
      const newNote = await api.notes.create({
        title: data.title,
        content: data.content,
      } as any);
      setNotes((prev) => [newNote, ...prev]);
      setActiveNoteId(newNote.id);
      setActiveNote(newNote);
      setView("notes");
    } catch (err) {
      console.error("Failed to import note:", err);
    }
  };

  // --- Notes handlers ---
  const handleCreateNote = async () => {
    try {
      const newNote = await api.notes.create({ title: "Untitled" } as any);
      setNotes((prev) => [newNote, ...prev]);
      setActiveNoteId(newNote.id);
      setActiveNote(newNote);
    } catch (err) {
      console.error("Failed to create note:", err);
    }
  };

  const handleUpdateNote = async (id: string, updates: Partial<Note>) => {
    try {
      const updated = await api.notes.update(id, updates as any);
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      if (activeNote && activeNote.id === id) {
        setActiveNote(updated);
      }
    } catch (err) {
      console.error("Failed to update note:", err);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await api.notes.delete(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (activeNoteId === id) {
        setActiveNoteId(null);
        setActiveNote(null);
      }
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          lists={lists}
          activeListId={activeListId}
          view={view}
          isOpen={sidebarOpen}
          notesCount={notes.length}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onSelectList={(id) => {
            setActiveListId(id);
            setActiveNoteId(null);
            setActiveNote(null);
            setView("lists");
          }}
          onSelectView={(v) => {
            setView(v);
            if (v === "notes") {
              setActiveListId(null);
              setActiveList(null);
            } else if (v === "lists") {
              setActiveNoteId(null);
              setActiveNote(null);
            } else {
              setActiveListId(null);
              setActiveList(null);
              setActiveNoteId(null);
              setActiveNote(null);
            }
          }}
          onCreateList={() => setShowCreateModal(true)}
          onDeleteList={handleDeleteList}
          onImportMarkdown={() => setShowImportModal(true)}
        />

        <main className="flex-1 overflow-hidden">
          {view === "themes" ? (
            <ThemeSelector
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              sidebarOpen={sidebarOpen}
            />
          ) : view === "lists" && activeList ? (
            <ListDetail
              list={activeList}
              onAddItem={handleAddItem}
              onToggleItem={handleToggleItem}
              onDeleteItem={handleDeleteItem}
              onUpdateItem={handleUpdateItem}
              onUpdateList={handleUpdateList}
              onAddSubItem={handleAddSubItem}
              onToggleSubItem={handleToggleSubItem}
              onDeleteSubItem={handleDeleteSubItem}
              onUpdateSubItem={handleUpdateSubItem}
              onReorderItems={handleReorderItems}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              sidebarOpen={sidebarOpen}
            />
          ) : view === "notes" && activeNote ? (
            <NoteEditor
              note={activeNote}
              onUpdate={handleUpdateNote}
              onDelete={handleDeleteNote}
              onBack={() => {
                setActiveNoteId(null);
                setActiveNote(null);
              }}
            />
          ) : view === "notes" ? (
            <NotesList
              notes={notes}
              onSelect={(id) => {
                setActiveNoteId(id);
                setActiveNote(notes.find((n) => n.id === id) || null);
              }}
              onCreate={handleCreateNote}
              onDelete={handleDeleteNote}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              sidebarOpen={sidebarOpen}
            />
          ) : (
            <EmptyState
              view={view}
              onCreateList={() => setShowCreateModal(true)}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              sidebarOpen={sidebarOpen}
              loading={loading}
            />
          )}
        </main>

        {showCreateModal && (
          <CreateListModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateList}
          />
        )}

        {showImportModal && (
          <ImportMarkdownModal
            onClose={() => setShowImportModal(false)}
            onImportList={handleImportList}
            onImportNote={handleImportNote}
          />
        )}
      </div>
    </ThemeProvider>
  );
}
