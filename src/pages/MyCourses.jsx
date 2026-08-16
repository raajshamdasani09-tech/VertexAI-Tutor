import { subjectsCatalog } from "../data/subjectsCatalog";
import { useProgress } from "../context/ProgressContext";
import CourseCard from "../components/CourseCard";

export default function MyCourses() {
  const { isEnrolled, getProgress, enroll } = useProgress();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <p className="text-sm text-gray-500">
          Enroll in a subject to unlock its quizzes, assignments and notes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {subjectsCatalog.map((subject) => (
          <CourseCard
            key={subject.id}
            subject={subject}
            enrolled={isEnrolled(subject.id)}
            progress={getProgress(subject.id)}
            onEnroll={enroll}
          />
        ))}
      </div>
    </div>
  );
}