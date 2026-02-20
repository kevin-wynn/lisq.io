import { X } from "lucide-react";
import { useState } from "react";
import type { List as ListType } from "../db/schema";

const LIST_TYPES = [
  {
    value: "todo",
    label: "Todo",
    emoji: "✅",
    description: "Simple checkbox tasks",
  },
  {
    value: "shopping",
    label: "Shopping",
    emoji: "🛒",
    description: "Shopping & supply runs",
  },
  {
    value: "gear",
    label: "Gear",
    emoji: "🎒",
    description: "Gear & packing lists",
  },
  {
    value: "prep",
    label: "Prep",
    emoji: "🛡️",
    description: "Emergency preparedness",
  },
  {
    value: "general",
    label: "General",
    emoji: "📋",
    description: "General purpose list",
  },
];

const LIST_MODES = [
  {
    value: "checklist",
    label: "Checklist",
    emoji: "☑️",
    description: "Check off items as you complete them",
  },
  {
    value: "inventory",
    label: "Inventory",
    emoji: "📦",
    description: "Track items without checking them off",
  },
];

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
  "#06b6d4",
  "#10b981",
  "#78716c",
  "#94a3b8",
];

interface EditListModalProps {
  list: ListType;
  onClose: () => void;
  onSave: (id: string, updates: Partial<ListType>) => void;
}

export function EditListModal({ list, onClose, onSave }: EditListModalProps) {
  const [name, setName] = useState(list.name);
  const [description, setDescription] = useState(list.description || "");
  const [type, setType] = useState(list.type);
  const [mode, setMode] = useState((list as any).mode || "checklist");
  const [color, setColor] = useState(list.color || "#6366f1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(list.id, {
      name: name.trim(),
      description: description.trim() || null,
      type,
      mode,
      color,
    } as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-dark-950 border border-dark-500 rounded-2xl w-full max-w-md mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-500 sticky top-0 bg-dark-950 z-10">
          <h2 className="text-lg font-semibold">✏️ Edit List</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-dark-200 hover:text-dark-50 hover:bg-dark-600 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-dark-100 uppercase tracking-wider mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-dark-100 uppercase tracking-wider mb-2">
              Description <span className="text-dark-300">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this list for?"
              className="input resize-none h-20"
            />
          </div>

          {/* Mode */}
          <div>
            <label className="block text-xs font-medium text-dark-100 uppercase tracking-wider mb-2">
              Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LIST_MODES.map((m) => {
                const isSelected = mode === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMode(m.value)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left text-sm transition-all ${
                      isSelected
                        ? "border-tactical-500 bg-tactical-500/15 text-tactical-400"
                        : "border-dark-500 bg-dark-700 text-dark-100 hover:border-dark-400 hover:text-dark-50"
                    }`}
                  >
                    <span className="text-base shrink-0">{m.emoji}</span>
                    <div>
                      <div className="font-medium text-xs">{m.label}</div>
                      <div className="text-[10px] text-dark-200 mt-0.5">
                        {m.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-medium text-dark-100 uppercase tracking-wider mb-2">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LIST_TYPES.map((t) => {
                const isSelected = type === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value as any)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left text-sm transition-all ${
                      isSelected
                        ? "border-tactical-500 bg-tactical-500/15 text-tactical-400"
                        : "border-dark-500 bg-dark-700 text-dark-100 hover:border-dark-400 hover:text-dark-50"
                    }`}
                  >
                    <span className="text-base shrink-0">{t.emoji}</span>
                    <div>
                      <div className="font-medium text-xs">{t.label}</div>
                      <div className="text-[10px] text-dark-200 mt-0.5">
                        {t.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-medium text-dark-100 uppercase tracking-wider mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === c ? "scale-110" : "hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: c,
                    ...(color === c
                      ? { boxShadow: `0 0 0 2px white, 0 0 0 4px ${c}` }
                      : {}),
                  }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1 justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
