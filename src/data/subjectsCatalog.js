// ------------------------------------------------------------------
// SUBJECTS CATALOG
// ------------------------------------------------------------------
// This is the list of subjects available on the platform, along with
// each subject's quizzes and assignments. Think of this as what an
// admin/client would configure on the backend.
//
// Backend dev note: replace this static array with a fetch to
// GET /api/subjects (which should return each subject's quizzes and
// assignments too, in the same shape used below) so the rest of the
// app doesn't need to change.
//
// IMPORTANT: this file does NOT contain any progress/completion data.
// Whether a user is enrolled, which quizzes they've completed, and
// which assignments they've submitted all live in
// src/context/ProgressContext.jsx and start empty (0%) for every
// user - see that file for how progress is actually tracked.
// ------------------------------------------------------------------

export const subjectsCatalog = [
  {
    id: "c-prog",
    title: "C Programming",
    icon: "C",
    color: "from-indigo-500 to-purple-600",
    quizzes: [
      { id: "c-q1", title: "Basics of C", questions: 10 },
      { id: "c-q2", title: "Functions & Recursion", questions: 10 },
      { id: "c-q3", title: "Pointers & Arrays", questions: 8 },
    ],
    assignments: [
      { id: "c-a1", title: "Array Manipulation Program", due: "Aug 20, 2026" },
      { id: "c-a2", title: "Recursive Function Set", due: "Aug 27, 2026" },
    ],
  },
  {
    id: "cpp",
    title: "C++",
    icon: "code",
    color: "from-blue-600 to-indigo-700",
    quizzes: [
      { id: "cpp-q1", title: "OOP Basics", questions: 10 },
      { id: "cpp-q2", title: "Classes & Objects", questions: 10 },
    ],
    assignments: [{ id: "cpp-a1", title: "Build a Class Hierarchy", due: "Aug 22, 2026" }],
  },
  {
    id: "java",
    title: "Java",
    icon: "code",
    color: "from-orange-500 to-red-600",
    quizzes: [
      { id: "java-q1", title: "Core Java Basics", questions: 10 },
      { id: "java-q2", title: "Collections Framework", questions: 10 },
    ],
    assignments: [{ id: "java-a1", title: "Inventory System (OOP)", due: "Aug 25, 2026" }],
  },
  {
    id: "dbms",
    title: "Database Management Systems",
    icon: "DB",
    color: "from-emerald-500 to-teal-600",
    quizzes: [
      { id: "dbms-q1", title: "Normalization Basics", questions: 12 },
      { id: "dbms-q2", title: "SQL Joins", questions: 10 },
    ],
    assignments: [{ id: "dbms-a1", title: "ER Diagram Submission", due: "Aug 18, 2026" }],
  },
  {
    id: "data-structures",
    title: "Data Structures",
    icon: "flowchart",
    color: "from-orange-400 to-amber-500",
    quizzes: [
      { id: "ds-q1", title: "Linked Lists", questions: 8 },
      { id: "ds-q2", title: "Sorting Algorithms", questions: 10 },
    ],
    assignments: [{ id: "ds-a1", title: "Sorting Algorithms Report", due: "Aug 24, 2026" }],
  },
  {
    id: "web-dev",
    title: "Web Development (HTML, CSS, JS)",
    icon: "code",
    color: "from-blue-500 to-sky-600",
    quizzes: [
      { id: "web-q1", title: "HTML & CSS Basics", questions: 10 },
      { id: "web-q2", title: "JavaScript Fundamentals", questions: 10 },
    ],
    assignments: [{ id: "web-a1", title: "Build a Landing Page", due: "Aug 30, 2026" }],
  },
  {
    id: "python",
    title: "Python",
    icon: "code",
    color: "from-yellow-500 to-lime-600",
    quizzes: [{ id: "py-q1", title: "Python Basics", questions: 10 }],
    assignments: [{ id: "py-a1", title: "Data Analysis Mini Project", due: "Sep 2, 2026" }],
  },
];

export function getSubjectById(id) {
  return subjectsCatalog.find((s) => s.id === id) || null;
}