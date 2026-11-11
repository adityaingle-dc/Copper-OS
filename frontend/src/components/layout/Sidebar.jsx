
import { useState } from "react"
import { NavLink } from "react-router-dom"

import {
  LayoutDashboard,
  Users,
  Contact,
  FileText,
  Layers3,
  Receipt,
  Wallet,
  ChartNoAxesCombined,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const navigation = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "WORKSPACE",
    items: [
      { name: "Leads", path: "/leads", icon: Users },
      { name: "Clients", path: "/clients", icon: Contact },
      { name: "Proposals", path: "/proposals", icon: FileText },
      { name: "Projects", path: "/projects", icon: Layers3 },
      { name: "Invoices", path: "/invoices", icon: Receipt },
      { name: "Income", path: "/income", icon: Wallet },
    ],
  },
  {
    title: "INSIGHTS",
    items: [
      { name: "Reports", path: "/reports", icon: ChartNoAxesCombined },
    ],
  },
]

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`
        relative z-40 sticky top-0
        h-screen shrink-0 flex flex-col
        overflow-visible
        bg-white/[0.58] backdrop-blur-2xl
        border-r border-white/70
        shadow-[8px_0_35px_rgba(60,45,30,0.045)]
        transition-[width] duration-300 ease-in-out
        ${collapsed ? "w-[76px]" : "w-[258px]"}
      `}
    >
      {/* Ambient Glass Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-56 h-56
          rounded-full bg-[#C28B69]/[0.09] blur-[80px]" />
        <div className="absolute bottom-20 -left-16 w-48 h-48
          rounded-full bg-[#D6B8A0]/[0.08] blur-[80px]" />
      </div>

      {/* BRAND HEADER */}
      <div className={`
        relative h-[82px] shrink-0
        flex items-center border-b border-stone-200/50
        ${collapsed ? "justify-center px-2" : "px-5"}
      `}>
        <div className="flex items-center gap-3 min-w-0">

          <div className="
            w-10 h-10 shrink-0 rounded-xl
            flex items-center justify-center
            bg-gradient-to-br from-[#B77B57] to-[#875438]
            text-white shadow-[0_4px_14px_rgba(169,108,75,0.22)]
            ring-1 ring-white/50
          ">
            <span className="font-serif text-2xl font-bold">C</span>
          </div>

          {!collapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="text-[14px] font-bold tracking-[0.16em]
                text-[#352B24]">
                COPPER OS
              </h1>
              <p className="text-[10px] text-stone-400 mt-0.5">
                The Copper Studio
              </p>
            </div>
          )}
        </div>
      </div>

      {/* COLLAPSE / EXPAND BUTTON */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        className={`
          absolute top-[96px] z-50
          w-7 h-7 rounded-full
          flex items-center justify-center
          bg-white/90 backdrop-blur-xl
          border border-stone-200/80
          text-stone-500
          shadow-[0_2px_8px_rgba(0,0,0,0.08)]
          hover:text-[#A96C4B]
          hover:border-[#C69A7E]
          hover:bg-[#F4EAE3]
          transition-all duration-200
          ${collapsed
            ? "left-1/2 -translate-x-1/2"
            : "-right-3"
          }
        `}
      >
        {collapsed
          ? <ChevronRight size={15} strokeWidth={2} />
          : <ChevronLeft size={15} strokeWidth={2} />
        }
      </button>

      {/* NAVIGATION */}
      <nav className={`
        flex-1 min-h-0 overflow-y-auto overflow-x-hidden
        pt-12 pb-5 space-y-5
        ${collapsed ? "px-3" : "px-4"}
      `}>

        {navigation.map((section) => (
          <div key={section.title}>

            {/* Section Heading */}
            {!collapsed && (
              <div className="px-3 mb-2.5">
                <p className="text-[10px] font-bold
                  tracking-[0.14em] text-stone-400 whitespace-nowrap">
                  {section.title}
                </p>
              </div>
            )}

            {/* Navigation Items */}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.name : undefined}
                    className={({ isActive }) => `
                      group/item relative flex items-center
                      rounded-xl transition-all duration-200
                      ${collapsed
                        ? "justify-center w-full h-11"
                        : "gap-3 px-3 h-[42px]"
                      }
                      ${
                        isActive
                          ? "bg-[#A96C4B]/[0.12] text-[#985F40] shadow-[inset_0_0_0_1px_rgba(169,108,75,0.12)]"
                          : "text-stone-500 hover:bg-white/60 hover:text-[#78513A]"
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="
                            absolute left-0 top-2.5 bottom-2.5
                            w-[3px] rounded-r-full bg-[#A96C4B]
                          " />
                        )}

                        <Icon
                          size={18}
                          strokeWidth={isActive ? 2.1 : 1.7}
                          className={`
                            shrink-0 transition-colors
                            ${isActive
                              ? "text-[#A96C4B]"
                              : "text-stone-400 group-hover/item:text-[#A96C4B]"
                            }
                          `}
                        />

                        {!collapsed && (
                          <>
                            <span className={`
                              flex-1 text-[12.5px] whitespace-nowrap
                              tracking-[0.01em]
                              ${isActive ? "font-semibold" : "font-medium"}
                            `}>
                              {item.name}
                            </span>

                            {isActive && (
                              <span className="
                                w-1.5 h-1.5 rounded-full bg-[#A96C4B]
                              " />
                            )}
                          </>
                        )}

                        {/* Collapsed Tooltip */}
                        {collapsed && (
                          <span className="
                            absolute left-[calc(100%+14px)]
                            top-1/2 -translate-y-1/2
                            z-[100] px-3 py-2 rounded-lg
                            bg-[#302923] text-white
                            text-[11px] font-medium whitespace-nowrap
                            opacity-0 invisible
                            group-hover/item:opacity-100
                            group-hover/item:visible
                            transition-all duration-150
                            shadow-xl pointer-events-none
                          ">
                            {item.name}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}

        {/* SETTINGS */}
        <div>
          {!collapsed && (
            <div className="px-3 mb-2.5">
              <p className="text-[10px] font-bold
                tracking-[0.14em] text-stone-400">
                PREFERENCES
              </p>
            </div>
          )}

          <NavLink
            to="/settings"
            title={collapsed ? "Settings" : undefined}
            className={({ isActive }) => `
              group/item relative flex items-center
              rounded-xl transition-all duration-200
              ${collapsed
                ? "justify-center h-11"
                : "gap-3 px-3 h-[42px]"
              }
              ${
                isActive
                  ? "bg-[#A96C4B]/[0.12] text-[#985F40]"
                  : "text-stone-500 hover:bg-white/60 hover:text-[#78513A]"
              }
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="
                    absolute left-0 top-2.5 bottom-2.5
                    w-[3px] rounded-r-full bg-[#A96C4B]
                  " />
                )}

                <Settings
                  size={18}
                  strokeWidth={isActive ? 2 : 1.7}
                  className={isActive
                    ? "text-[#A96C4B]"
                    : "text-stone-400 group-hover/item:text-[#A96C4B]"
                  }
                />

                {!collapsed && (
                  <span className="text-[12.5px] font-medium">
                    Settings
                  </span>
                )}

                {collapsed && (
                  <span className="
                    absolute left-[calc(100%+14px)]
                    top-1/2 -translate-y-1/2
                    z-[100] px-3 py-2 rounded-lg
                    bg-[#302923] text-white text-[11px]
                    opacity-0 invisible
                    group-hover/item:opacity-100
                    group-hover/item:visible
                    transition-all duration-150
                    pointer-events-none whitespace-nowrap
                  ">
                    Settings
                  </span>
                )}
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
