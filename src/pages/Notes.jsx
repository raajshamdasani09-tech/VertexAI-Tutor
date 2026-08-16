import { useState } from "react";
import { Plus, StickyNote } from "lucide-react";
import { useProgress } from "../context/ProgressContext";
import { getAllNotes, addNote } from "../utils/notesStore";

export default function Notes() {
  const { enrolledSubjects } = useProgress();
  const [notes, setNotes] = useState(() => getAllNotes());
  const [selectedSubjectId, setSelectedSubjectId] = useState(enrolledSubjects[0]?.id ?? "");

  function handleAdd() {
    if (!selectedSubjectId) {
      window.alert("Enroll in a subject first (My Courses) before adding a note.");
      return;
    }
    const title = window.prompt("Note title?");
    if (!title) return;
    const subject = enrolledSubjects.find((s) => s.id === selectedSubjectId);
    const updated = addNote({ title, subjectId: subject.id, subjectTitle: subject.title });
    setNotes(updated);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
          <p className="text-sm text-gray-500">Your saved notes, organized by subject.</p>
        </div>

        <div className="flex items-center gap-2">
          {enrolledSubjects.length > 0 && (
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700"
            >
              {enrolledSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg shrink-0"
          >
            <Plus size={16} />
            New Note
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <p className="text-sm text-gray-500">No notes yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {notes.map((n) => (
            <div key={n.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center mb-3">
                <StickyNote size={16} />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">{n.title}</p>
              <p className="text-xs text-gray-400">{n.subjectTitle} &middot; Updated {n.updated}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}