import { X, Users, Video } from "lucide-react"
import { playCopperChime } from "../../utils/delights"

function MeetingTableModal({ isOpen, onClose, meetings, isNight }) {
  if (!isOpen) return null

  const handleJoin = (meeting) => {
    playCopperChime()
    alert(`Joining video call for: ${meeting.title}`)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] ${
          isNight ? "bg-stone-900 border-stone-700 text-stone-100" : "bg-white border-stone-200 text-stone-800"
        }`}
        role="dialog"
        aria-labelledby="round-table-title"
      >
        {/* Header */}
        <div
          className={`p-6 border-b flex items-center justify-between ${
            isNight ? "border-stone-800 bg-stone-950/40" : "border-stone-100 bg-[#FAF7F2]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              ☕
            </div>
            <div>
              <h2 id="round-table-title" className="text-xl font-bold tracking-tight">
                The Round Table · Meetings & Syncs
              </h2>
              <p className="text-xs text-stone-400">
                Studio collaboration area, live client design reviews, and pin-ups.
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
          {meetings.map((m) => (
            <div
              key={m.id}
              className={`p-4 rounded-xl border flex items-center justify-between ${
                isNight ? "bg-stone-800/40 border-stone-800" : "bg-white border-stone-200"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#A96C4B] bg-[#F4EAE3] dark:bg-stone-800 px-2 py-0.5 rounded">
                    {m.time}
                  </span>
                  <span className="text-xs text-stone-400">· {m.location}</span>
                </div>
                <h4 className="font-bold text-sm">{m.title}</h4>
                <div className="flex items-center gap-2 text-xs text-stone-500 pt-1">
                  <Users size={14} />
                  <span>Attendees: {m.attendees.join(", ")}</span>
                </div>
              </div>

              <button
                onClick={() => handleJoin(m)}
                className="px-3.5 py-2 rounded-xl bg-[#A96C4B] hover:bg-[#8D583B] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
              >
                <Video size={14} /> Join Table
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between text-xs text-stone-500 ${
            isNight ? "border-stone-800 bg-stone-950/40" : "border-stone-100 bg-stone-50"
          }`}
        >
          <span>Coffee brewed fresh. Pull up a chair for live design review.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#A96C4B] text-white font-medium hover:bg-[#8D583B] transition-colors"
          >
            Leave Table
          </button>
        </div>
      </div>
    </div>
  )
}

export default MeetingTableModal
