import { Loader2, PanelLeftOpen } from "lucide-react";

interface EmptyStateProps {
  view: string;
  onCreateList: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  loading: boolean;
}

export function EmptyState({
  view,
  onCreateList,
  onToggleSidebar,
  sidebarOpen,
  loading,
}: EmptyStateProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center h-14 px-4 border-b border-dark-500 bg-dark-800/50">
        {!sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 text-dark-100 hover:text-dark-50 hover:bg-dark-600 rounded-lg transition-colors mr-3"
          >
            <PanelLeftOpen size={18} />
          </button>
        )}
        <span className="text-dark-200 text-sm font-medium">
          {view === "lists" ? "Lists" : "Notes"}
        </span>
      </div>

      {/* Center Content */}
      <div className="flex-1 flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={32} className="text-tactical-500 animate-spin" />
            <p className="text-dark-200 text-sm">Loading... ⏳</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 max-w-sm text-center px-6">
            <span className="text-6xl">📋</span>
            <div>
              <h2 className="text-xl font-semibold text-dark-50 mb-2">
                No list selected
              </h2>
              <p className="text-dark-200 text-sm leading-relaxed">
                Select a list from the sidebar or create a new one to get
                started.
              </p>
            </div>
            <button onClick={onCreateList} className="btn-primary">
              <span>✨</span>
              <span>Create your first list</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
