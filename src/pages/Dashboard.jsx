import { Link } from "react-router-dom";
import { Calendar, Sparkles, ArrowRight, Send, BookOpen, ClipboardList } from "lucide-react";
import StatCard from "../components/StatCard";
import CourseCard from "../components/CourseCard";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";
import { recommendations, todaysSchedule } from "../data/mockData";

export default function Dashboard() {
  const { user } = useAuth();
  const { enrolledSubjects, getProgress, isQuizCompleted } = useProgress();

  const coursesEnrolled = enrolledSubjects.length;
  const coursesCompleted = enrolledSubjects.filter((s) => getProgress(s.id) === 100).length;
  const quizzesCompleted = enrolledSubjects.reduce(
    (sum, s) => sum + s.quizzes.filter((q) => isQuizCompleted(s.id, q.id)).length,
    0
  );

  const dashboardStats = [
    { id: "enrolled", label: "Courses Enrolled", value: coursesEnrolled, sublabel: "Active courses", icon: "BookOpen" },
    { id: "completed", label: "Courses Completed", value: coursesCompleted, sublabel: "Keep it up!", icon: "TrendingUp" },
    { id: "quizzes", label: "Quizzes Completed", value: quizzesCompleted, sublabel: "Across all subjects", icon: "Award" },
    {
      id: "avgProgress",
      label: "Average Progress",
      value: coursesEnrolled
        ? `${Math.round(enrolledSubjects.reduce((s, sub) => s + getProgress(sub.id), 0) / coursesEnrolled)}%`
        : "0%",
      sublabel: "Across enrolled subjects",
      icon: "Clock",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName ?? "there"}! 👋
          </h1>
          <p className="text-sm text-gray-500">Keep learning, keep growing.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Calendar size={16} />
          View Calendar
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Courses + AI Tutor row */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        {/* My Courses */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">My Courses</h2>
            <Link to="/my-courses" className="text-sm text-brand-500 font-medium hover:underline">
              View All Courses
            </Link>
          </div>

          {enrolledSubjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 mb-3">You haven't enrolled in any subject yet.</p>
              <Link
                to="/my-courses"
                className="inline-block text-sm bg-brand-500 hover:bg-brand-600 text-white font-medium px-4 py-2 rounded-lg"
              >
                Browse Subjects
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {enrolledSubjects.map((subject) => (
                <CourseCard
                  key={subject.id}
                  subject={subject}
                  enrolled
                  progress={getProgress(subject.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* AI Tutor preview card */}
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl p-4 lg:p-5 text-white flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="font-semibold text-sm">AI Tutor</p>
              <p className="text-xs text-white/70">Your personal AI learning assistant</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2 mb-3">
            <div className="bg-white/15 rounded-xl rounded-tl-sm px-3 py-2 text-sm max-w-[85%]">
              Hi there! How can I help you today? 😊
            </div>
            <div className="bg-white text-gray-800 rounded-xl rounded-tr-sm px-3 py-2 text-sm max-w-[85%] self-end">
              Explain pointers in C with an example.
            </div>
            <div className="bg-white/15 rounded-xl rounded-tl-sm px-3 py-2 text-sm flex items-center gap-1 w-fit">
              Thinking
              <span className="animate-pulse">...</span>
            </div>
          </div>

          <Link
            to="/ai-tutor"
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors rounded-lg px-3 py-2.5 text-sm"
          >
            <span className="flex-1 text-white/70">Ask me anything about your course...</span>
            <Send size={16} />
          </Link>
        </div>
      </div>

      {/* Progress + Recommended + Schedule row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Overview */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Progress Overview</h2>
          </div>

          {enrolledSubjects.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              Enroll in a subject to see your progress here.
            </p>
          ) : (
            <div className="flex items-center gap-4 mb-2">
              <RadialProgress
                percent={Math.round(
                  enrolledSubjects.reduce((s, sub) => s + getProgress(sub.id), 0) / enrolledSubjects.length
                )}
              />
              <div className="flex-1 flex flex-col gap-3">
                {enrolledSubjects.map((subject) => {
                  const percent = getProgress(subject.id);
                  return (
                    <div key={subject.id}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">{subject.title}</span>
                        <span className="text-gray-400">{percent}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-gray-100">
                        <div
                          className="h-1.5 rounded-full bg-brand-500 transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Recommended for you */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recommended for You</h2>
            <Link to="/my-courses" className="text-sm text-brand-500 font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {recommendations.map((rec) => (
              <div key={rec.id} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
                <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
                  {rec.type === "quiz" ? <ClipboardList size={18} /> : <BookOpen size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{rec.title}</p>
                  <p className="text-xs text-gray-400">{rec.meta}</p>
                </div>
                <button className="text-xs font-medium border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 shrink-0">
                  {rec.cta}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Today's Schedule</h2>
            <button className="text-sm text-brand-500 font-medium hover:underline">View All</button>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            {todaysSchedule.map((item) => (
              <div key={item.id} className="flex gap-3">
                <p className="text-xs text-gray-400 w-16 shrink-0 pt-0.5">{item.time}</p>
                <div className="flex flex-col items-center pt-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.meta}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 flex items-center justify-center gap-2 bg-brand-50 text-brand-600 text-sm font-medium py-2.5 rounded-lg hover:bg-brand-100">
            <Calendar size={16} />
            View Full Schedule
          </button>
        </div>
      </div>

      {/* AI-Powered Learning banner */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">AI-Powered Learning</p>
            <p className="text-xs text-gray-500">
              Get personalized recommendations, instant doubt resolution and smart insights.
            </p>
          </div>
        </div>
        <Link
          to="/ai-tutor"
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg"
        >
          Explore AI Features
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

function RadialProgress({ percent }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-[110px] h-[110px] shrink-0">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={radius} fill="none" stroke="#f1f0fb" strokeWidth="10" />
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke="#6d5ff5"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 55 55)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xl font-bold text-gray-900">{percent}%</p>
        <p className="text-[10px] text-gray-400 text-center leading-tight">Overall<br />Progress</p>
      </div>
    </div>
  );
}