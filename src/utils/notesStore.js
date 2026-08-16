// ------------------------------------------------------------------
// FRONTEND-ONLY NOTES STORAGE (no backend)
// ------------------------------------------------------------------
// Notes are saved to localStorage so they survive refreshes and can
// be read from both the Notes page and each subject's detail page.
//
// Backend dev note: replace these three functions with real calls to
// GET /api/notes and POST /api/notes. Keep the same return shape
// (array of { id, title, subjectId, subjectTitle, updated }).
// ------------------------------------------------------------------

const KEY = "vertexlearn_notes";

export function getAllNotes() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function addNote({ title, subjectId, subjectTitle }) {
  const notes = getAllNotes();
  const newNote = {
    id: crypto.randomUUID(),
    title,
    subjectId: subjectId || null,
    subjectTitle: subjectTitle || "General",
    updated: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }),
  };
  const next = [newNote, ...notes];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function getNotesForSubject(subjectId) {
  return getAllNotes().filter((n) => n.subjectId === subjectId);
}