import { useState } from "react";

// TODO backend:
// GET /api/conversations               -> conversation list (left column)
// GET /api/conversations/:id/messages  -> messages for the selected thread
const conversations = [
  { id: "c-1", name: "Prof. Mehta", lastMessage: "Great work on the assignment!", time: "10:12 AM" },
  { id: "c-2", name: "Study Group - DBMS", lastMessage: "Anyone free to review normalization?", time: "Yesterday" },
  { id: "c-3", name: "Support Team", lastMessage: "Your issue has been resolved.", time: "2 days ago" },
];

export default function Messages() {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const active = conversations.find((c) => c.id === activeId);

  return (
    <div className="flex h-[calc(100vh-110px)] bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Conversation list */}
      <div className="w-72 shrink-0 border-r border-gray-100 overflow-y-auto">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className={`w-full text-left px-4 py-3 border-b border-gray-50 ${
              c.id === activeId ? "bg-brand-50" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-gray-900">{c.name}</p>
              <span className="text-[10px] text-gray-400">{c.time}</span>
            </div>
            <p className="text-xs text-gray-400 truncate">{c.lastMessage}</p>
          </button>
        ))}
      </div>

      {/* Active conversation */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <p className="font-semibold text-gray-900">{active.name}</p>
        <p className="text-sm text-gray-400 mt-1">
          Message thread UI goes here — wire this up to your messages API.
        </p>
      </div>
    </div>
  );
}