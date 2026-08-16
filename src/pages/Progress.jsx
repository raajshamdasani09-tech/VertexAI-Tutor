import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import StatCard from "../components/StatCard";

export default function Progress() {
  const { enrolledSubjects, getProgress, isQuizCompleted } = useProgress();

  const coursesEnrolled = enrolledSubjects.length;
  const coursesCompleted = enrolledSubjects.filter((s) => getProgress(s.id) === 100).length;
  const quizzesCompleted = enrolledSubjects.reduce(
    (sum, s) => sum + s.quizzes.filter((q) => isQuizCompleted(s.id, q.id)).length,
    0
  );
  const avgProgress = coursesEnrolled
    ? Math.round(enrolledSubjects.reduce((sum, s) => sum + getProgress(s.id), 0) / coursesEnrolled)
    : 0;

  const stats = [
    { id: "enrolled", label: "Courses Enrolled", value: coursesEnrolled, sublabel: "Active courses", icon: "BookOpen" },
    { id: "completed", label: "Courses Completed", value: coursesCompleted, sublabel: "Keep it up!", icon: "TrendingUp" },
    { id: "quizzes", label: "Quizzes Completed", value: quizzesCompleted, sublabel: "Across all subjects", icon: "Award" },
    { id: "avg", label: "Average Progress", value: `${avgProgress}%`, sublabel: "Across enrolled subjects", icon: "Clock" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
        <p className="text-sm text-gray-500">See how far you've come across all subjects.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Subject Breakdown</h2>

        {enrolledSubjects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500 mb-3">
              You're not enrolled in any subject yet, so there's no progress to show.
            </p>
            <Link to="/my-courses" className="text-sm text-brand-500 font-medium hover:underline">
              Browse subjects to enroll
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {enrolledSubjects.map((subject) => {
              const percent = getProgress(subject.id);
              return (
                <div key={subject.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <Link to={`/my-courses/${subject.id}`} className="text-gray-700 hover:text-brand-600">
                      {subject.title}
                    </Link>
                    <span className="text-gray-400">{percent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-brand-500 transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}