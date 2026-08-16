import { useState } from "react";
import { Link } from "react-router-dom";
import { FileQuestion, CheckCircle2, RotateCcw } from "lucide-react";
import { useProgress } from "../context/ProgressContext";

export default function Quizzes() {
  const { enrolledSubjects, isQuizCompleted, completeQuiz } = useProgress();
  const [retakingIds, setRetakingIds] = useState([]); // quiz ids jo retake mode mein hain

  const allQuizzes = enrolledSubjects.flatMap((subject) =>
    subject.quizzes.map((q) => ({ ...q, subject }))
  );

  const handleRetake = (quizId) => {
    setRetakingIds((prev) => [...prev, quizId]);
  };

  const handleStart = (subject, quizId) => {
    completeQuiz(subject.id, quizId);
    // dobara complete hote hi retake mode se hata do
    setRetakingIds((prev) => prev.filter((id) => id !== quizId));
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
        <p className="text-sm text-gray-500">Test what you've learned in each subject.</p>
      </div>

      {enrolledSubjects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <p className="text-sm text-gray-500 mb-3">
            You haven't enrolled in any subject yet, so there are no quizzes to show.
          </p>
          <Link to="/my-courses" className="text-sm text-brand-500 font-medium hover:underline">
            Browse subjects to enroll
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          {allQuizzes.map((q) => {
            const done = isQuizCompleted(q.subject.id, q.id);
            const isRetaking = retakingIds.includes(q.id);
            const showAsPending = !done || isRetaking;

            return (
              <div key={q.id} className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
                  <FileQuestion size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{q.title}</p>
                  <p className="text-xs text-gray-400">
                    {q.subject.title} &middot; {q.questions} Questions
                  </p>
                </div>

                {showAsPending ? (
                  <button
                    onClick={() => handleStart(q.subject, q.id)}
                    className="text-xs font-medium border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 shrink-0"
                  >
                    {done ? "Retake Quiz" : "Start Quiz"}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <CheckCircle2 size={14} />
                      Completed
                    </span>
                    <button
                      onClick={() => handleRetake(q.id)}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-2 py-1 hover:bg-gray-50"
                      title="Retake this quiz"
                    >
                      <RotateCcw size={12} />
                      Retake
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