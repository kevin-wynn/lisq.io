import {
  CheckSquare,
  Container,
  Database,
  GripVertical,
  Link2,
  ListChecks,
  Lock,
  NotebookPen,
  Palette,
  Pin,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: ListChecks,
    title: "Lists & Checklists",
    description:
      "Create todo lists, gear checklists, shopping lists, and more. Toggle between checklist mode (checkboxes + progress) and inventory mode (clean bullets).",
  },
  {
    icon: NotebookPen,
    title: "Rich Notes",
    description:
      "Full rich-text editor powered by TipTap. Bold, italic, underline, headings, bullet & ordered lists, and hyperlinks with auto-save.",
  },
  {
    icon: Link2,
    title: "Cmd+Click Links",
    description:
      "Add links to your notes and ⌘+click (or Ctrl+click) to open them in a new tab. Links are styled and easy to spot.",
  },
  {
    icon: CheckSquare,
    title: "Sub-Items & Priority",
    description:
      "Nest items one level deep. Click any row to expand sub-items and notes. Tag items with Critical, High, Medium, or Low priority badges.",
  },
  {
    icon: GripVertical,
    title: "Drag & Drop",
    description:
      "Reorder list items effortlessly with drag handles. Your custom order is persisted and stays put.",
  },
  {
    icon: Palette,
    title: "20+ Themes",
    description:
      "Light and dark themes: Paper, Dracula, Nord, Tokyo Night, Catppuccin, Synthwave, Rosé Pine, and many more. Switch anytime.",
  },
  {
    icon: Database,
    title: "SQLite Powered",
    description:
      "Single-file database. No external services needed. Your data stays on your machine in one portable SQLite file.",
  },
  {
    icon: Container,
    title: "Docker Ready",
    description:
      "One command to deploy. Mount a volume for your database, configure the path, and you're up and running. Data persists across restarts.",
  },
  {
    icon: Lock,
    title: "Self-Hosted",
    description:
      "Your data never leaves your infrastructure. Full control, full ownership. No accounts, no cloud sync, no subscriptions.",
  },
  {
    icon: Pin,
    title: "Pin Notes",
    description:
      "Pin important notes to the top. Pinned notes appear in a dedicated section so you never lose track of what matters.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "No bloat, no loading spinners. Instant interactions powered by Astro SSR and a local SQLite database.",
  },
  {
    icon: NotebookPen,
    title: "Import Markdown",
    description:
      "Import your existing .md files as lists. Bring your data in and start organizing right away.",
  },
];

export function Features() {
  return (
    <section className="py-24 px-6" id="features">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simple by design, yours by default
          </h2>
          <p className="text-dark-100 text-lg max-w-xl mx-auto">
            Opinionated about simplicity. No accounts, no cloud sync, no
            subscriptions. Just a fast, beautiful tool that works.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-dark-700 bg-dark-900/30 hover:border-dark-600 hover:bg-dark-900/60 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-dark-700 border border-dark-500 flex items-center justify-center mb-4 group-hover:border-tactical-400 transition-colors">
                  <Icon size={20} className="text-tactical-400" />
                </div>
                <h3 className="font-semibold text-base mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-dark-100 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
