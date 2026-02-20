import { ChevronLeft, Trash2 } from "lucide-react";
import type { List as ListType } from "../db/schema";

const TYPE_EMOJIS: Record<string, string> = {
  todo: "✅",
  shopping: "🛒",
  gear: "🎒",
  prep: "🛡️",
  general: "📋",
};

const TYPE_LABELS: Record<string, string> = {
  todo: "TODO",
  shopping: "SHOP",
  gear: "GEAR",
  prep: "PREP",
  general: "LIST",
};

interface SidebarProps {
  lists: ListType[];
  activeListId: string | null;
  view: string;
  isOpen: boolean;
  notesCount: number;
  onToggle: () => void;
  onSelectList: (id: string) => void;
  onSelectView: (view: "lists" | "notes" | "themes") => void;
  onCreateList: () => void;
  onDeleteList: (id: string) => void;
  onImportMarkdown: () => void;
}

export function Sidebar({
  lists,
  activeListId,
  view,
  isOpen,
  notesCount,
  onToggle,
  onSelectList,
  onSelectView,
  onCreateList,
  onDeleteList,
  onImportMarkdown,
}: SidebarProps) {
  return (
    <aside
      className={`${
        isOpen ? "w-72" : "w-0"
      } transition-all duration-300 ease-in-out bg-dark-800 border-r border-dark-500 flex flex-col overflow-hidden shrink-0`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-500">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">📝</span>
          <span className="font-semibold text-lg tracking-tight">LISQ</span>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 text-dark-100 hover:text-dark-50 hover:bg-dark-600 rounded-lg transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Navigation */}
      <div className="p-3 space-y-1">
        <button
          onClick={() => onSelectView("lists")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            view === "lists"
              ? "bg-dark-600 text-tactical-400"
              : "text-dark-100 hover:text-dark-50 hover:bg-dark-700"
          }`}
        >
          <span>📋</span>
          <span>Lists</span>
          <span className="ml-auto font-mono text-xs text-dark-200">
            {lists.length}
          </span>
        </button>
        <button
          onClick={() => onSelectView("notes")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            view === "notes"
              ? "bg-dark-600 text-tactical-400"
              : "text-dark-100 hover:text-dark-50 hover:bg-dark-700"
          }`}
        >
          <span>🗒️</span>
          <span>Notes</span>
          <span className="ml-auto font-mono text-xs text-dark-200">
            {notesCount}
          </span>
        </button>
        <button
          onClick={() => onSelectView("themes")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            view === "themes"
              ? "bg-dark-600 text-tactical-400"
              : "text-dark-100 hover:text-dark-50 hover:bg-dark-700"
          }`}
        >
          <span>🎨</span>
          <span>Themes</span>
        </button>
      </div>

      {/* Divider */}
      <div className="px-4">
        <div className="border-t border-dark-500" />
      </div>

      {/* Lists */}
      <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {lists.map((list) => {
          const emoji = TYPE_EMOJIS[list.type] || "📋";
          const isActive = activeListId === list.id;

          return (
            <div
              key={list.id}
              className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-all ${
                isActive
                  ? "bg-dark-600 text-dark-50"
                  : "text-dark-100 hover:text-dark-50 hover:bg-dark-700"
              }`}
              onClick={() => onSelectList(list.id)}
            >
              <span className="text-sm shrink-0">{emoji}</span>
              <span className="truncate flex-1">{list.name}</span>
              <span
                className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                  isActive
                    ? "bg-dark-500 text-dark-100"
                    : "bg-dark-600 text-dark-200"
                }`}
              >
                {TYPE_LABELS[list.type] || "LIST"}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteList(list.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-dark-200 hover:text-red-400 transition-all"
              >
                <Trash2 size={13} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Create / Import Buttons */}
      <div className="p-3 border-t border-dark-500 space-y-2">
        <button
          onClick={onCreateList}
          className="w-full btn-primary justify-center"
        >
          <span>✨</span>
          <span>New List</span>
        </button>
        <button
          onClick={onImportMarkdown}
          className="w-full btn-ghost justify-center border border-dark-500"
        >
          <span>📥</span>
          <span>Import Markdown</span>
        </button>
      </div>
    </aside>
  );
}
