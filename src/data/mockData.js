// ------------------------------------------------------------------
// MOCK DATA LAYER
// ------------------------------------------------------------------
// Everything in this file is fake/static data used only so the
// frontend can be built and demoed without a live backend.
//
// Backend dev: replace each exported constant below with a real API
// call (fetch/axios) hitting your endpoints.
//
// NOTE:
// - User identity comes from src/context/AuthContext.jsx (frontend
//   login simulation via localStorage) - not from here.
// - Subjects (courses), quizzes and assignments come from
//   src/data/subjectsCatalog.js (the catalog) combined with
//   src/context/ProgressContext.jsx (the user's real, live progress,
//   which always starts at 0% and only grows as the user completes
//   quizzes/assignments). Nothing about courses/progress lives here
//   anymore - it used to, but it was fake and has been removed.
// ------------------------------------------------------------------

export const recommendations = [
  {
    id: "rec-1",
    title: "Master Arrays in C",
    meta: "Lesson 8 - C Programming",
    cta: "Continue",
    type: "lesson",
  },
  {
    id: "rec-2",
    title: "Practice Quiz: Functions in C",
    meta: "10 Questions",
    cta: "Start Quiz",
    type: "quiz",
  },
];

export const todaysSchedule = [
  { id: "s-1", time: "10:00 AM", title: "DBMS Lecture", meta: "Chapter 4: Normalization", color: "#6d5ff5" },
  { id: "s-2", time: "01:00 PM", title: "C Programming Quiz", meta: "Functions and Recursion", color: "#0fa36b" },
  { id: "s-3", time: "04:00 PM", title: "Data Structures Practice", meta: "Linked Lists", color: "#f5a524" },
];

export const aiTutorSeedMessages = [
  { id: "m-1", sender: "ai", text: "Hi! How can I help you today? 👋", time: "10:28 AM" },
  { id: "m-2", sender: "user", text: "Explain pointers in C with an example.", time: "10:30 AM" },
  {
    id: "m-3",
    sender: "ai",
    text:
      "A pointer is a variable that stores the memory address of another variable.\n\nExample:\n\nint x = 10;\nint *p = &x;\n\nHere, `p` holds the address of `x`. Dereferencing it with `*p` gives you the value stored at that address (10).",
    time: "10:30 AM",
  },
];

export const notifications = [
  { id: "n-1", text: "Your DBMS quiz results are out", time: "2h ago", read: false },
  { id: "n-2", text: "New assignment posted in C Programming", time: "5h ago", read: false },
  { id: "n-3", text: "Reminder: Data Structures practice at 4 PM", time: "1d ago", read: true },
];