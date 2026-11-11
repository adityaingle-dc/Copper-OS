import { X, ShieldCheck } from "lucide-react"
import { playStampSound, playCopperChime } from "../../utils/delights"

function StaffDesksModal({ isOpen, onClose, staff, onUpdateStaff, isNight }) {
  if (!isOpen) return null

  const handleStatusChange = (member, newStatus) => {
    playStampSound()
    onUpdateStaff({ ...member, status: newStatus })
  }

  const handleQuickApprove = () => {
    playCopperChime()
    alert("Timesheet and overtime approvals stamped!")
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`w-full max-w-3xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] ${
          isNight ? "bg-stone-900 border-stone-700 text-stone-100" : "bg-white border-stone-200 text-stone-800"
        }`}
        role="dialog"
        aria-labelledby="staff-title"
      >
        {/* Header */}
        <div
          className={`p-6 border-b flex items-center justify-between ${
            isNight ? "border-stone-800 bg-stone-950/40" : "border-stone-100 bg-[#FAF7F2]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🧑‍💻
            </div>
            <div>
              <h2 id="staff-title" className="text-xl font-bold tracking-tight">
                Staff Desks · Attendance & Workstations
              </h2>
              <p className="text-xs text-stone-400">
                Studio roster, live desk presence, and mobile attendance approvals.
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
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Quick Approvals Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isNight ? "bg-stone-800/40 border-stone-700" : "bg-indigo-50/60 border-indigo-100"
          }`}>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-indigo-600" size={24} />
              <div>
                <h4 className="text-sm font-bold">Pending Attendance Approvals</h4>
                <p className="text-xs text-stone-500">4 team check-ins logged for today awaiting partner sign-off.</p>
              </div>
            </div>
            <button
              onClick={handleQuickApprove}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
            >
              Stamp All (Approve)
            </button>
          </div>

          {/* Desks Roster */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staff.map((member) => (
              <div
                key={member.id}
                className={`p-4 rounded-xl border transition-all ${
                  isNight ? "bg-stone-800/40 border-stone-800" : "bg-white border-stone-200"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs"
                      style={{ backgroundColor: member.avatarBg, color: member.avatarColor }}
                    >
                      {member.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{member.name}</h4>
                      <p className="text-xs text-stone-400">{member.role}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    {member.deskLabel}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center justify-between">
                    <span>Working on:</span>
                    <span className="font-semibold text-stone-700 dark:text-stone-300">{member.currentTask}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        member.status === "At Desk" ? "bg-green-500" : "bg-amber-500"
                      }`} />
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{member.status}</span>
                    </div>
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="mt-4 flex gap-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                  {["At Desk", "In Meeting", "Remote"].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(member, st)}
                      className={`flex-1 text-[11px] py-1 rounded font-medium border ${
                        member.status === st
                          ? "bg-stone-800 text-white border-stone-800 dark:bg-stone-200 dark:text-stone-900"
                          : "border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
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
          <span>Drop task sticky notes onto desk stations in the studio to reassign.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#A96C4B] text-white font-medium hover:bg-[#8D583B] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default StaffDesksModal
