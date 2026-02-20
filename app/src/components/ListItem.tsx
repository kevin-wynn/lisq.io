import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  MessageSquare,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import type { CSSProperties } from "react";
import { useState } from "react";
import type { Item } from "../db/schema";
import { EditItemModal } from "./EditItemModal";

export interface ItemWithChildren extends Item {
  children: Item[];
}

const PRIORITY_STYLES: Record<string, string> = {
  critical: "badge-critical",
  high: "badge-high",
  medium: "badge-medium",
  low: "badge-low",
};

interface ListItemProps {
  item: ItemWithChildren;
  mode: "checklist" | "inventory";
  onToggle: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Item>) => void;
  onAddSubItem: (parentId: string, content: string) => void;
  onToggleSubItem: (id: string, checked: boolean) => void;
  onDeleteSubItem: (id: string, parentId: string) => void;
  onUpdateSubItem: (
    id: string,
    parentId: string,
    updates: Partial<Item>,
  ) => void;
  dragHandleProps?: Record<string, any>;
  style?: CSSProperties;
}

export function SortableListItem(
  props: Omit<ListItemProps, "dragHandleProps" | "style">,
) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.item.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
    position: "relative" as const,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ListItem {...props} dragHandleProps={listeners} />
    </div>
  );
}

export function ListItem({
  item,
  mode,
  onToggle,
  onDelete,
  onUpdate,
  onAddSubItem,
  onToggleSubItem,
  onDeleteSubItem,
  onUpdateSubItem,
  dragHandleProps,
}: ListItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditSubModal, setShowEditSubModal] = useState<Item | null>(null);
  const [subItemInput, setSubItemInput] = useState("");

  const handleAddSubItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subItemInput.trim()) return;
    onAddSubItem(item.id, subItemInput.trim());
    setSubItemInput("");
  };

  const childCount = item.children?.length || 0;

  return (
    <>
      <div
        className={`group rounded-xl border transition-all duration-200 ${
          item.checked
            ? "bg-dark-800/50 border-dark-600"
            : "bg-dark-700 border-dark-500 hover:border-dark-400"
        }`}
      >
        <div
          className="flex items-center gap-3 px-4 py-3 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {/* Drag Handle */}
          <div
            className="opacity-0 group-hover:opacity-40 cursor-grab text-dark-200 transition-opacity touch-none"
            {...(dragHandleProps || {})}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={14} />
          </div>

          {/* Checkbox or Bullet */}
          {mode === "checklist" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle(item.id, !item.checked);
              }}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                item.checked
                  ? "bg-tactical-500 border-tactical-500"
                  : "border-dark-400 hover:border-tactical-500"
              }`}
            >
              {item.checked && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6L5 8.5L9.5 3.5"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ) : (
            <div className="w-2 h-2 rounded-full bg-dark-300 shrink-0" />
          )}

          {/* Content */}
          <span
            className={`flex-1 text-sm transition-all duration-200 select-none ${
              mode === "checklist" && item.checked
                ? "line-through text-dark-300"
                : "text-dark-50"
            }`}
          >
            {item.content}
          </span>

          {/* Quantity */}
          {item.quantity && item.quantity > 1 && (
            <span className="font-mono text-xs bg-dark-600 text-dark-100 px-2 py-0.5 rounded-md">
              x{item.quantity}
            </span>
          )}

          {/* Priority Badge */}
          {item.priority && (
            <span className={PRIORITY_STYLES[item.priority] || "badge-low"}>
              {item.priority.toUpperCase()}
            </span>
          )}

          {/* Notes indicator */}
          {item.notes && (
            <span title="Has notes">
              <MessageSquare size={12} className="text-dark-300" />
            </span>
          )}

          {/* Expand toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className={`p-1 transition-colors ${expanded ? "text-tactical-500" : "text-dark-300 hover:text-dark-100"}`}
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {/* Sub-item count badge */}
          {childCount > 0 && !expanded && (
            <span className="font-mono text-[10px] bg-tactical-500/10 text-tactical-400 px-1.5 py-0.5 rounded">
              {childCount}
            </span>
          )}

          {/* Edit */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEditModal(true);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 text-dark-300 hover:text-tactical-500 transition-all"
            title="Edit item"
          >
            <Pencil size={13} />
          </button>

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 text-dark-300 hover:text-red-400 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Expanded Area */}
        {expanded && (
          <div className="px-4 pb-3 pl-12 space-y-3">
            {/* Notes preview */}
            {item.notes && (
              <div className="text-xs text-dark-200 px-3 py-2 bg-dark-800 rounded-lg border border-dark-600">
                {item.notes}
              </div>
            )}

            {/* Sub-items */}
            <div>
              <div className="text-[10px] font-medium text-dark-200 uppercase tracking-wider mb-2">
                📎 Sub-items {childCount > 0 && `· ${childCount}`}
              </div>
              <div className="space-y-1">
                {(item.children || []).map((child) => (
                  <SubItem
                    key={child.id}
                    child={child}
                    mode={mode}
                    parentId={item.id}
                    onToggle={onToggleSubItem}
                    onDelete={onDeleteSubItem}
                    onEdit={() => setShowEditSubModal(child)}
                  />
                ))}
              </div>
              {/* Add sub-item */}
              <form
                onSubmit={handleAddSubItem}
                className="flex items-center gap-2 mt-2"
              >
                <input
                  type="text"
                  value={subItemInput}
                  onChange={(e) => setSubItemInput(e.target.value)}
                  placeholder="Add sub-item..."
                  className="flex-1 text-xs bg-dark-800 border border-dark-600 rounded-lg px-2.5 py-1.5 text-dark-50 placeholder-dark-300 focus:outline-none focus:border-tactical-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!subItemInput.trim()}
                  className="p-1.5 text-tactical-500 hover:text-tactical-600 disabled:text-dark-400 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Edit Item Modal */}
      {showEditModal && (
        <EditItemModal
          item={item}
          onClose={() => setShowEditModal(false)}
          onSave={(id, updates) => onUpdate(id, updates)}
        />
      )}

      {/* Edit Sub-Item Modal */}
      {showEditSubModal && (
        <EditItemModal
          item={showEditSubModal}
          onClose={() => setShowEditSubModal(null)}
          onSave={(id, updates) => {
            onUpdateSubItem(id, item.id, updates);
            setShowEditSubModal(null);
          }}
        />
      )}
    </>
  );
}

// --- Sub-item row (one level deep, simplified) ---

interface SubItemProps {
  child: Item;
  mode: "checklist" | "inventory";
  parentId: string;
  onToggle: (id: string, checked: boolean) => void;
  onDelete: (id: string, parentId: string) => void;
  onEdit: () => void;
}

function SubItem({
  child,
  mode,
  parentId,
  onToggle,
  onDelete,
  onEdit,
}: SubItemProps) {
  return (
    <div className="group/sub flex items-center gap-2 py-1.5 px-2.5 rounded-lg hover:bg-dark-800/50 transition-colors">
      {mode === "checklist" ? (
        <button
          onClick={() => onToggle(child.id, !child.checked)}
          className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center shrink-0 transition-all ${
            child.checked
              ? "bg-tactical-500 border-tactical-500"
              : "border-dark-400 hover:border-tactical-500"
          }`}
        >
          {child.checked && (
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 6L5 8.5L9.5 3.5"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      ) : (
        <div className="w-1.5 h-1.5 rounded-full bg-dark-300 shrink-0 ml-0.5 mr-0.5" />
      )}

      <span
        className={`flex-1 text-xs transition-colors ${
          mode === "checklist" && child.checked
            ? "line-through text-dark-300"
            : "text-dark-100"
        }`}
      >
        {child.content}
      </span>

      {child.quantity && child.quantity > 1 && (
        <span className="font-mono text-[10px] text-dark-300">
          x{child.quantity}
        </span>
      )}

      <button
        onClick={onEdit}
        className="opacity-0 group-hover/sub:opacity-100 p-0.5 text-dark-300 hover:text-tactical-500 transition-all"
      >
        <Pencil size={11} />
      </button>

      <button
        onClick={() => onDelete(child.id, parentId)}
        className="opacity-0 group-hover/sub:opacity-100 p-0.5 text-dark-300 hover:text-red-400 transition-all"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}
