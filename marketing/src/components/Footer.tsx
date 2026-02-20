export function Footer() {
  return (
    <footer className="border-t border-dark-800 py-16 px-6" id="get-started">
      <div className="max-w-5xl mx-auto">
        {/* Get Started Section */}
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to get organized?
          </h2>
          <p className="text-dark-100 mb-8 max-w-lg mx-auto">
            One command. Your data stays on your machine in a single SQLite
            file. Optional auth keeps it locked down.
          </p>

          {/* Docker Compose example */}
          <div className="max-w-xl mx-auto text-left">
            <div className="rounded-xl border border-dark-700 bg-dark-700 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-dark-600 bg-dark-800/50">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-dark-400/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-dark-400/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-dark-400/40" />
                </div>
                <span className="text-[10px] font-mono text-dark-300 ml-2">
                  docker-compose.yml
                </span>
              </div>
              <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto">
                <code>
                  <span className="text-dark-300">services:</span>
                  {"\n"}
                  <span className="text-dark-300">{"  "}lisq:</span>
                  {"\n"}
                  <span className="text-dark-200">{"    "}image:</span>{" "}
                  <span className="text-tactical-400">
                    lukevinskywynn/lisq:latest
                  </span>
                  {"\n"}
                  <span className="text-dark-200">{"    "}ports:</span>
                  {"\n"}
                  <span className="text-dark-300">{"      "}- </span>
                  <span className="text-tactical-400">"4321:4321"</span>
                  {"          "}
                  <span className="text-dark-400"># change to any port</span>
                  {"\n"}
                  <span className="text-dark-200">{"    "}volumes:</span>
                  {"\n"}
                  <span className="text-dark-300">{"      "}- </span>
                  <span className="text-tactical-400">./data:/data</span>
                  {"\n"}
                  <span className="text-dark-200">{"    "}environment:</span>
                  {"\n"}
                  <span className="text-dark-300">{"      "}- </span>
                  <span className="text-dark-100">LISQ_USERNAME</span>
                  <span className="text-dark-300">=</span>
                  <span className="text-tactical-400">admin</span>
                  {"     "}
                  <span className="text-dark-400"># your login</span>
                  {"\n"}
                  <span className="text-dark-300">{"      "}- </span>
                  <span className="text-dark-100">LISQ_PASSWORD</span>
                  <span className="text-dark-300">=</span>
                  <span className="text-tactical-400">changeme</span>
                  {"  "}
                  <span className="text-dark-400"># your password</span>
                  {"\n"}
                  <span className="text-dark-300">{"      "}- </span>
                  <span className="text-dark-100">PORT</span>
                  <span className="text-dark-300">=</span>
                  <span className="text-tactical-400">4321</span>
                  {"          "}
                  <span className="text-dark-400"># default 4321</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Run command */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <code className="inline-flex items-center gap-2 px-5 py-2.5 bg-dark-700 border border-dark-500 rounded-xl text-sm font-mono text-tactical-500">
              <span className="text-dark-400">$</span>
              docker compose up -d
            </code>
            <span className="text-xs text-dark-300">
              Then open <span className="text-dark-100">localhost:4321</span>{" "}
              and sign in
            </span>
          </div>

          {/* Env vars table */}
          <div className="mt-10 max-w-xl mx-auto">
            <h3 className="text-xs font-medium text-dark-200 uppercase tracking-wider mb-4">
              Environment Variables
            </h3>
            <div className="rounded-xl border border-dark-700 overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-dark-600 bg-dark-800/50">
                    <th className="text-left px-4 py-2.5 font-medium text-dark-200">
                      Variable
                    </th>
                    <th className="text-left px-4 py-2.5 font-medium text-dark-200">
                      Default
                    </th>
                    <th className="text-left px-4 py-2.5 font-medium text-dark-200">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="text-dark-100">
                  <tr className="border-b border-dark-700">
                    <td className="px-4 py-2 font-mono text-tactical-400">
                      LISQ_USERNAME
                    </td>
                    <td className="px-4 py-2 text-dark-300">—</td>
                    <td className="px-4 py-2">Admin username</td>
                  </tr>
                  <tr className="border-b border-dark-700">
                    <td className="px-4 py-2 font-mono text-tactical-400">
                      LISQ_PASSWORD
                    </td>
                    <td className="px-4 py-2 text-dark-300">—</td>
                    <td className="px-4 py-2">
                      Admin password (bcrypt hashed)
                    </td>
                  </tr>
                  <tr className="border-b border-dark-700">
                    <td className="px-4 py-2 font-mono text-tactical-400">
                      PORT
                    </td>
                    <td className="px-4 py-2 font-mono">4321</td>
                    <td className="px-4 py-2">Server port</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-tactical-400">
                      DATA_PATH
                    </td>
                    <td className="px-4 py-2 font-mono">./data</td>
                    <td className="px-4 py-2">Host path for SQLite file</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-dark-300 mt-3">
              Auth is optional — leave{" "}
              <code className="text-dark-200">LISQ_USERNAME</code> and{" "}
              <code className="text-dark-200">LISQ_PASSWORD</code> empty for
              open access.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-dark-800">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-tactical-500 rounded-md flex items-center justify-center">
              <span className="text-white font-mono font-bold text-[10px]">
                LQ
              </span>
            </div>
            <span className="text-sm font-medium text-dark-200">LISQ</span>
          </div>
          <p className="text-xs text-dark-300">
            Open source. Self-hosted. Built with Astro, React, SQLite.
          </p>
        </div>
      </div>
    </footer>
  );
}
