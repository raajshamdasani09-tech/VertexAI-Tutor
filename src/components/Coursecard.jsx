import { MoreVertical, Database, GitBranch, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

// Maps the subject.icon string (from the catalog) to a visual badge.
function CourseBadge({ icon }) {
  if (icon === "C") return <span className="text-white text-3xl font-bold">C</span>;
  if (icon === "DB")
    return (
      <div className="text-white flex flex-col items-center">
        <Database size={28} />
        <span className="text-xs font-bold mt-0.5">DB</span>
      </div>
    );
  if (icon === "flowchart") return <GitBranch size={30} className="text-white" />;
  if (icon === "code") return <Code2 size={30} className="text-white" />;
  return null;
}

// `progress` and `enrolled` are passed in from ProgressContext by the
// parent page - this component itself has no knowledge of localStorage.
export default function CourseCard({ subject, progress = 0, enrolled = false, onEnroll }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <Link to={`/my-courses/${subject.id}`}>
        <div className={`h-28 flex items-center justify-center bg-gradient-to-br ${subject.color}`}>
          <CourseBadge icon={subject.icon} />
        </div>
      </Link>
      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/my-courses/${subject.id}`}>
          <p className="font-semibold text-gray-900 text-sm mb-2">{subject.title}</p>
        </Link>

        <div className="mt-auto">
          {enrolled ? (
            <>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>{progress}% Complete</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-100 mb-2">
                <div
                  className="h-1.5 rounded-full bg-brand-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <Link
                  to={`/my-courses/${subject.id}`}
                  className="text-xs text-brand-500 font-medium hover:underline"
                >
                  Continue
                </Link>
                <button className="text-gray-300 hover:text-gray-500" aria-label="Course options">
                  <MoreVertical size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-400 mb-2">Not enrolled yet</p>
              <button
                onClick={() => onEnroll?.(subject.id)}
                className="w-full text-xs font-medium bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-lg py-2"
              >
                Enroll Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}