import { useState } from "react"
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { playCopperChime, playStampSound, triggerConfetti } from "../../utils/delights"

function StudioFloor({
  data,
  isNight,
  reducedMotion,
  onOpenModule,
  onAssignTaskToStaff,
}) {
  const [draggedTaskId, setDraggedTaskId] = useState(null)
  const [dropHoverDeskId, setDropHoverDeskId] = useState(null)
  const [notification, setNotification] = useState(null)

  const showToast = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3000)
  }

  // Handle drag of sticky note
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("application/task-id", taskId)
    setDraggedTaskId(taskId)
    playStampSound()
  }

  const handleDragOverDesk = (e, deskId) => {
    e.preventDefault()
    if (dropHoverDeskId !== deskId) {
      setDropHoverDeskId(deskId)
    }
  }

  const handleDragLeaveDesk = (e, deskId) => {
    if (dropHoverDeskId === deskId) {
      setDropHoverDeskId(null)
    }
  }

  const handleDropOnDesk = (e, deskId) => {
    e.preventDefault()
    setDropHoverDeskId(null)
    const taskId = e.dataTransfer.getData("application/task-id") || draggedTaskId
    setDraggedTaskId(null)

    if (taskId) {
      const task = data.tasks.find((t) => t.id === taskId)
      const staffMember = data.staff.find((s) => s.id === deskId)

      if (task && staffMember) {
        onAssignTaskToStaff(taskId, deskId)
        playCopperChime()
        if (!reducedMotion) {
          triggerConfetti(e.clientX, e.clientY)
        }
        showToast(`Assigned "${task.title.slice(0, 24)}..." to ${staffMember.name}!`)
      }
    }
  }

  // Calculate live stats
  const activeProjectsCount = data.projects.filter((p) => p.stage !== "Delivered").length
  const unassignedTasksCount = data.tasks.filter((t) => !t.assignedDeskId).length
  const staffPresentCount = data.staff.filter((s) => s.status === "At Desk").length
  const jarFillPercent = Math.min(100, Math.round((data.jar.currentAmount / data.jar.monthlyTarget) * 100))

  return (
    <div className="relative w-full select-none">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#A96C4B] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 size={18} />
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}

      {/* Main Studio Floor Canvas Container */}
      <div
        className={`w-full min-h-[720px] rounded-3xl border relative overflow-hidden transition-all duration-700 p-6 md:p-10 flex flex-col justify-between ${
          isNight
            ? "bg-[#14151a] border-stone-800 text-stone-100 shadow-2xl"
            : "bg-[#F3EFE6] border-[#DECFC0] text-stone-800 shadow-xl"
        }`}
        style={{
          backgroundImage: isNight
            ? "radial-gradient(circle at 50% 30%, rgba(251, 191, 36, 0.08) 0%, transparent 60%), radial-gradient(#262935 1px, transparent 1px)"
            : "radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.7) 0%, transparent 65%), radial-gradient(#D6C6B3 1px, transparent 1px)",
          backgroundSize: "100% 100%, 28px 28px",
        }}
      >
        {/* Studio Lighting Ambient Glow */}
        {isNight && (
          <div className="absolute inset-0 pointer-events-none bg-radial from-amber-500/10 via-transparent to-black/40" />
        )}

        {/* Studio Floor Header Banner / Instructions */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest font-black text-[#A96C4B]">
              Studio Floor Plan
            </span>
            <span className="h-3 w-px bg-stone-300 dark:bg-stone-700" />
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Interactive 3D floor · Drag sticky notes onto staff desks to assign · Click any object
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              Live Studio
            </span>
          </div>
        </div>

        {/* ----------------- TOP ZONE: Frame Wall & Sticky-Note Board ----------------- */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 my-4">
          {/* OBJECT 1: The Frame Wall (Projects) */}
          <div
            tabIndex={0}
            role="button"
            aria-label="Frame Wall - Projects module"
            onClick={() => onOpenModule("frames")}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpenModule("frames")}
            className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5 focus:ring-4 focus:ring-[#A96C4B] outline-none ${
              isNight
                ? "bg-stone-900/80 border-stone-700/80 hover:border-amber-500 shadow-lg"
                : "bg-white/80 border-stone-200/90 hover:border-[#A96C4B] shadow-md hover:shadow-xl"
            }`}
          >
            {/* Hotspot Floating Pill */}
            <div className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-[#A96C4B] text-white text-[11px] font-bold shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105">
              <span>🖼️</span>
              <span>{activeProjectsCount} Active Projects</span>
              <span className="text-amber-200">· $97.5k Pipeline</span>
            </div>

            <div className="flex items-center justify-between mb-3 mt-1">
              <div>
                <h3 className="text-base font-bold tracking-tight">The Frame Wall</h3>
                <p className="text-xs text-stone-400">Visual progress frames & stages</p>
              </div>
              <span className="text-xs font-semibold text-[#A96C4B] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Inspect Wall <ArrowRight size={13} />
              </span>
            </div>

            {/* Illustrated Mini Frames on Wall */}
            <div className="grid grid-cols-4 gap-2.5 pt-2">
              {data.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-lg p-2 border border-stone-200/80 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 flex flex-col justify-between h-24 relative overflow-hidden"
                >
                  <div className="text-[10px] font-bold truncate">{proj.title}</div>

                  {/* Visual Fill indicator inside frame */}
                  <div className="w-full h-8 rounded bg-stone-200/60 dark:bg-stone-700/60 overflow-hidden relative mt-1">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-[#A96C4B]/80 transition-all duration-500"
                      style={{ height: `${proj.fill}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-bold text-stone-500">
                    <span className="truncate">{proj.stage}</span>
                    <span className="text-[#A96C4B]">{proj.fill}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OBJECT 2: The Sticky-Note Board (Tasks) */}
          <div
            tabIndex={0}
            role="button"
            aria-label="Sticky-Note Board - Tasks module"
            onClick={() => onOpenModule("tasks")}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpenModule("tasks")}
            className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5 focus:ring-4 focus:ring-amber-500 outline-none ${
              isNight
                ? "bg-[#25221b]/90 border-amber-900/60 hover:border-amber-400 shadow-lg"
                : "bg-[#F7EED8]/90 border-amber-300/80 hover:border-amber-600 shadow-md hover:shadow-xl"
            }`}
          >
            {/* Hotspot Floating Pill */}
            <div className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-amber-600 text-white text-[11px] font-bold shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105">
              <span>📌</span>
              <span>{data.tasks.length} Pinned Notes</span>
              <span className="text-amber-200">· {unassignedTasksCount} unassigned</span>
            </div>

            <div className="flex items-center justify-between mb-3 mt-1">
              <div>
                <h3 className="text-base font-bold tracking-tight">Sticky-Note Corkboard</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Drag any sticky note directly onto a desk below!
                </p>
              </div>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open Corkboard <ArrowRight size={13} />
              </span>
            </div>

            {/* Draggable Sticky Notes on Board */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              {data.tasks.slice(0, 6).map((task) => {
                const assigned = data.staff.find((s) => s.id === task.assignedDeskId)

                return (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => {
                      e.stopPropagation()
                      handleDragStart(e, task.id)
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenModule("tasks")
                    }}
                    className={`p-2.5 rounded-lg shadow-sm border text-stone-900 cursor-grab active:cursor-grabbing hover:scale-105 hover:shadow-md transition-all flex flex-col justify-between h-24 ${
                      task.done ? "opacity-50" : ""
                    }`}
                    style={{
                      backgroundColor: task.color,
                      borderColor: `${task.color}BB`,
                    }}
                    title="Drag me onto a staff desk!"
                  >
                    <p className="text-[11px] font-bold line-clamp-2 leading-tight">
                      {task.title}
                    </p>

                    <div className="flex items-center justify-between text-[9px] pt-1 border-t border-black/10">
                      <span className="font-semibold text-stone-700">{task.tag}</span>
                      <span className="font-bold text-[#A96C4B]">
                        {assigned ? assigned.initials : "Open"}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ----------------- CENTER ZONE: The Round Table & Meetings ----------------- */}
        <div className="relative z-10 flex items-center justify-center my-6">
          <div
            tabIndex={0}
            role="button"
            aria-label="Round Table - Meetings & Collaboration"
            onClick={() => onOpenModule("meetings")}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpenModule("meetings")}
            className={`group relative w-72 h-72 rounded-full border-4 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-6 text-center shadow-xl hover:scale-105 focus:ring-4 focus:ring-amber-500 outline-none ${
              isNight
                ? "bg-gradient-to-b from-stone-800 to-stone-900 border-amber-800/40 hover:border-amber-500"
                : "bg-gradient-to-b from-[#EFE5D5] to-[#DFD0BC] border-[#BCA58C] hover:border-[#A96C4B]"
            }`}
          >
            {/* Hotspot Floating Pill */}
            <div className="absolute -top-4 px-3.5 py-1 rounded-full bg-amber-700 text-white text-[11px] font-bold shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105">
              <span>☕</span>
              <span>Next Sync @ 2:30 PM</span>
            </div>

            {/* Tabletop details */}
            <div className="w-16 h-16 rounded-full bg-[#A96C4B]/20 dark:bg-amber-400/10 flex items-center justify-center mb-2">
              <span className="text-3xl">☕</span>
            </div>

            <h4 className="font-black text-sm tracking-tight text-stone-800 dark:text-stone-100">
              The Round Table
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Design Sprints & Live Reviews
            </p>

            <span className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/60 dark:bg-stone-800/60 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300">
              2 Scheduled Today
            </span>
          </div>
        </div>

        {/* ----------------- BOTTOM ZONE: Staff Desks, Jar, Cabinet, Toolbox ----------------- */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-end my-2">
          {/* OBJECT 4: Staff Workstation Desks (Drag-and-Drop Dropzone!) */}
          <div
            tabIndex={0}
            role="button"
            aria-label="Staff Desks - Team Workstations"
            onClick={() => onOpenModule("staff")}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpenModule("staff")}
            className={`md:col-span-2 group relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer focus:ring-4 focus:ring-indigo-500 outline-none ${
              isNight
                ? "bg-stone-900/80 border-stone-700 hover:border-indigo-500 shadow-lg"
                : "bg-white/80 border-stone-200 hover:border-indigo-600 shadow-md hover:shadow-xl"
            }`}
          >
            {/* Hotspot Floating Pill */}
            <div className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105">
              <span>🧑‍💻</span>
              <span>{staffPresentCount} of {data.staff.length} at Desk</span>
              <span className="text-indigo-200">· Drag Note to Assign</span>
            </div>

            <div className="flex items-center justify-between mb-3 mt-1">
              <div>
                <h3 className="text-base font-bold tracking-tight">Staff Desks</h3>
                <p className="text-xs text-stone-400">
                  Drop sticky notes onto any workstation below!
                </p>
              </div>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Attendance <ArrowRight size={13} />
              </span>
            </div>

            {/* 4 Workstations with Drop Targets */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {data.staff.map((desk) => {
                const isHovered = dropHoverDeskId === desk.id
                const deskTasks = data.tasks.filter((t) => t.assignedDeskId === desk.id)

                return (
                  <div
                    key={desk.id}
                    onDragOver={(e) => handleDragOverDesk(e, desk.id)}
                    onDragLeave={(e) => handleDragLeaveDesk(e, desk.id)}
                    onDrop={(e) => handleDropOnDesk(e, desk.id)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${
                      isHovered
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 scale-105 shadow-md"
                        : isNight
                        ? "bg-stone-800/60 border-stone-700/60 hover:border-stone-500"
                        : "bg-stone-50 border-stone-200/80 hover:border-stone-400"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs"
                        style={{ backgroundColor: desk.avatarBg, color: desk.avatarColor }}
                      >
                        {desk.initials}
                      </div>
                      <div>
                        <h5 className="font-bold text-xs truncate w-24">{desk.name}</h5>
                        <p className="text-[10px] text-stone-400">{desk.deskLabel}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {deskTasks.length} {deskTasks.length === 1 ? "task" : "tasks"}
                      </span>
                      <div className="text-[9px] text-stone-400 mt-1">{desk.status}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* OBJECT 5: The Copper Jar (Accounts) */}
          <div
            tabIndex={0}
            role="button"
            aria-label="The Copper Jar - Accounts & Cashflow"
            onClick={() => onOpenModule("jar")}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpenModule("jar")}
            className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col items-center justify-between text-center focus:ring-4 focus:ring-[#A96C4B] outline-none ${
              isNight
                ? "bg-stone-900/80 border-stone-700 hover:border-amber-400 shadow-lg"
                : "bg-white/80 border-stone-200 hover:border-[#A96C4B] shadow-md hover:shadow-xl"
            }`}
          >
            {/* Hotspot Floating Pill */}
            <div className="absolute -top-3.5 px-3 py-1 rounded-full bg-[#A96C4B] text-white text-[11px] font-bold shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105">
              <span>🏺</span>
              <span>${data.jar.currentAmount.toLocaleString()}</span>
              <span className="text-amber-200">({jarFillPercent}%)</span>
            </div>

            <div className="w-full text-left mb-2 mt-1">
              <h3 className="text-base font-bold tracking-tight">The Copper Jar</h3>
              <p className="text-xs text-stone-400">Accounts & Cashflow</p>
            </div>

            {/* Visual Jar Graphics */}
            <div className="w-24 h-32 border-3 border-amber-800/40 rounded-b-3xl rounded-t-lg relative overflow-hidden bg-white/40 dark:bg-stone-800/40 my-2 flex flex-col justify-end shadow-inner">
              <div className="absolute top-0 left-0 right-0 h-3 bg-[#A96C4B]" />
              <div
                className="w-full bg-gradient-to-t from-[#8D583B] to-[#E59E78] transition-all duration-700 flex items-center justify-center"
                style={{ height: `${jarFillPercent}%` }}
              >
                <Sparkles size={14} className="text-yellow-200 animate-spin" />
              </div>
            </div>

            <div className="text-xs font-semibold text-[#A96C4B]">
              Goal: ${data.jar.monthlyTarget.toLocaleString()}
            </div>
          </div>

          {/* OBJECT 6 & 7: Filing Cabinet & Toolbox */}
          <div className="flex flex-col gap-3">
            {/* Filing Cabinet */}
            <div
              tabIndex={0}
              role="button"
              aria-label="Filing Cabinet - Documents"
              onClick={() => onOpenModule("documents")}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpenModule("documents")}
              className={`group relative p-3.5 rounded-2xl border-2 transition-all cursor-pointer focus:ring-4 focus:ring-stone-500 outline-none ${
                isNight
                  ? "bg-stone-900/80 border-stone-700 hover:border-stone-400"
                  : "bg-white/80 border-stone-200 hover:border-stone-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🗄️</span>
                <div className="text-left">
                  <h4 className="text-xs font-bold">Filing Cabinet</h4>
                  <p className="text-[10px] text-stone-400">
                    {data.documents.length} Docs & Proposals
                  </p>
                </div>
              </div>
            </div>

            {/* Studio Toolbox (Settings) */}
            <div
              tabIndex={0}
              role="button"
              aria-label="Toolbox - Studio Settings"
              onClick={() => onOpenModule("toolbox")}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpenModule("toolbox")}
              className={`group relative p-3.5 rounded-2xl border-2 transition-all cursor-pointer focus:ring-4 focus:ring-amber-500 outline-none ${
                isNight
                  ? "bg-stone-900/80 border-stone-700 hover:border-amber-500"
                  : "bg-white/80 border-stone-200 hover:border-[#A96C4B]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧰</span>
                <div className="text-left">
                  <h4 className="text-xs font-bold">Studio Toolbox</h4>
                  <p className="text-[10px] text-stone-400">
                    Day/Night, Chimes, Motion
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudioFloor
