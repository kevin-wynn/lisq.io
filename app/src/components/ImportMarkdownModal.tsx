import { FileText, X } from "lucide-react";
import { useState } from "react";

interface ImportMarkdownModalProps {
  onClose: () => void;
  onImportList: (data: {
    name: string;
    mode: "checklist" | "inventory";
    items: { content: string; checked: boolean; quantity?: number }[];
  }) => void;
  onImportNote: (data: { title: string; content: string }) => void;
}

type ImportTarget = "list" | "note";

export function ImportMarkdownModal({
  onClose,
  onImportList,
  onImportNote,
}: ImportMarkdownModalProps) {
  const [markdown, setMarkdown] = useState("");
  const [target, setTarget] = useState<ImportTarget>("list");
  const [listName, setListName] = useState("");

  const preview = parseMarkdown(markdown, target);

  const handleImport = () => {
    if (!markdown.trim()) return;

    if (target === "list") {
      const name = listName.trim() || preview.title || "Imported List";
      onImportList({
        name,
        mode: preview.hasCheckboxes ? "checklist" : "inventory",
        items: preview.items,
      });
    } else {
      const title = listName.trim() || preview.title || "Imported Note";
      onImportNote({ title, content: mdToHtml(markdown) });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-dark-950 border border-dark-500 rounded-2xl w-full max-w-lg mx-4 shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-500">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-tactical-500" />
            <h2 className="text-lg font-semibold">Import Markdown</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-dark-200 hover:text-dark-50 hover:bg-dark-600 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Import as */}
          <div>
            <label className="block text-xs font-medium text-dark-100 uppercase tracking-wider mb-2">
              Import as
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTarget("list")}
                className={`px-3 py-2.5 rounded-xl border text-left text-sm transition-all ${
                  target === "list"
                    ? "border-tactical-500 bg-tactical-500/15 text-tactical-400"
                    : "border-dark-500 bg-dark-700 text-dark-100 hover:border-dark-400"
                }`}
              >
                <div className="font-medium text-xs">Checklist / Inventory</div>
                <div className="text-[10px] text-dark-200 mt-0.5">
                  Lines become list items
                </div>
              </button>
              <button
                type="button"
                onClick={() => setTarget("note")}
                className={`px-3 py-2.5 rounded-xl border text-left text-sm transition-all ${
                  target === "note"
                    ? "border-tactical-500 bg-tactical-500/15 text-tactical-400"
                    : "border-dark-500 bg-dark-700 text-dark-100 hover:border-dark-400"
                }`}
              >
                <div className="font-medium text-xs">Note / Document</div>
                <div className="text-[10px] text-dark-200 mt-0.5">
                  Rendered as rich text
                </div>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-dark-100 uppercase tracking-wider mb-2">
              Title{" "}
              <span className="text-dark-300">
                (auto-detected from # heading)
              </span>
            </label>
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder={preview.title || "Auto-detect from markdown..."}
              className="input"
            />
          </div>

          {/* Markdown input */}
          <div>
            <label className="block text-xs font-medium text-dark-100 uppercase tracking-wider mb-2">
              Paste Markdown
            </label>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder={
                "# Shopping List\n- [ ] Milk\n- [ ] Eggs\n- [x] Bread\n- Butter x2"
              }
              className="input resize-none h-40 font-mono text-xs"
              autoFocus
            />
          </div>

          {/* Preview */}
          {markdown.trim() && (
            <div>
              <label className="block text-xs font-medium text-dark-100 uppercase tracking-wider mb-2">
                Preview
              </label>
              <div className="bg-dark-700 border border-dark-500 rounded-lg p-3 max-h-48 overflow-y-auto">
                {target === "list" ? (
                  <div className="space-y-1">
                    {preview.items.length === 0 && (
                      <p className="text-xs text-dark-300 italic">
                        No items detected
                      </p>
                    )}
                    {preview.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        {preview.hasCheckboxes ? (
                          <div
                            className={`w-3.5 h-3.5 rounded border-[1.5px] flex items-center justify-center shrink-0 ${
                              item.checked
                                ? "bg-tactical-500 border-tactical-500"
                                : "border-dark-400"
                            }`}
                          >
                            {item.checked && (
                              <svg
                                width="8"
                                height="8"
                                viewBox="0 0 12 12"
                                fill="none"
                              >
                                <path
                                  d="M2.5 6L5 8.5L9.5 3.5"
                                  stroke="#fff"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-dark-300 shrink-0" />
                        )}
                        <span
                          className={
                            item.checked
                              ? "text-dark-300 line-through"
                              : "text-dark-50"
                          }
                        >
                          {item.content}
                        </span>
                        {item.quantity && item.quantity > 1 && (
                          <span className="font-mono text-dark-300">
                            x{item.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="prose-preview text-xs text-dark-100 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: mdToHtml(markdown) }}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-dark-500">
          <button onClick={onClose} className="btn-ghost flex-1 justify-center">
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!markdown.trim()}
            className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Import{" "}
            {target === "list" ? `${preview.items.length} items` : "Note"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Markdown parsing ---

interface ParseResult {
  title: string;
  items: { content: string; checked: boolean; quantity?: number }[];
  hasCheckboxes: boolean;
}

function parseMarkdown(md: string, _target: string): ParseResult {
  const lines = md.split("\n");
  let title = "";
  const items: ParseResult["items"] = [];
  let hasCheckboxes = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Extract title from first heading
    const headingMatch = trimmed.match(/^#{1,3}\s+(.+)/);
    if (headingMatch && !title) {
      title = headingMatch[1].trim();
      continue;
    }

    // Checkbox item: - [ ] or - [x]
    const checkboxMatch = trimmed.match(/^[-*]\s*\[([ xX])\]\s*(.+)/);
    if (checkboxMatch) {
      hasCheckboxes = true;
      const checked = checkboxMatch[1].toLowerCase() === "x";
      const { content, quantity } = extractQuantity(checkboxMatch[2].trim());
      items.push({ content, checked, quantity });
      continue;
    }

    // Bullet item: - item or * item
    const bulletMatch = trimmed.match(/^[-*+]\s+(.+)/);
    if (bulletMatch) {
      const { content, quantity } = extractQuantity(bulletMatch[1].trim());
      items.push({ content, checked: false, quantity });
      continue;
    }

    // Numbered item: 1. item
    const numberedMatch = trimmed.match(/^\d+[.)]\s+(.+)/);
    if (numberedMatch) {
      const { content, quantity } = extractQuantity(numberedMatch[1].trim());
      items.push({ content, checked: false, quantity });
      continue;
    }

    // Plain non-empty lines (not headings, not blank)
    if (trimmed && !trimmed.startsWith("#")) {
      const { content, quantity } = extractQuantity(trimmed);
      items.push({ content, checked: false, quantity });
    }
  }

  return { title, items, hasCheckboxes };
}

function extractQuantity(text: string): { content: string; quantity?: number } {
  // Match patterns like "item x3", "item ×3", "item (x3)", "3x item", "item x 3"
  const trailingMatch = text.match(/^(.+?)\s*[x×]\s*(\d+)\s*$/i);
  if (trailingMatch) {
    const qty = parseInt(trailingMatch[2], 10);
    if (qty > 0) return { content: trailingMatch[1].trim(), quantity: qty };
  }

  const leadingMatch = text.match(/^(\d+)\s*[x×]\s+(.+)$/i);
  if (leadingMatch) {
    const qty = parseInt(leadingMatch[1], 10);
    if (qty > 0) return { content: leadingMatch[2].trim(), quantity: qty };
  }

  const parenMatch = text.match(/^(.+?)\s*\(x(\d+)\)\s*$/i);
  if (parenMatch) {
    const qty = parseInt(parenMatch[2], 10);
    if (qty > 0) return { content: parenMatch[1].trim(), quantity: qty };
  }

  return { content: text };
}

// --- Simple Markdown to HTML ---

function mdToHtml(md: string): string {
  let html = md
    // Headings
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    // Strikethrough
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    // Inline code
    .replace(/`(.+?)`/g, "<code>$1</code>")
    // Horizontal rule
    .replace(/^---$/gm, "<hr/>")
    // Checkbox items
    .replace(/^[-*]\s*\[x\]\s*(.+)$/gim, '<li class="checked">✅ $1</li>')
    .replace(/^[-*]\s*\[ \]\s*(.+)$/gm, '<li class="unchecked">☐ $1</li>')
    // Unordered list items
    .replace(/^[-*+]\s+(.+)$/gm, "<li>$1</li>")
    // Numbered list items
    .replace(/^\d+[.)]\s+(.+)$/gm, "<li>$1</li>");

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, "<ul>$1</ul>");

  // Wrap remaining lines in <p>
  html = html
    .split("\n")
    .map((line) => {
      const t = line.trim();
      if (
        !t ||
        t.startsWith("<h") ||
        t.startsWith("<ul") ||
        t.startsWith("<li") ||
        t.startsWith("</") ||
        t.startsWith("<hr")
      ) {
        return t;
      }
      return `<p>${t}</p>`;
    })
    .join("\n");

  return html;
}
