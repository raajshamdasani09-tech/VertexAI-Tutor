import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GraduationCap, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// FRONTEND-ONLY LOGIN
// There's no backend here - any name/email/password combo "logs in"
// successfully, as long as the fields aren't empty. This just proves
// out the UI/UX flow. Swap handleSubmit's body for a real API call
// (POST /api/auth/login) when the backend is ready.
export default function Login() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (mode === "signup" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError("Please fill in both email and password.");
      return;
    }

    // TODO backend: replace with real API call, e.g.
    //   const res = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    //   const data = await res.json();
    //   if (!res.ok) { setError(data.message); return; }
    //   login(data.user);
    const displayName = mode === "signup" ? name : email.split("@")[0];
    login({ name: displayName, email });

    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center text-white mb-3">
            <GraduationCap size={26} />
          </div>
          <p className="font-bold text-lg text-gray-900">VertexLearn AI</p>
          <p className="text-xs text-gray-400">Learn Smarter, Grow Faster</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          {/* Tabs */}
          <div className="flex bg-gray-50 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
                mode === "login" ? "bg-white shadow-sm text-gray-900" : "text-gray-400"
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
                mode === "signup" ? "bg-white shadow-sm text-gray-900" : "text-gray-400"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Full Name</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-brand-300">
                  <User size={16} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Raj Shamdasani"
                    className="w-full text-sm outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Email</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-brand-300">
                <Mail size={16} className="text-gray-400 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Password</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-brand-300">
                <Lock size={16} className="text-gray-400 shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm outline-none"
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium py-2.5 rounded-lg mt-1"
            >
              {mode === "login" ? "Log In" : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Demo only — no real account is created, this just simulates login on the frontend.
        </p>
      </div>
    </div>
  );
}