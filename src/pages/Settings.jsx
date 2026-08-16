import { useState } from "react";
import { useAuth } from "../context/AuthContext";

// TODO backend:
// GET  /api/user/profile  -> load current settings on mount
// PUT  /api/user/profile  -> save on handleSave
export default function Settings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    // TODO: await fetch("/api/user/profile", { method: "PUT", body: JSON.stringify({ name, emailNotifs }) })
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
  <div className="flex flex-col gap-6 max-w-xl">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="text-sm text-gray-500">Manage your account preferences.</p>
    </div>

    <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-5">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-300"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
        <input
          type="email"
          value={user?.email ?? ""}
          disabled
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">Email Notifications</p>
          <p className="text-xs text-gray-400">Get updates about your courses and assignments.</p>
        </div>
        <button
          type="button"
          onClick={() => setEmailNotifs((v) => !v)}
          className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
            emailNotifs ? "bg-brand-500" : "bg-gray-200"
          }`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              emailNotifs ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <button
        type="submit"
        className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium py-2.5 rounded-lg"
      >
        {saved ? "Saved!" : "Save Changes"}
      </button>
    </form>
  </div>
  );
}