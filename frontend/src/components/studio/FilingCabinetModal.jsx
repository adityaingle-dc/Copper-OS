import { X, FileText, Download, FileCheck } from "lucide-react"
import { playStampSound, playCopperChime } from "../../utils/delights"

function FilingCabinetModal({ isOpen, onClose, documents, isNight }) {
  if (!isOpen) return null

  const handleSign = (doc) => {
    playStampSound()
    playCopperChime()
    alert(`Document stamped & signed: ${doc.title}`)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`w-full max-w-3xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] ${
          isNight ? "bg-stone-900 border-stone-700 text-stone-100" : "bg-white border-stone-200 text-stone-800"
        }`}
        role="dialog"
        aria-labelledby="filing-title"
      >
        {/* Header */}
        <div
          className={`p-6 border-b flex items-center justify-between ${
            isNight ? "border-stone-800 bg-stone-950/40" : "border-stone-100 bg-[#FAF7F2]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🗄️
            </div>
            <div>
              <h2 id="filing-title" className="text-xl font-bold tracking-tight">
                The Filing Cabinet · Documents & Proposals
              </h2>
              <p className="text-xs text-stone-400">
                Organized client contracts, project drawings, and proposal archives.
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
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  isNight ? "bg-stone-800/40 border-stone-800" : "bg-white border-stone-200 hover:border-[#A96C4B]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#A96C4B] dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{doc.title}</h4>
                    <p className="text-xs text-stone-400">
                      {doc.type} · {doc.client} · {doc.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                      doc.status === "Signed" || doc.status === "Approved"
                        ? "bg-green-100 text-green-700 border-green-300 dark:bg-green-950 dark:border-green-800 dark:text-green-300"
                        : "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300"
                    }`}
                  >
                    {doc.status}
                  </span>

                  {doc.status === "Awaiting Signature" ? (
                    <button
                      onClick={() => handleSign(doc)}
                      className="px-3 py-1.5 rounded-lg bg-[#A96C4B] hover:bg-[#8D583B] text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                    >
                      <FileCheck size={14} /> Stamp & Sign
                    </button>
                  ) : (
                    <button
                      onClick={() => alert(`Downloading ${doc.title}...`)}
                      className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between text-xs text-stone-500 ${
            isNight ? "border-stone-800 bg-stone-950/40" : "border-stone-100 bg-stone-50"
          }`}
        >
          <span>Cabinet drawers sync with Cloud Storage & PDF document sign-offs.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#A96C4B] text-white font-medium hover:bg-[#8D583B] transition-colors"
          >
            Close Cabinet
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilingCabinetModal
