import { useState } from "react";
import { Search, Bell, Menu, ChevronDown } from "lucide-react";
import { notifications } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

export default function Topbar({ onMenuClick }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center gap-3">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-50 text-gray-500"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Search bar */}
      <div className="flex-1 max-w-xl">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search for courses, lessons, quizzes..."
            className="bg-transparent text-sm outline-none w-full placeholder:text-gray-400"
            // TODO: wire this to a search API / global search context
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setShowNotifs((s) => !s)}
          className="relative p-2 rounded-lg hover:bg-gray-50 text-gray-500"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifs && (
          <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-xl shadow-lg p-2 z-30">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`px-3 py-2 rounded-lg text-sm ${!n.read ? "bg-brand-50/60" : ""}`}
              >
                <p className="text-gray-800">{n.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User avatar */}
      <div className="flex items-center gap-2 pl-2 cursor-pointer">
        <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold text-sm">
          {user?.initials ?? "U"}
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </div>
    </header>
  );
}