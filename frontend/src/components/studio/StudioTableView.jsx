import { useState } from "react"
import { Layers, CheckSquare, Users, Wallet, FileText } from "lucide-react"

function StudioTableView({ data, isNight }) {
  const [activeTab, setActiveTab] = useState("projects")

  const tabs = [
    { id: "projects", label: "Projects", icon: Layers, count: data.projects.length },
    { id: "tasks", label: "Tasks", icon: CheckSquare, count: data.tasks.length },
    { id: "staff", label: "Staff", icon: Users, count: data.staff.length },
    { id: "accounts", label: "Accounts", icon: Wallet, count: data.jar.recentPayments.length },
    { id: "documents", label: "Documents", icon: FileText, count: data.documents.length },
  ]

  return (
    <div className="space-y-6">
      {/* Power-User Table Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#A96C4B] text-white shadow-xs"
                  : isNight
                  ? "bg-stone-800 text-stone-300 hover:bg-stone-700"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isActive ? "bg-white/20 text-white" : "bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300"
              }`}>
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Projects Table */}
      {activeTab === "projects" && (
        <div className={`overflow-x-auto rounded-xl border ${isNight ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200"}`}>
          <table className="w-full text-left text-sm">
            <thead className={`text-xs uppercase tracking-wider font-bold border-b ${isNight ? "bg-stone-950/60 text-stone-400 border-stone-800" : "bg-stone-50 text-stone-500 border-stone-200"}`}>
              <tr>
                <th className="px-6 py-3.5">Project</th>
                <th className="px-6 py-3.5">Client</th>
                <th className="px-6 py-3.5">Stage</th>
                <th className="px-6 py-3.5">Budget</th>
                <th className="px-6 py-3.5">Due Date</th>
                <th className="px-6 py-3.5">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {data.projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                  <td className="px-6 py-4 font-semibold text-stone-900 dark:text-stone-100">{proj.title}</td>
                  <td className="px-6 py-4 text-stone-500">{proj.client}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-[#A96C4B] dark:bg-amber-950 dark:text-amber-300">
                      {proj.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold">{proj.budget}</td>
                  <td className="px-6 py-4 text-stone-500">{proj.dueDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                        <div className="h-full bg-[#A96C4B] rounded-full" style={{ width: `${proj.fill}%` }} />
                      </div>
                      <span className="text-xs text-stone-500 font-medium">{proj.fill}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tasks Table */}
      {activeTab === "tasks" && (
        <div className={`overflow-x-auto rounded-xl border ${isNight ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200"}`}>
          <table className="w-full text-left text-sm">
            <thead className={`text-xs uppercase tracking-wider font-bold border-b ${isNight ? "bg-stone-950/60 text-stone-400 border-stone-800" : "bg-stone-50 text-stone-500 border-stone-200"}`}>
              <tr>
                <th className="px-6 py-3.5">Task Description</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Project</th>
                <th className="px-6 py-3.5">Assigned To</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {data.tasks.map((task) => {
                const assigned = data.staff.find((s) => s.id === task.assignedDeskId)
                return (
                  <tr key={task.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                    <td className={`px-6 py-4 font-medium ${task.done ? "line-through text-stone-400" : ""}`}>{task.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                        {task.tag}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-500">{task.project}</td>
                    <td className="px-6 py-4 font-semibold text-stone-700 dark:text-stone-300">
                      {assigned ? `${assigned.name} (${assigned.deskLabel})` : "Unassigned"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold ${task.priority === "High" ? "text-red-500" : "text-stone-500"}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${task.done ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {task.done ? "Completed" : "Active"}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Staff Table */}
      {activeTab === "staff" && (
        <div className={`overflow-x-auto rounded-xl border ${isNight ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200"}`}>
          <table className="w-full text-left text-sm">
            <thead className={`text-xs uppercase tracking-wider font-bold border-b ${isNight ? "bg-stone-950/60 text-stone-400 border-stone-800" : "bg-stone-50 text-stone-500 border-stone-200"}`}>
              <tr>
                <th className="px-6 py-3.5">Staff Member</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Workstation</th>
                <th className="px-6 py-3.5">Current Deliverable</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {data.staff.map((s) => (
                <tr key={s.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                  <td className="px-6 py-4 font-semibold flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.avatarBg, color: s.avatarColor }}>
                      {s.initials}
                    </span>
                    {s.name}
                  </td>
                  <td className="px-6 py-4 text-stone-500">{s.role}</td>
                  <td className="px-6 py-4 font-medium">{s.deskLabel}</td>
                  <td className="px-6 py-4 text-stone-600 dark:text-stone-300">{s.currentTask}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      s.status === "At Desk" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Accounts Table */}
      {activeTab === "accounts" && (
        <div className={`overflow-x-auto rounded-xl border ${isNight ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200"}`}>
          <table className="w-full text-left text-sm">
            <thead className={`text-xs uppercase tracking-wider font-bold border-b ${isNight ? "bg-stone-950/60 text-stone-400 border-stone-800" : "bg-stone-50 text-stone-500 border-stone-200"}`}>
              <tr>
                <th className="px-6 py-3.5">Client</th>
                <th className="px-6 py-3.5">Project Milestone</th>
                <th className="px-6 py-3.5">Amount Received</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {data.jar.recentPayments.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                  <td className="px-6 py-4 font-semibold">{p.client}</td>
                  <td className="px-6 py-4 text-stone-500">{p.project}</td>
                  <td className="px-6 py-4 font-bold text-green-600 dark:text-green-400">+${p.amount.toLocaleString()} USD</td>
                  <td className="px-6 py-4 text-stone-500">{p.date}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 border border-green-300">
                      PAID
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Documents Table */}
      {activeTab === "documents" && (
        <div className={`overflow-x-auto rounded-xl border ${isNight ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200"}`}>
          <table className="w-full text-left text-sm">
            <thead className={`text-xs uppercase tracking-wider font-bold border-b ${isNight ? "bg-stone-950/60 text-stone-400 border-stone-800" : "bg-stone-50 text-stone-500 border-stone-200"}`}>
              <tr>
                <th className="px-6 py-3.5">Document Title</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Client / Scope</th>
                <th className="px-6 py-3.5">File Size</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {data.documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                  <td className="px-6 py-4 font-semibold text-stone-900 dark:text-stone-100">{doc.title}</td>
                  <td className="px-6 py-4 text-stone-500">{doc.type}</td>
                  <td className="px-6 py-4">{doc.client}</td>
                  <td className="px-6 py-4 text-stone-500">{doc.size}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      {doc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default StudioTableView
