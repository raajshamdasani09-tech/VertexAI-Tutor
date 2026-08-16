import { useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, RotateCcw } from "lucide-react";
import { useProgress } from "../context/ProgressContext";

export default function Assignments() {
  const { enrolledSubjects, isAssignmentSubmitted, submitAssignment } = useProgress();
  const [resubmittingIds, setResubmittingIds] = useState([]);

  const allAssignments = enrolledSubjects.flatMap((subject) =>
    subject.assignments.map((a) => ({ ...a, subject }))
  );

  const handleResubmitClick = (assignmentId) => {
    setResubmittingIds((prev) => [...prev, assignmentId]);
  };

  const handleSubmit = (subject, assignmentId) => {
    submitAssignment(subject.id, assignmentId);
    setResubmittingIds((prev) => prev.filter((id) => id !== assignmentId));
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        <p className="text-sm text-gray-500">Track and submit your coursework.</p>
      </div>

      {enrolledSubjects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <p className="text-sm text-gray-500 mb-3">
            You haven't enrolled in any subject yet, so there are no assignments to show.
          </p>
          <Link to="/my-courses" className="text-sm text-brand-500 font-medium hover:underline">
            Browse subjects to enroll
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          {allAssignments.map((a) => {
            const submitted = isAssignmentSubmitted(a.subject.id, a.id);
            const isResubmitting = resubmittingIds.includes(a.id);
            const showAsPending = !submitted || isResubmitting;

            return (
              <div key={a.id} className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
                  <ClipboardList size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-400">
                    {a.subject.title} &middot; Due {a.due}
                  </p>
                </div>

                {showAsPending ? (
                  <button
                    onClick={() => handleSubmit(a.subject, a.id)}
                    className="text-xs font-medium bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg px-3 py-1.5 shrink-0"
                  >
                    {submitted ? "Resubmit" : "Pending · Submit"}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                      Submitted
                    </span>
                    <button
                      onClick={() => handleResubmitClick(a.id)}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-2 py-1 hover:bg-gray-50"
                      title="Resubmit this assignment"
                    >
                      <RotateCcw size={12} />
                      Redo
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}