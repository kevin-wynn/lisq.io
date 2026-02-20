import {
  ArrowRight,
  Backpack,
  CheckCircle2,
  NotebookPen,
  Palette,
  Shield,
  ShoppingCart,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-950" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full border border-dark-700 bg-dark-900/50 text-xs font-medium text-dark-100">
          <span className="w-1.5 h-1.5 bg-tactical-400 rounded-full animate-pulse" />
          <span>Self-hosted · SQLite · 20+ themes · Docker-ready</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
          <span className="text-dark-50">Lists & notes for the</span>
          <br />
          <span className="bg-gradient-to-r from-tactical-400 to-tactical-500 bg-clip-text text-transparent">
            prepared mind
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-dark-100 max-w-2xl mx-auto mb-10 leading-relaxed">
          A beautiful, minimal list and notes app with rich-text editing,
          sub-items, drag & drop, 20+ themes, and full data ownership. One
          SQLite file. One Docker command.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#get-started"
            className="inline-flex items-center gap-2 px-6 py-3 bg-tactical-500 hover:bg-tactical-600 text-white font-semibold rounded-xl transition-all duration-150 text-base"
          >
            Get Started
            <ArrowRight size={18} />
          </a>
          <div className="flex items-center gap-2 text-sm text-dark-200 font-mono">
            <span className="text-dark-300">$</span>
            <code>docker compose up -d</code>
          </div>
        </div>

        {/* Use Cases */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-3xl mx-auto">
          {[
            { icon: CheckCircle2, label: "Todo Lists", color: "#6366f1" },
            { icon: ShoppingCart, label: "Shopping", color: "#06b6d4" },
            { icon: Backpack, label: "Gear Lists", color: "#f97316" },
            { icon: Shield, label: "Preparedness", color: "#ec4899" },
            { icon: NotebookPen, label: "Rich Notes", color: "#8b5cf6" },
            { icon: Palette, label: "20+ Themes", color: "#14b8a6" },
          ].map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-dark-700 bg-dark-900/50 hover:border-dark-600 transition-colors"
            >
              <Icon size={24} style={{ color }} />
              <span className="text-xs font-medium text-dark-100">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
