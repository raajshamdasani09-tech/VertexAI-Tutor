import { NavLink, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Bot,
  FileQuestion,
  ClipboardList,
  BarChart2,
  StickyNote,
  MessageSquare,
  Settings as SettingsIcon,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Each entry maps a sidebar item -> a route.
// Add/remove items here and the corresponding <Route> in App.jsx.
const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/my-courses", label: "My Courses", icon: BookOpen },
  { to: "/ai-tutor", label: "AI Tutor", icon: Bot },
  { to: "/quizzes", label: "Quizzes", icon: FileQuestion },
  { to: "/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/progress", label: "Progress", icon: BarChart2 },
  { to: "/notes", label: "Notes", icon: StickyNote },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar({ className = "" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className={`flex flex-col w-[260px] shrink-0 h-screen sticky top-0 bg-white border-r border-gray-100 px-4 py-5 ${className}`}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white">
          <GraduationCap size={20} />
        </div>
        <div>
          <p className="font-bold text-[15px] leading-tight text-gray-900">VertexLearn AI</p>
          <p className="text-[11px] text-gray-400 leading-tight">Learn Smarter, Grow Faster</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Upgrade to Pro card */}
      <div className="rounded-xl bg-brand-50 p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-brand-500" />
          <p className="text-sm font-semibold text-gray-900">Upgrade to Pro</p>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Unlock AI insights, advanced analytics and more.
        </p>
        <button className="w-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium py-2 rounded-lg transition-colors">
          Upgrade Now
        </button>
      </div>

      {/* User footer */}
      <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50">
        <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold text-sm shrink-0">
          {user?.initials ?? "U"}
        </div>
        <div className="leading-tight flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{user?.name ?? "Guest"}</p>
          <p className="text-xs text-gray-400 truncate">{user?.email ?? user?.role ?? ""}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg shrink-0"
          aria-label="Log out"
          title="Log out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}