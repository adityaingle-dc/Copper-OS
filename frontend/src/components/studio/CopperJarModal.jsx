import { useState } from "react"
import { X, Coins, Sparkles } from "lucide-react"
import { playCopperChime, triggerConfetti } from "../../utils/delights"

function CopperJarModal({ isOpen, onClose, jarData, onLogPayment, isNight }) {
  const [clientName, setClientName] = useState("")
  const [amount, setAmount] = useState("")
  const [project, setProject] = useState("")

  if (!isOpen) return null

  const fillPercent = Math.min(100, Math.round((jarData.currentAmount / jarData.monthlyTarget) * 100))

  const handlePayment = (e) => {
    e.preventDefault()
    const numericAmount = parseFloat(amount)
    if (!numericAmount || numericAmount <= 0) return

    playCopperChime()
    triggerConfetti()

    onLogPayment({
      id: `pay-${Date.now()}`,
      client: clientName || "Private Client",
      amount: numericAmount,
      date: "Just now",
      project: project || "Consultation Milestone",
    })

    setClientName("")
    setAmount("")
    setProject("")
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`w-full max-w-3xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] ${
          isNight ? "bg-stone-900 border-stone-700 text-stone-100" : "bg-white border-stone-200 text-stone-800"
        }`}
        role="dialog"
        aria-labelledby="jar-title"
      >
        {/* Header */}
        <div
          className={`p-6 border-b flex items-center justify-between ${
            isNight ? "border-stone-800 bg-stone-950/40" : "border-stone-100 bg-[#FAF7F2]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A96C4B] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🏺
            </div>
            <div>
              <h2 id="jar-title" className="text-xl font-bold tracking-tight">
                The Copper Jar · Accounts & Cashflow
              </h2>
              <p className="text-xs text-stone-400">
                Visual progress: watch the studio jar physically fill as payments arrive.
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
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* The Visual Jar Illustration */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-stone-100 to-amber-50/50 dark:from-stone-800/40 dark:to-stone-900/60 border border-amber-200/50 dark:border-stone-700 relative">
              {/* Glass Jar Outer Body */}
              <div className="w-48 h-64 border-4 border-amber-800/30 rounded-b-[40px] rounded-t-[16px] relative overflow-hidden bg-white/40 dark:bg-stone-800/40 backdrop-blur-xs flex flex-col justify-end shadow-inner">
                {/* Jar Lid */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-[#A96C4B] border-b-2 border-amber-900/40 flex items-center justify-center">
                  <div className="w-20 h-2 bg-amber-200/40 rounded-full" />
                </div>

                {/* Coin Fill Level Animation */}
                <div
                  className="w-full bg-gradient-to-t from-[#8D583B] via-[#C87D55] to-[#E59E78] transition-all duration-1000 ease-out flex flex-col items-center justify-center relative p-3 text-white"
                  style={{ height: `${fillPercent}%` }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-200 mb-1 animate-pulse" />
                  <span className="text-xl font-black drop-shadow">
                    ${jarData.currentAmount.toLocaleString()}
                  </span>
                  <span className="text-xs text-amber-100 drop-shadow-sm font-semibold">
                    {fillPercent}% of Goal
                  </span>
                </div>
              </div>

              {/* Jar Target Callout */}
              <div className="mt-4 text-center">
                <span className="text-xs uppercase font-bold tracking-widest text-stone-400">Monthly Target</span>
                <p className="text-lg font-bold text-stone-700 dark:text-stone-300">
                  ${jarData.monthlyTarget.toLocaleString()} USD
                </p>
              </div>
            </div>

            {/* Quick Log Payment Form */}
            <div className="space-y-6">
              <form onSubmit={handlePayment} className="p-5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/30 space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Coins size={16} className="text-[#A96C4B]" /> Drop Payment into Jar
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1">Client</label>
                  <input
                    type="text"
                    placeholder="e.g. Kyoto Living"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-sm outline-none focus:border-[#A96C4B]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1">Amount ($ USD)</label>
                    <input
                      type="number"
                      placeholder="5000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-sm outline-none focus:border-[#A96C4B]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1">Project Milestone</label>
                    <input
                      type="text"
                      placeholder="Phase 1 Handover"
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-sm outline-none focus:border-[#A96C4B]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#A96C4B] hover:bg-[#8D583B] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <Coins size={16} /> Drop Coins with Bell Chime
                </button>
              </form>
            </div>
          </div>

          {/* Recent Payments Stream */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Recent Coins Dropped</h4>
            <div className="space-y-2">
              {jarData.recentPayments.map((p) => (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-sm ${
                    isNight ? "bg-stone-800/40 border-stone-800" : "bg-white border-stone-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-[#A96C4B] dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center font-bold">
                      $
                    </div>
                    <div>
                      <p className="font-semibold">{p.client}</p>
                      <p className="text-xs text-stone-400">{p.project} · {p.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-green-600 dark:text-green-400">
                      +${p.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-green-100 text-green-700 border border-green-300 dark:bg-green-950 dark:border-green-800 dark:text-green-300">
                      PAID
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between text-xs text-stone-500 ${
            isNight ? "border-stone-800 bg-stone-950/40" : "border-stone-100 bg-stone-50"
          }`}
        >
          <span>Visual delight: every payment rings the studio chime and fills the copper jar.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#A96C4B] text-white font-medium hover:bg-[#8D583B] transition-colors"
          >
            Close Jar
          </button>
        </div>
      </div>
    </div>
  )
}

export default CopperJarModal
