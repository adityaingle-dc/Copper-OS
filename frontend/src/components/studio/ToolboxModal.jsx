import { X, Sun, Moon, Volume2, Sliders } from "lucide-react"

function ToolboxModal({ isOpen, onClose, isNight, onToggleNight, reducedMotion, onToggleReducedMotion, isMuted, onToggleMute }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`w-full max-w-xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] ${
          isNight ? "bg-stone-900 border-stone-700 text-stone-100" : "bg-white border-stone-200 text-stone-800"
        }`}
        role="dialog"
        aria-labelledby="toolbox-title"
      >
        {/* Header */}
        <div
          className={`p-6 border-b flex items-center justify-between ${
            isNight ? "border-stone-800 bg-stone-950/40" : "border-stone-100 bg-[#FAF7F2]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🧰
            </div>
            <div>
              <h2 id="toolbox-title" className="text-xl font-bold tracking-tight">
                The Toolbox · Studio Settings
              </h2>
              <p className="text-xs text-stone-400">
                Studio preferences, lighting, sound delights, and accessibility.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Day / Night Theme */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isNight ? "bg-stone-800/40 border-stone-800" : "bg-white border-stone-200"
          }`}>
            <div className="flex items-center gap-3">
              {isNight ? <Moon className="text-amber-400" size={20} /> : <Sun className="text-amber-500" size={20} />}
              <div>
                <h4 className="text-sm font-bold">Studio Lighting (Day / Night)</h4>
                <p className="text-xs text-stone-400">
                  {isNight ? "Evening mood lighting with warm desk lamps." : "Natural daylight streaming across the floor."}
                </p>
              </div>
            </div>

            <button
              onClick={onToggleNight}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                isNight
                  ? "bg-amber-400 text-stone-900 border-amber-400"
                  : "bg-stone-100 text-stone-700 border-stone-300"
              }`}
            >
              {isNight ? "Switch to Daytime ☀️" : "Switch to Night 🌙"}
            </button>
          </div>

          {/* Reduced Motion */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isNight ? "bg-stone-800/40 border-stone-800" : "bg-white border-stone-200"
          }`}>
            <div className="flex items-center gap-3">
              <Sliders className="text-[#A96C4B]" size={20} />
              <div>
                <h4 className="text-sm font-bold">Reduced Motion Support</h4>
                <p className="text-xs text-stone-400">Disables coin drops, confetti particle bursts, and floating animations.</p>
              </div>
            </div>

            <button
              onClick={onToggleReducedMotion}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                reducedMotion
                  ? "bg-[#A96C4B] text-white border-[#A96C4B]"
                  : "bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300"
              }`}
            >
              {reducedMotion ? "Enabled" : "Off"}
            </button>
          </div>

          {/* Audio Chimes / Bell */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isNight ? "bg-stone-800/40 border-stone-800" : "bg-white border-stone-200"
          }`}>
            <div className="flex items-center gap-3">
              <Volume2 className="text-[#A96C4B]" size={20} />
              <div>
                <h4 className="text-sm font-bold">Copper Bell Chimes & Stamps</h4>
                <p className="text-xs text-stone-400">Audio feedback on payment received or milestone deliveries.</p>
              </div>
            </div>

            <button
              onClick={onToggleMute}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                !isMuted
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-stone-100 text-stone-500 border-stone-300 dark:bg-stone-800 dark:border-stone-700"
              }`}
            >
              {!isMuted ? "Active 🔔" : "Muted 🔕"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between text-xs text-stone-500 ${
            isNight ? "border-stone-800 bg-stone-950/40" : "border-stone-100 bg-stone-50"
          }`}
        >
          <span>Preferences are saved for your studio session.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#A96C4B] text-white font-medium hover:bg-[#8D583B] transition-colors"
          >
            Close Toolbox
          </button>
        </div>
      </div>
    </div>
  )
}

export default ToolboxModal
