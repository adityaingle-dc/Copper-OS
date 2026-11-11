import { Outlet } from "react-router-dom"

import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#F7F6F3] flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main application */}
      <div className="flex-1 min-w-0 flex flex-col">

        <Topbar />

        <main className="flex-1 p-8">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default MainLayout