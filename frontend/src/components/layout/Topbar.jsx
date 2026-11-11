import { useState } from "react"
import {
  Search,
  Bell,
  ChevronDown,
  Settings,
  User,
  LogOut,
  Command,
} from "lucide-react"

function Topbar() {
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <header className="
      h-[76px] w-full shrink-0
      px-5 md:px-8
      flex items-center justify-between gap-4
      bg-transparent
      font-sans
    ">

      {/* Left Spacer */}
      <div className="hidden lg:block flex-1" />

      {/* STICKY SEARCH BAR */}
      <div className="sticky top-0 z-30 w-full max-w-[440px]">
        <div className="
          flex items-center gap-3
          w-full
          h-[44px] px-5
          rounded-full
          bg-white/45
          backdrop-blur-xl
          border border-white/80
          shadow-[0_3px_15px_rgba(60,45,30,0.035)]
          transition-all duration-200
          focus-within:bg-white/75
          focus-within:border-[#C69A7E]/60
          focus-within:shadow-[0_0_0_3px_rgba(169,108,75,0.07)]
        ">
          <Search
            size={17}
            strokeWidth={1.8}
            className="text-stone-400 shrink-0"
          />

          <input
            type="text"
            placeholder="Search anything..."
            className="
              bg-transparent outline-none
              text-[13px] w-full
              text-stone-700
              placeholder:text-stone-400
            "
          />

          
        </div>
      </div>

      {/* RIGHT ACTIONS - NOT STICKY */}
      <div className="
        flex-1 flex items-center justify-end
        gap-3 sm:gap-5
      ">

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="
            relative w-10 h-10 shrink-0
            flex items-center justify-center
            rounded-xl text-stone-500
            hover:bg-white/60
            hover:text-[#A96C4B]
            transition-all duration-200
          "
        >
          <Bell size={19} strokeWidth={1.7} />

          <span className="
            absolute top-[9px] right-[10px]
            w-[7px] h-[7px]
            rounded-full bg-[#B66B4B]
            ring-2 ring-[#F5F4F1]
          " />
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-stone-300/50" />

        {/* Profile */}
        <div className="relative shrink-0">

          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
            className="
              flex items-center gap-2.5
              p-1.5 pr-2 rounded-xl
              hover:bg-white/55
              transition-all duration-200
            "
          >
            {/* Avatar */}
            <div className="
              w-9 h-9 rounded-xl shrink-0
              flex items-center justify-center
              bg-gradient-to-br from-[#F4EAE3] to-[#EAD5C5]
              text-[#945D40]
              text-sm font-semibold
              border border-[#E6D4C6]/80
              shadow-sm
            ">
              A
            </div>

            {/* User Details */}
            <div className="hidden sm:block text-left">
              <p className="
                text-[12px] font-semibold
                text-stone-800 leading-tight
              ">
                Admin User
              </p>

              <p className="
                text-[10px] text-stone-400
                mt-1 leading-tight
              ">
                Administrator
              </p>
            </div>

            <ChevronDown
              size={15}
              className={`
                hidden sm:block text-stone-400
                transition-transform duration-200
                ${profileOpen ? "rotate-180" : ""}
              `}
            />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="
              absolute right-0 top-[calc(100%+12px)]
              w-52 p-1.5 z-50
              bg-white/85 backdrop-blur-2xl
              border border-white/90
              rounded-xl
              shadow-[0_12px_35px_rgba(50,35,25,0.12)]
              animate-in fade-in slide-in-from-top-2 duration-150
            ">

              <div className="px-3 py-2.5 border-b border-stone-100">
                <p className="text-xs font-semibold text-stone-800">
                  Admin User
                </p>
                <p className="text-[10px] text-stone-400 mt-1">
                  Administrator
                </p>
              </div>

              <button className="
                w-full flex items-center gap-2.5
                px-3 py-2.5 mt-1 rounded-lg
                text-xs text-stone-600
                hover:bg-stone-50 hover:text-[#A96C4B]
                transition-colors
              ">
                <User size={15} />
                My Profile
              </button>

              <button className="
                w-full flex items-center gap-2.5
                px-3 py-2.5 rounded-lg
                text-xs text-stone-600
                hover:bg-stone-50 hover:text-[#A96C4B]
                transition-colors
              ">
                <Settings size={15} />
                Account Settings
              </button>

              <div className="h-px bg-stone-100 my-1" />

              <button className="
                w-full flex items-center gap-2.5
                px-3 py-2.5 rounded-lg
                text-xs text-red-500
                hover:bg-red-50
                transition-colors
              ">
                <LogOut size={15} />
                Sign Out
              </button>

            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar