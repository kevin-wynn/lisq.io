export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-dark-800/50 bg-dark-950/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-tactical-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-mono font-bold text-sm">LQ</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">LISQ</span>
        </a>

        <div className="flex items-center gap-4">
          <a
            href="#get-started"
            className="inline-flex items-center gap-2 px-4 py-2 bg-tactical-500 hover:bg-tactical-600 text-white font-semibold text-sm rounded-lg transition-all duration-150"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}
