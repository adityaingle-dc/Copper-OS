
import { useState } from "react"
import {
  Sun,
  Moon,
  Users,
  BriefcaseBusiness,
  Wallet,
  ClipboardList,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Search,
  Filter,
  CalendarDays,
  ChevronRight,
  CircleDot,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Plus,
  Download,
} from "lucide-react"

import { initialStudioData } from "../../data/studioData"

function Dashboard() {
  const [data] = useState(initialStudioData)
  const [isNight, setIsNight] = useState(false)
  const [search, setSearch] = useState("")

  const projects = data.projects || []
  const tasks = data.tasks || []
  const staff = data.staff || []
  const clients = data.clients || []

  const completedTasks = tasks.filter(
    (t) => ["completed", "done"].includes(
      String(t.status || "").toLowerCase()
    )
  ).length

  const activeProjects = projects.filter(
    (p) => ["active", "in progress", "ongoing"].includes(
      String(p.status || "").toLowerCase()
    )
  ).length

  const revenue = data.jar?.currentAmount || 0
  const pendingTasks = tasks.length - completedTasks

  const uniqueClients = new Set([
    ...clients.map((c) => c.id || c.name),
    ...projects.map((p) => p.clientId || p.client),
  ].filter(Boolean)).size

  const currency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)

  const dark = isNight

  const surface = dark
    ? "bg-[#25221F]/85 border-white/[0.07]"
    : "bg-white/75 border-white/90"

  const textMain = dark ? "text-stone-100" : "text-[#352B24]"
  const textMuted = dark ? "text-stone-400" : "text-stone-500"
  const line = dark ? "border-white/[0.07]" : "border-stone-200/70"

  const statusStyle = (status) => {
    const s = String(status || "").toLowerCase()

    if (["completed", "done", "paid"].includes(s))
      return dark
        ? "bg-emerald-400/10 text-emerald-400"
        : "bg-emerald-50 text-emerald-700"

    if (["in progress", "active", "ongoing"].includes(s))
      return dark
        ? "bg-blue-400/10 text-blue-400"
        : "bg-blue-50 text-blue-700"

    return dark
      ? "bg-amber-400/10 text-amber-400"
      : "bg-amber-50 text-amber-700"
  }

  const metrics = [
    {
      title: "Total Projects",
      value: projects.length,
      subtitle: `${activeProjects} active projects`,
      icon: FolderKanban,
      color: "copper",
      trend: null,
    },
    {
      title: "Total Clients",
      value: uniqueClients,
      subtitle: "Clients in workspace",
      icon: Users,
      color: "blue",
      trend: null,
    },
    {
      title: "Pending Tasks",
      value: pendingTasks,
      subtitle: `${completedTasks} completed`,
      icon: ClipboardList,
      color: "violet",
      trend: null,
    },
    {
      title: "Total Income",
      value: currency(revenue),
      subtitle: "Recorded payments",
      icon: Wallet,
      color: "green",
      trend: null,
    },
  ]

  const filteredProjects = projects.filter((p) =>
    `${p.name || p.title || ""} ${p.client || p.clientName || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const getProjectName = (p) =>
    p.name || p.title || p.projectName || "Untitled Project"

  const getTaskName = (t) =>
    t.title || t.name || t.description || "Untitled Task"

  const getAssignee = (task) => {
    const member = staff.find((s) => s.id === task.assignedDeskId)
    return member?.name || task.assignee || task.assignedTo || "Unassigned"
  }

  return (
    <div
  className={`min-h-full -m-4 sm:-m-6 p-4 sm:p-6 lg:p-8 rounded-2xl transition-colors duration-300 ${
    dark ? "bg-[#191715]" : "bg-[#F5F4F1]"
  } ${textMain}`}
>

      {/* Ambient background */}
      <div className="fixed top-20 right-0 w-96 h-96 rounded-full
        bg-[#B77B57]/[0.035] blur-[100px] pointer-events-none" />

      <div className="relative max-w-[1600px] mx-auto space-y-7">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center
          justify-between gap-5">

          <div>
            <div className={`flex items-center gap-2 text-[11px]
              font-semibold tracking-[0.14em] uppercase ${textMuted}`}>
              <span>Workspace</span>
              <ChevronRight size={12} />
              <span className="text-[#A96C4B]">Overview</span>
            </div>

            <h1 className="text-[27px] font-bold tracking-tight mt-2">
              Dashboard
            </h1>

            <p className={`text-[13px] mt-1 ${textMuted}`}>
              Here's what's happening across your business.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNight(!isNight)}
              className={`h-10 w-10 flex items-center justify-center
                rounded-xl border backdrop-blur-xl transition
                ${surface} ${textMuted} hover:text-[#A96C4B]`}
              title="Toggle appearance"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <button className={`h-10 px-4 flex items-center gap-2
              rounded-xl border text-xs font-semibold backdrop-blur-xl
              transition ${surface} ${textMain} hover:border-[#C69A7E]`}>
              <CalendarDays size={15} />
              All time
            </button>

            <button className="h-10 px-4 flex items-center gap-2
              rounded-xl bg-[#A96C4B] hover:bg-[#925B3E]
              text-white text-xs font-semibold shadow-lg
              shadow-[#A96C4B]/15 transition">
              <Plus size={16} />
              New Project
            </button>
          </div>
        </div>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {metrics.map((item) => {
            const Icon = item.icon

            const iconColors = {
              copper: "bg-[#A96C4B]/10 text-[#A96C4B]",
              blue: "bg-blue-500/10 text-blue-500",
              violet: "bg-violet-500/10 text-violet-500",
              green: "bg-emerald-500/10 text-emerald-600",
            }

            return (
              <div key={item.title}
                className={`relative overflow-hidden rounded-2xl
                  border p-5 backdrop-blur-xl
                  shadow-[0_3px_18px_rgba(60,45,30,0.025)]
                  hover:-translate-y-0.5 transition-all duration-200 ${surface}`}>

                <div className="flex items-center justify-between">
                  <p className={`text-[12px] font-medium ${textMuted}`}>
                    {item.title}
                  </p>

                  <div className={`w-9 h-9 rounded-xl flex items-center
                    justify-center ${iconColors[item.color]}`}>
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                </div>

                <h2 className="text-[27px] font-bold tracking-tight mt-5">
                  {item.value}
                </h2>

                <div className={`flex items-center gap-1.5 mt-2
                  text-[11px] ${textMuted}`}>
                  {item.subtitle}
                </div>
              </div>
            )
          })}
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* PROJECTS - WIDE */}
          <section className={`xl:col-span-2 rounded-2xl border
            backdrop-blur-xl overflow-hidden shadow-sm ${surface}`}>

            <div className="px-5 py-5 flex flex-col sm:flex-row
              sm:items-center justify-between gap-4">

              <div>
                <h2 className="text-[15px] font-bold">Projects</h2>
                <p className={`text-[11px] mt-1 ${textMuted}`}>
                  Manage and track your ongoing work.
                </p>
              </div>

              <div className="flex items-center gap-2">

                <div className={`flex items-center gap-2 px-3 h-9
                  rounded-lg border ${line}
                  ${dark ? "bg-stone-900/60" : "bg-stone-50/80"}`}>
                  <Search size={14} className={textMuted} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search projects"
                    className={`bg-transparent outline-none text-xs
                      w-28 sm:w-36 ${textMain}
                      placeholder:text-stone-400`}
                  />
                </div>

                <button className={`h-9 w-9 flex items-center justify-center
                  rounded-lg border ${line} ${textMuted}`}>
                  <Filter size={15} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={`border-y ${line}
                    ${dark ? "bg-white/[0.025]" : "bg-stone-50/70"}`}>
                    {["PROJECT", "CLIENT", "STATUS", "DEADLINE"].map((h) => (
                      <th key={h} className={`px-5 py-3 text-[10px]
                        font-semibold tracking-[0.1em] ${textMuted}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan="4" className={`px-5 py-12
                        text-center text-xs ${textMuted}`}>
                        No matching projects found.
                      </td>
                    </tr>
                  ) : filteredProjects.slice(0, 7).map((p, i) => (
                    <tr key={p.id || i}
                      className={`border-b last:border-0 ${line}
                        ${dark ? "hover:bg-white/[0.025]" : "hover:bg-stone-50/80"}
                        transition-colors`}>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex
                            items-center justify-center
                            text-[#A96C4B]
                            ${dark ? "bg-[#A96C4B]/15" : "bg-[#F4EAE3]"}`}>
                            <FolderKanban size={15} />
                          </div>
                          <div>
                            <p className="text-[12px] font-semibold">
                              {getProjectName(p)}
                            </p>
                            <p className={`text-[10px] mt-1 ${textMuted}`}>
                              {p.category || "Project"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className={`px-5 py-4 text-[11px] ${textMuted}`}>
                        {p.client || p.clientName || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5
                          px-2.5 py-1 rounded-md text-[10px] font-semibold
                          ${statusStyle(p.status)}`}>
                          <CircleDot size={10} />
                          {p.status || "Pending"}
                        </span>
                      </td>

                      <td className={`px-5 py-4 text-[11px] ${textMuted}`}>
                        {p.deadline || p.dueDate || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={`px-5 py-3 border-t ${line}
              flex items-center justify-between`}>
              <span className={`text-[10px] ${textMuted}`}>
                Showing {Math.min(filteredProjects.length, 7)} of {filteredProjects.length} projects
              </span>
              <button className="text-[11px] text-[#A96C4B]
                font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                View all <ArrowUpRight size={13} />
              </button>
            </div>
          </section>

          {/* RIGHT SIDE SUMMARY */}
          <section className={`rounded-2xl border p-5 backdrop-blur-xl
            shadow-sm ${surface}`}>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-bold">Task Summary</h2>
                <p className={`text-[11px] mt-1 ${textMuted}`}>
                  Current task distribution.
                </p>
              </div>
              <button className={textMuted}>
                <MoreHorizontal size={19} />
              </button>
            </div>

            <div className="mt-7">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-4xl font-bold tracking-tight">
                    {tasks.length
                      ? Math.round((completedTasks / tasks.length) * 100)
                      : 0}%
                  </h3>
                  <p className={`text-[11px] mt-1 ${textMuted}`}>
                    Completion rate
                  </p>
                </div>
                <CheckCircle2 size={25} className="text-[#A96C4B]" />
              </div>

              <div className={`h-2 rounded-full mt-5 overflow-hidden
                ${dark ? "bg-stone-700" : "bg-stone-100"}`}>
                <div
                  className="h-full rounded-full bg-[#A96C4B] transition-all"
                  style={{
                    width: `${tasks.length
                      ? (completedTasks / tasks.length) * 100
                      : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className={`mt-7 space-y-4 pt-5 border-t ${line}`}>
              {[
                {
                  label: "Completed",
                  value: completedTasks,
                  icon: CheckCircle2,
                  color: "text-emerald-500",
                },
                {
                  label: "Pending",
                  value: pendingTasks,
                  icon: Clock3,
                  color: "text-amber-500",
                },
                {
                  label: "Total Tasks",
                  value: tasks.length,
                  icon: ClipboardList,
                  color: "text-[#A96C4B]",
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label}
                    className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={item.color} />
                      <span className={`text-xs ${textMuted}`}>
                        {item.label}
                      </span>
                    </div>
                    <span className="text-sm font-semibold">
                      {item.value}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* RECENT TASKS */}
        <section className={`rounded-2xl border overflow-hidden
          backdrop-blur-xl shadow-sm ${surface}`}>

          <div className="px-5 py-5 flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold">Recent Tasks</h2>
              <p className={`text-[11px] mt-1 ${textMuted}`}>
                Latest tasks and their assignments.
              </p>
            </div>

            <button className="text-[11px] font-semibold
              text-[#A96C4B] flex items-center gap-1">
              View all <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`border-y ${line}
                  ${dark ? "bg-white/[0.025]" : "bg-stone-50/70"}`}>
                  {["TASK", "ASSIGNEE", "PRIORITY", "STATUS"].map((h) => (
                    <th key={h} className={`px-5 py-3 text-[10px]
                      font-semibold tracking-[0.1em] ${textMuted}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {tasks.slice(0, 5).map((task, i) => (
                  <tr key={task.id || i}
                    className={`border-b last:border-0 ${line}
                      ${dark ? "hover:bg-white/[0.025]" : "hover:bg-stone-50/80"}
                      transition-colors`}>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium">
                        {getTaskName(task)}
                      </span>
                    </td>

                    <td className={`px-5 py-4 text-xs ${textMuted}`}>
                      {getAssignee(task)}
                    </td>

                    <td className={`px-5 py-4 text-xs ${textMuted}`}>
                      {task.priority || "Normal"}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-md
                        text-[10px] font-semibold ${statusStyle(task.status)}`}>
                        {task.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}

                {tasks.length === 0 && (
                  <tr>
                    <td colSpan="4" className={`text-center py-10
                      text-xs ${textMuted}`}>
                      No tasks available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* FOOTER */}
        <div className={`flex justify-between items-center
          text-[10px] ${textMuted}`}>
          <span>Copper OS · Business Management Platform</span>
          <span>Workspace Overview</span>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
