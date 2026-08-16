import { useState } from "react";
import { Outlet } from "react-router-dom";
import { X } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// Layout is rendered once by the router (see App.jsx) and wraps every
// page. <Outlet /> is where React Router injects the current page
// component (Dashboard, AITutor, MyCourses, etc.)
export default function Layout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f6f7fb]">
      <Sidebar className="hidden lg:flex" />

      {/* Simple mobile drawer, reuses the same nav items as Sidebar */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar className="!static !h-full" />
            <button
              onClick={() => setMobileNavOpen(false)}
              className="absolute top-4 -right-10 p-2 bg-white rounded-lg"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}