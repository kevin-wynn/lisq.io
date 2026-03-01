import { X } from "lucide-react";
import { useState } from "react";
import type { Item } from "../db/schema";

const PRIORITY_OPTIONS = [
  { value: "", label: "None" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const ITEM_COLORS = [
  { value: "", label: "None" },
  { value: "#6366f1", label: "Indigo" },
  { value: "#8b5cf6", label: "Violet" },
  { value: "#ec4899", label: "Pink" },
  { value: "#f97316", label: "Orange" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#10b981", label: "Emerald" },
  { value: "#78716c", label: "Stone" },
  { value: "#94a3b8", label: "Slate" },
];

interface EditItemModalProps {
  item: Item;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Item>) => void;
}

export function EditItemModal({ item, onClose, onSave }: EditItemModalProps) {
  const [content, setContent] = useState(item.content);
  const [quantity, setQuantity] = useState(String(item.quantity || 1));
  const [priority, setPriority] = useState(item.priority || "");
  const [notes, setNotes] = useState(item.notes || "");
  const [color, setColor] = useState((item as any).color || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const qty = parseInt(quantity, 10);
    onSave(item.id, {
      content: content.trim(),
      quantity: !isNaN(qty) && qty > 0 ? qty : null,
      priority: priority || null,
      notes: notes.trim() || null,
      color: color || null,
    } as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-dark-950 border border-dark-500 rounded-2xl w-full max-w-md mx-4 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-500">
          <h2 className="text-lg font-semibold">✏️ Edit Item</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-dark-200 hover:text-dark-50 hover:bg-dark-600 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Content */}
          <div>
            <label className="block text-xs font-medium text-dark-100 uppercase tracking-wider mb-2">
              Content
            </label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input"
              autoFocus
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-medium text-dark-100 uppercase tracking-wider mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="input w-28"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-medium text-dark-100 uppercase tracking-wider mb-2">
              Priority
            </label>
            <div className="flex flex-wrap gap-2">
              {PRIORITY_OPTIONS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    priority === p.value
                      ? "border-tactical-500 bg-tactical-500/15 text-tactical-400"
                      : "border-dark-500 text-dark-200 hover:text-dark-100 hover:border-dark-400"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-medium text-dark-100 uppercase tracking-wider mb-2">
              Color <span className="text-dark-300">(optional)</span>
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setColor("")}
                className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                  color === ""
                    ? "border-tactical-500 scale-110"
                    : "border-dark-500 hover:border-dark-400"
                }`}
                title="No color"
              >
                <span className="text-dark-300 text-[10px]">✕</span>
              </button>
              {ITEM_COLORS.filter((c) => c.value).map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  title={c.label}
                  className={`w-7 h-7 rounded-full transition-all ${
                    color === c.value ? "scale-110" : "hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: c.value,
                    ...(color === c.value
                      ? { boxShadow: `0 0 0 2px #1c1917, 0 0 0 4px ${c.value}` }
                      : {}),
                  }}
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-dark-100 uppercase tracking-wider mb-2">
              Notes <span className="text-dark-300">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              className="input resize-none h-20"
            />
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
              disabled={!content.trim()}
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
