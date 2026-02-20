import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  ArrowLeft,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pin,
  PinOff,
  Trash2,
  Underline as UnderlineIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Note } from "../db/schema";

interface NoteEditorProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export function NoteEditor({
  note,
  onUpdate,
  onDelete,
  onBack,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "tiptap-link",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
    ],
    content: note.content || "",
    editorProps: {
      attributes: {
        class: "tiptap-editor min-h-[300px] px-1 py-2 focus:outline-none",
      },
      handleClick(view, pos, event) {
        // Cmd+click (Mac) or Ctrl+click (Windows/Linux) to open links
        if (event.metaKey || event.ctrlKey) {
          const link = (event.target as HTMLElement).closest("a");
          if (link?.href) {
            window.open(link.href, "_blank", "noopener,noreferrer");
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      debouncedSave(editor.getHTML());
    },
  });

  // Debounced content save
  const debouncedSave = useCallback(
    (() => {
      let timer: ReturnType<typeof setTimeout>;
      return (html: string) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          onUpdate(note.id, { content: html } as any);
        }, 600);
      };
    })(),
    [note.id, onUpdate],
  );

  // Save title on blur
  const handleTitleBlur = () => {
    if (title.trim() && title !== note.title) {
      onUpdate(note.id, { title: title.trim() } as any);
    }
  };

  // Update editor content when note changes
  useEffect(() => {
    if (editor && note.content !== editor.getHTML()) {
      editor.commands.setContent(note.content || "");
    }
    setTitle(note.title);
  }, [note.id]);

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    title: btnTitle,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={btnTitle}
      className={`p-1.5 rounded-md transition-colors ${
        isActive
          ? "bg-tactical-500/15 text-tactical-400"
          : "text-dark-200 hover:text-dark-50 hover:bg-dark-600"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 h-14 px-4 border-b border-dark-500 shrink-0">
        <button
          onClick={onBack}
          className="p-1.5 text-dark-200 hover:text-dark-50 hover:bg-dark-600 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
        </button>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          className="flex-1 bg-transparent text-base font-medium text-dark-50 placeholder-dark-300 focus:outline-none"
          placeholder="Untitled note"
        />

        <button
          onClick={() => onUpdate(note.id, { pinned: !note.pinned } as any)}
          className={`p-1.5 rounded-lg transition-colors ${
            note.pinned
              ? "text-tactical-500 hover:text-tactical-600"
              : "text-dark-300 hover:text-dark-100"
          }`}
          title={note.pinned ? "Unpin" : "Pin"}
        >
          {note.pinned ? <Pin size={16} /> : <PinOff size={16} />}
        </button>

        <button
          onClick={() => {
            onDelete(note.id);
            onBack();
          }}
          className="p-1.5 text-dark-300 hover:text-red-500 rounded-lg transition-colors"
          title="Delete note"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-4 py-2 border-b border-dark-500 shrink-0 flex-wrap">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon size={15} />
        </ToolbarButton>

        <div className="w-px h-5 bg-dark-500 mx-1.5" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={15} />
        </ToolbarButton>

        <div className="w-px h-5 bg-dark-500 mx-1.5" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered size={15} />
        </ToolbarButton>

        <div className="w-px h-5 bg-dark-500 mx-1.5" />

        <ToolbarButton
          onClick={() => {
            const url = window.prompt("Enter URL:");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          isActive={editor.isActive("link")}
          title="Insert Link (⌘+click to open)"
        >
          <Link2 size={15} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
