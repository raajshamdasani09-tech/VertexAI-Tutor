import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ClipboardList, FileQuestion, StickyNote, Plus, CheckCircle2, ArrowLeft } from "lucide-react";
import { getSubjectById } from "../data/subjectsCatalog";
import { useProgress } from "../context/ProgressContext";
import { getNotesForSubject, addNote } from "../utils/notesStore";

// Route: /my-courses/:subjectId
// Whatever subject the client selects, this page pulls that subject's
// own quizzes, assignments and notes - nothing here is shared across
// subjects. Progress is real: starts at 0%, updates live as the user
// completes a quiz or submits an assignment (via ProgressContext).
export default function SubjectDetail() {
  const { subjectId } = useParams();
  const subject = getSubjectById(subjectId);
  const {
    isEnrolled,
    enroll,
    getProgress,
    isQuizCompleted,
    completeQuiz,
    isAssignmentSubmitted,
    submitAssignment,
  } = useProgress();

  const [notes, setNotes] = useState(() => getNotesForSubject(subjectId));

  if (!subject) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>Subject not found.</p>
        <Link to="/my-courses" className="text-brand-500 text-sm hover:underline">
          Back to My Courses
        </Link>
      </div>
    );
  }

  const enrolled = isEnrolled(subject.id);
  const progress = getProgress(subject.id);

  function handleAddNote() {
    const title = window.prompt(`Note title for ${subject.title}?`);
    if (!title) return;
    const updated = addNote({ title, subjectId: subject.id, subjectTitle: subject.title });
    setNotes(updated.filter((n) => n.subjectId === subject.id));
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/my-courses" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 w-fit">
        <ArrowLeft size={16} />
        Back to My Courses
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{subject.title}</h1>
          {enrolled ? (
            <p className="text-sm text-gray-500 mt-1">{progress}% complete</p>
          ) : (
            <p className="text-sm text-gray-500 mt-1">Not enrolled yet</p>
          )}
        </div>
        {enrolled ? (
          <div className="w-full sm:w-48">
            <div className="w-full h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-brand-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={() => enroll(subject.id)}
            className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg shrink-0"
          >
            Enroll Now
          </button>
        )}
      </div>

      {!enrolled && (
        <p className="text-sm text-gray-400 text-center py-4">
          Enroll in this subject to start quizzes and assignments.
        </p>
      )}

      {enrolled && (
        <>
          {/* Quizzes */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileQuestion size={18} className="text-brand-500" />
              <h2 className="font-semibold text-gray-900">Quizzes</h2>
            </div>
            <div className="flex flex-col divide-y divide-gray-50">
              {subject.quizzes.map((q) => {
                const done = isQuizCompleted(subject.id, q.id);
                return (
                  <div key={q.id} className="flex items-center gap-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{q.title}</p>
                      <p className="text-xs text-gray-400">{q.questions} Questions</p>
                    </div>
                    {done ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <CheckCircle2 size={14} />
                        Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => completeQuiz(subject.id, q.id)}
                        className="text-xs font-medium border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 shrink-0"
                      >
                        Start Quiz
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assignments */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList size={18} className="text-brand-500" />
              <h2 className="font-semibold text-gray-900">Assignments</h2>
            </div>
            <div className="flex flex-col divide-y divide-gray-50">
              {subject.assignments.map((a) => {
                const submitted = isAssignmentSubmitted(subject.id, a.id);
                return (
                  <div key={a.id} className="flex items-center gap-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{a.title}</p>
                      <p className="text-xs text-gray-400">Due {a.due}</p>
                    </div>
                    {submitted ? (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                        Submitted
                      </span>
                    ) : (
                      <button
                        onClick={() => submitAssignment(subject.id, a.id)}
                        className="text-xs font-medium bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg px-3 py-1.5 shrink-0"
                      >
                        Pending &middot; Submit
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes for this subject */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <StickyNote size={18} className="text-brand-500" />
                <h2 className="font-semibold text-gray-900">Notes</h2>
              </div>
              <button
                onClick={handleAddNote}
                className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:underline"
              >
                <Plus size={14} />
                Add Note
              </button>
            </div>
            {notes.length === 0 ? (
              <p className="text-sm text-gray-400">No notes yet for {subject.title}.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {notes.map((n) => (
                  <div key={n.id} className="border border-gray-100 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Updated {n.updated}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}