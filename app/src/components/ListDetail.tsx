import type { DragEndEvent } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { MoreHorizontal, PanelLeftOpen, Pencil, Plus } from "lucide-react";
import { useRef, useState } from "react";
import type { Item, List } from "../db/schema";
import { EditListModal } from "./EditListModal";
import type { ItemWithChildren } from "./ListItem";
import { SortableListItem } from "./ListItem";

interface ListWithItems extends List {
  items: ItemWithChildren[];
}

const PRIORITY_OPTIONS = [
  { value: "", label: "None" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

interface ListDetailProps {
  list: ListWithItems;
  onAddItem: (content: string, priority?: string) => void;
  onToggleItem: (id: string, checked: boolean) => void;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<Item>) => void;
  onUpdateList: (id: string, updates: Partial<List>) => void;
  onAddSubItem: (parentId: string, content: string) => void;
  onToggleSubItem: (id: string, checked: boolean) => void;
  onDeleteSubItem: (id: string, parentId: string) => void;
  onUpdateSubItem: (
    id: string,
    parentId: string,
    updates: Partial<Item>,
  ) => void;
  onReorderItems: (items: ItemWithChildren[]) => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function ListDetail({
  list,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onUpdateItem,
  onUpdateList,
  onAddSubItem,
  onToggleSubItem,
  onDeleteSubItem,
  onUpdateSubItem,
  onReorderItems,
  onToggleSidebar,
  sidebarOpen,
}: ListDetailProps) {
  const [newItemContent, setNewItemContent] = useState("");
  const [newItemPriority, setNewItemPriority] = useState("");
  const [showPriority, setShowPriority] = useState(false);
  const [showEditListModal, setShowEditListModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listMode = (list as any).mode || "checklist";

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent, itemList: ItemWithChildren[]) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = itemList.findIndex((i) => i.id === active.id);
    const newIndex = itemList.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...itemList];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    // Rebuild the full items array with new order
    if (listMode === "inventory") {
      onReorderItems(reordered);
    } else {
      // Merge unchecked reorder with checked items (or vice versa)
      const isUncheckedList = !itemList[0]?.checked;
      const other = isUncheckedList ? checkedItems : uncheckedItems;
      const merged = isUncheckedList
        ? [...reordered, ...other]
        : [...other, ...reordered];
      onReorderItems(merged);
    }
  };

  const checkedCount = list.items.filter((i) => i.checked).length;
  const totalCount = list.items.length;
  const uncheckedItems = list.items.filter((i) => !i.checked);
  const checkedItems = list.items.filter((i) => i.checked);
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemContent.trim()) return;
    onAddItem(newItemContent.trim(), newItemPriority || undefined);
    setNewItemContent("");
    setNewItemPriority("");
    setShowPriority(false);
    inputRef.current?.focus();
  };

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 h-14 px-4 border-b border-dark-500 bg-dark-800/50 shrink-0">
          {!sidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="p-1.5 text-dark-100 hover:text-dark-50 hover:bg-dark-600 rounded-lg transition-colors"
            >
              <PanelLeftOpen size={18} />
            </button>
          )}

          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: list.color || "#6366f1" }}
            />
            <h1 className="text-sm font-semibold truncate">{list.name}</h1>
            {list.description && (
              <span className="text-xs text-dark-200 truncate hidden sm:block">
                — {list.description}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs font-mono text-dark-200 shrink-0">
            {listMode === "checklist" ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">⭕</span>
                  <span>{totalCount - checkedCount}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">✅</span>
                  <span>{checkedCount}</span>
                </div>
              </>
            ) : (
              <span>{totalCount} items</span>
            )}

            {/* Edit List */}
            <button
              onClick={() => setShowEditListModal(true)}
              className="p-1.5 text-dark-200 hover:text-tactical-500 hover:bg-dark-600 rounded-lg transition-colors"
              title="Edit list"
            >
              <Pencil size={15} />
            </button>
          </div>
        </div>

        {/* Progress Bar (checklist mode only) */}
        {listMode === "checklist" && totalCount > 0 && (
          <div className="h-0.5 bg-dark-700 shrink-0">
            <div
              className="h-full bg-tactical-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Item List */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-4 space-y-2">
            {/* Items */}
            {listMode === "inventory" ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(e) => handleDragEnd(e, list.items)}
              >
                <SortableContext
                  items={list.items.map((i) => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {list.items.map((item) => (
                    <SortableListItem
                      key={item.id}
                      item={item}
                      mode="inventory"
                      onToggle={onToggleItem}
                      onDelete={onDeleteItem}
                      onUpdate={onUpdateItem}
                      onAddSubItem={onAddSubItem}
                      onToggleSubItem={onToggleSubItem}
                      onDeleteSubItem={onDeleteSubItem}
                      onUpdateSubItem={onUpdateSubItem}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              // Checklist mode: separated by checked/unchecked
              <>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => handleDragEnd(e, uncheckedItems)}
                >
                  <SortableContext
                    items={uncheckedItems.map((i) => i.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {uncheckedItems.map((item) => (
                      <SortableListItem
                        key={item.id}
                        item={item}
                        mode="checklist"
                        onToggle={onToggleItem}
                        onDelete={onDeleteItem}
                        onUpdate={onUpdateItem}
                        onAddSubItem={onAddSubItem}
                        onToggleSubItem={onToggleSubItem}
                        onDeleteSubItem={onDeleteSubItem}
                        onUpdateSubItem={onUpdateSubItem}
                      />
                    ))}
                  </SortableContext>
                </DndContext>

                {checkedItems.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 pt-4 pb-1">
                      <div className="h-px flex-1 bg-dark-600" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-dark-300">
                        ✅ Completed · {checkedCount}
                      </span>
                      <div className="h-px flex-1 bg-dark-600" />
                    </div>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(e) => handleDragEnd(e, checkedItems)}
                    >
                      <SortableContext
                        items={checkedItems.map((i) => i.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {checkedItems.map((item) => (
                          <SortableListItem
                            key={item.id}
                            item={item}
                            mode="checklist"
                            onToggle={onToggleItem}
                            onDelete={onDeleteItem}
                            onUpdate={onUpdateItem}
                            onAddSubItem={onAddSubItem}
                            onToggleSubItem={onToggleSubItem}
                            onDeleteSubItem={onDeleteSubItem}
                            onUpdateSubItem={onUpdateSubItem}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  </>
                )}
              </>
            )}

            {/* Empty List */}
            {totalCount === 0 && (
              <div className="text-center py-16">
                <span className="text-5xl block mb-4">📦</span>
                <p className="text-dark-200 text-sm">This list is empty.</p>
                <p className="text-dark-300 text-xs mt-1">
                  Add your first item below ✏️
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add Item Bar */}
        <div className="border-t border-dark-500 bg-dark-800/80 backdrop-blur-sm shrink-0">
          <form onSubmit={handleAddItem} className="max-w-2xl mx-auto p-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={newItemContent}
                  onChange={(e) => setNewItemContent(e.target.value)}
                  placeholder="Add an item..."
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPriority(!showPriority)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded transition-colors ${
                    newItemPriority
                      ? "text-amber-400"
                      : "text-dark-300 hover:text-dark-100"
                  }`}
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>
              <button
                type="submit"
                disabled={!newItemContent.trim()}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>

            {/* Priority Selector */}
            {showPriority && (
              <div className="flex items-center gap-2 mt-2 pl-1">
                <span className="text-xs text-dark-200 font-medium">
                  🔥 Priority:
                </span>
                {PRIORITY_OPTIONS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setNewItemPriority(p.value)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      newItemPriority === p.value
                        ? "border-tactical-500 bg-tactical-500/10 text-tactical-400"
                        : "border-dark-500 text-dark-200 hover:text-dark-100 hover:border-dark-400"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Edit List Modal */}
      {showEditListModal && (
        <EditListModal
          list={list}
          onClose={() => setShowEditListModal(false)}
          onSave={(id, updates) => onUpdateList(id, updates)}
        />
      )}
    </>
  );
}
