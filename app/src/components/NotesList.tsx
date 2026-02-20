import { PanelLeftOpen, Pin, Trash2 } from "lucide-react";
import type { Note } from "../db/schema";

interface NotesListProps {
  notes: Note[];
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function formatDate(date: Date | string | number): string {
  const d = new Date(typeof date === "number" ? date * 1000 : date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function NotesList({
  notes,
  onSelect,
  onCreate,
  onDelete,
  onToggleSidebar,
  sidebarOpen,
}: NotesListProps) {
  const pinned = notes.filter((n) => n.pinned);
  const unpinned = notes.filter((n) => !n.pinned);

  const NoteCard = ({ note }: { note: Note }) => {
    const preview = stripHtml(note.content || "");
    return (
      <div
        onClick={() => onSelect(note.id)}
        className="group bg-dark-950 border border-dark-500 rounded-xl p-4 cursor-pointer hover:border-dark-400 hover:shadow-sm transition-all"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-medium text-dark-50 truncate flex-1">
            {note.title || "Untitled"}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            {note.pinned && <Pin size={12} className="text-tactical-500" />}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-dark-300 hover:text-red-500 transition-all"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
        {preview && (
          <p className="text-xs text-dark-200 line-clamp-3 leading-relaxed mb-3">
            {preview.slice(0, 140)}
          </p>
        )}
        <span className="text-[10px] text-dark-300">
          {formatDate(note.updatedAt || note.createdAt)}
        </span>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 h-14 px-4 border-b border-dark-500 shrink-0">
        {!sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 text-dark-200 hover:text-dark-50 hover:bg-dark-600 rounded-lg transition-colors"
          >
            <PanelLeftOpen size={18} />
          </button>
        )}
        <h1 className="text-sm font-medium text-dark-50 flex-1">🗒️ Notes</h1>
        <button onClick={onCreate} className="btn-primary">
          <span>✍️</span>
          <span>New Note</span>
        </button>
      </div>

      {/* Notes Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6">
          {notes.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl block mb-4">✍️</span>
              <p className="text-dark-100 text-sm font-medium mb-1">
                No notes yet
              </p>
              <p className="text-dark-300 text-xs mb-5">
                Create your first note to get started.
              </p>
              <button onClick={onCreate} className="btn-primary">
                <span>✨</span>
                <span>New Note</span>
              </button>
            </div>
          ) : (
            <>
              {pinned.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-xs">📌</span>
                    <span className="text-[10px] font-medium text-dark-300 uppercase tracking-wider">
                      Pinned
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pinned.map((note) => (
                      <NoteCard key={note.id} note={note} />
                    ))}
                  </div>
                </div>
              )}

              {unpinned.length > 0 && (
                <div>
                  {pinned.length > 0 && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="text-xs">📓</span>
                      <span className="text-[10px] font-medium text-dark-300 uppercase tracking-wider">
                        All Notes
                      </span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {unpinned.map((note) => (
                      <NoteCard key={note.id} note={note} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
