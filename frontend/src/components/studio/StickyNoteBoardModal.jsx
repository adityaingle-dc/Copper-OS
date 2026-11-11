import { useState } from "react"
import { X, Plus, CheckCircle2 } from "lucide-react"
import { playStampSound, playCopperChime } from "../../utils/delights"

function StickyNoteBoardModal({ isOpen, onClose, tasks, staff, onUpdateTask, onAddTask, isNight }) {
  const [newTitle, setNewTitle] = useState("")
  const [newTag, setNewTag] = useState("Architecture")
  const [newColor, setNewColor] = useState("#FEF08A")

  if (!isOpen) return null

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    onAddTask({
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      project: "General Studio",
      assignedDeskId: null,
      color: newColor,
      tag: newTag,
      priority: "Medium",
      done: false,
    })

    setNewTitle("")
    playStampSound()
  }

  const handleToggle = (task) => {
    playStampSound()
    onUpdateTask({ ...task, done: !task.done })
  }

  const handleAssign = (task, deskId) => {
    playCopperChime()
    onUpdateTask({ ...task, assignedDeskId: deskId })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`w-full max-w-4xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] ${
          isNight ? "bg-stone-900 border-stone-700 text-stone-100" : "bg-[#FAF7F0] border-amber-200 text-stone-800"
        }`}
        role="dialog"
        aria-labelledby="corkboard-title"
      >
        {/* Header */}
        <div
          className={`p-6 border-b flex items-center justify-between ${
            isNight ? "border-stone-800 bg-stone-950/60" : "border-amber-200/60 bg-[#F4EEDF]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              📌
            </div>
            <div>
              <h2 id="corkboard-title" className="text-xl font-bold tracking-tight">
                Sticky-Note Board · Tasks
              </h2>
              <p className="text-xs text-stone-400">
                Interactive corkboard. Assign notes to staff desks or check off deliverables.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors dark:hover:bg-stone-800"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corkboard texture background */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Quick Add Sticky Note Bar */}
          <form
            onSubmit={handleCreate}
            className={`p-4 rounded-xl border flex flex-wrap items-center gap-3 ${
              isNight ? "bg-stone-800/80 border-stone-700" : "bg-white/80 border-stone-200"
            }`}
          >
            <input
              type="text"
              placeholder="Pin a new sticky task..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-transparent text-sm outline-none focus:border-[#A96C4B]"
            />

            <select
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-transparent text-xs"
            >
              <option value="Architecture">Architecture</option>
              <option value="3D Visuals">3D Visuals</option>
              <option value="Interior">Interior</option>
              <option value="Branding">Branding</option>
              <option value="Engineering">Engineering</option>
            </select>

            <div className="flex items-center gap-1.5">
              {["#FEF08A", "#FED7AA", "#BBF7D0", "#FBCFE8", "#DDD6FE"].map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setNewColor(col)}
                  className={`w-6 h-6 rounded-full border transition-transform ${
                    newColor === col ? "scale-125 border-stone-800 shadow" : "border-stone-300"
                  }`}
                  style={{ backgroundColor: col }}
                  aria-label={`Color ${col}`}
                />
              ))}
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#A96C4B] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#8D583B]"
            >
              <Plus size={14} /> Pin Note
            </button>
          </form>

          {/* Sticky Notes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {tasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("application/task-id", task.id)
                }}
                className={`p-4 rounded-xl shadow-md border relative transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between min-h-[170px] ${
                  task.done ? "opacity-60" : ""
                }`}
                style={{
                  backgroundColor: task.color,
                  borderColor: `${task.color}AA`,
                  color: "#1c1917",
                }}
              >
                {/* Pin illustration */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 border border-red-700 shadow flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/10">
                      {task.tag}
                    </span>

                    <button
                      onClick={() => handleToggle(task)}
                      className={`p-1 rounded-full border transition-colors ${
                        task.done ? "bg-green-600 text-white border-green-700" : "border-black/30 hover:bg-black/10"
                      }`}
                      title={task.done ? "Mark as active" : "Mark as done"}
                    >
                      <CheckCircle2 size={14} />
                    </button>
                  </div>

                  <h4 className={`text-sm font-semibold leading-snug ${task.done ? "line-through text-stone-500" : ""}`}>
                    {task.title}
                  </h4>
                </div>

                {/* Assignee selection */}
                <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-600 font-medium">Assigned to:</span>
                  <select
                    value={task.assignedDeskId || ""}
                    onChange={(e) => handleAssign(task, e.target.value || null)}
                    className="text-[11px] font-semibold bg-white/70 border border-black/20 rounded px-2 py-1 outline-none"
                  >
                    <option value="">Unassigned</option>
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.deskLabel})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between text-xs text-stone-500 ${
            isNight ? "border-stone-800 bg-stone-950/60" : "border-amber-200/60 bg-[#F4EEDF]"
          }`}
        >
          <span>Drag sticky notes directly to staff desks on the Studio Floor to assign!</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#A96C4B] text-white font-medium hover:bg-[#8D583B] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default StickyNoteBoardModal
