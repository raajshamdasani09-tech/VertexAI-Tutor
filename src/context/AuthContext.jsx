import { createContext, useContext, useState, useEffect } from "react";

// ------------------------------------------------------------------
// FRONTEND-ONLY AUTH (no backend)
// ------------------------------------------------------------------
// There is no server here. "Login" just means: we take whatever the
// user typed, build a small user object, and save it to
// localStorage. On every page load we check localStorage - if a
// user is saved, we treat them as logged in.
//
// Backend dev note: when a real API exists, replace the body of
// login() with an actual fetch/axios call to your auth endpoint,
// store the returned JWT/session token instead of a fake user object,
// and keep the same shape (isAuthenticated, user, login, logout) so
// no other component needs to change.
// ------------------------------------------------------------------

const AuthContext = createContext(null);
const STORAGE_KEY = "vertexlearn_auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, check if a user is already saved in localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  function login({ name, email }) {
    const initials = name
      .trim()
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const newUser = {
      name: name.trim(),
      firstName: name.trim().split(" ")[0],
      email: email.trim(),
      initials: initials || "U",
      role: "Student",
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}