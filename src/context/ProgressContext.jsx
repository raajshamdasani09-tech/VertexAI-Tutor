import { createContext, useContext, useState, useEffect } from "react";
import { subjectsCatalog } from "../data/subjectsCatalog";

// ------------------------------------------------------------------
// FRONTEND-ONLY PROGRESS TRACKING (no backend)
// ------------------------------------------------------------------
// Everything here lives in localStorage. There is no server and no
// database - when the user completes a quiz or submits an
// assignment, we flip a flag in local state and recompute the
// percentage from real data. Every subject starts at 0% the moment
// it's enrolled, and only moves up when the user actually completes
// something in the UI. Nothing here is pre-filled or faked.
//
// Retake / Resubmit support: completedQuizzes / submittedAssignments
// store attempt counts (not just a boolean), so "completed" status is
// derived from count > 0. resetQuiz / resetAssignment put an item back
// into "pending" state (without losing the attempt history) so the
// user can redo it; completeQuiz / submitAssignment called again will
// bump the attempt count back up.
//
// Backend dev note: swap the localStorage read/write below for real
// GET/POST calls to your progress API (e.g. POST /api/progress/enroll,
// POST /api/progress/quiz/:id/complete, POST /api/progress/quiz/:id/reset,
// POST /api/progress/assignment/:id/submit, POST /api/progress/assignment/:id/reset).
// Keep the same exposed shape (enrolledSubjects, getProgress, enroll,
// completeQuiz, submitAssignment, resetQuiz, resetAssignment,
// isQuizCompleted, isAssignmentSubmitted, isEnrolled) so no page needs
// to change.
// ------------------------------------------------------------------

const ProgressContext = createContext(null);
const STORAGE_KEY = "vertexlearn_progress";

function emptyState() {
  // { [subjectId]: { enrolled: bool, quizStatus: { [quizId]: { done, attempts } }, assignmentStatus: { [assignmentId]: { done, attempts } } } }
  return {};
}

function emptySubjectState() {
  return { enrolled: false, quizStatus: {}, assignmentStatus: {} };
}

// Migrates old-shape saved state (completedQuizzes/submittedAssignments
// arrays) into the new quizStatus/assignmentStatus shape, so anyone with
// existing localStorage data doesn't lose progress on this update.
function migrateSubjectState(raw) {
  if (!raw) return emptySubjectState();
  if (raw.quizStatus || raw.assignmentStatus) {
    return {
      enrolled: !!raw.enrolled,
      quizStatus: raw.quizStatus || {},
      assignmentStatus: raw.assignmentStatus || {},
    };
  }
  const quizStatus = {};
  (raw.completedQuizzes || []).forEach((id) => {
    quizStatus[id] = { done: true, attempts: 1 };
  });
  const assignmentStatus = {};
  (raw.submittedAssignments || []).forEach((id) => {
    assignmentStatus[id] = { done: true, attempts: 1 };
  });
  return { enrolled: !!raw.enrolled, quizStatus, assignmentStatus };
}

export function ProgressProvider({ children }) {
  const [state, setState] = useState(emptyState());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const migrated = {};
        Object.keys(parsed).forEach((subjectId) => {
          migrated[subjectId] = migrateSubjectState(parsed[subjectId]);
        });
        setState(migrated);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, loaded]);

  function getSubjectState(subjectId) {
    return state[subjectId] || emptySubjectState();
  }

  function enroll(subjectId) {
    setState((prev) => {
      const current = prev[subjectId] || emptySubjectState();
      if (current.enrolled) return prev;
      return { ...prev, [subjectId]: { ...current, enrolled: true } };
    });
  }

  function completeQuiz(subjectId, quizId) {
    setState((prev) => {
      const current = prev[subjectId] || { ...emptySubjectState(), enrolled: true };
      const prevStatus = current.quizStatus[quizId] || { done: false, attempts: 0 };
      return {
        ...prev,
        [subjectId]: {
          ...current,
          enrolled: true,
          quizStatus: {
            ...current.quizStatus,
            [quizId]: { done: true, attempts: prevStatus.attempts + 1 },
          },
        },
      };
    });
  }

  function resetQuiz(subjectId, quizId) {
    setState((prev) => {
      const current = prev[subjectId];
      if (!current || !current.quizStatus[quizId]) return prev;
      return {
        ...prev,
        [subjectId]: {
          ...current,
          quizStatus: {
            ...current.quizStatus,
            [quizId]: { ...current.quizStatus[quizId], done: false },
          },
        },
      };
    });
  }

  function submitAssignment(subjectId, assignmentId) {
    setState((prev) => {
      const current = prev[subjectId] || { ...emptySubjectState(), enrolled: true };
      const prevStatus = current.assignmentStatus[assignmentId] || { done: false, attempts: 0 };
      return {
        ...prev,
        [subjectId]: {
          ...current,
          enrolled: true,
          assignmentStatus: {
            ...current.assignmentStatus,
            [assignmentId]: { done: true, attempts: prevStatus.attempts + 1 },
          },
        },
      };
    });
  }

  function resetAssignment(subjectId, assignmentId) {
    setState((prev) => {
      const current = prev[subjectId];
      if (!current || !current.assignmentStatus[assignmentId]) return prev;
      return {
        ...prev,
        [subjectId]: {
          ...current,
          assignmentStatus: {
            ...current.assignmentStatus,
            [assignmentId]: { ...current.assignmentStatus[assignmentId], done: false },
          },
        },
      };
    });
  }

  function isQuizCompleted(subjectId, quizId) {
    return !!getSubjectState(subjectId).quizStatus[quizId]?.done;
  }

  function getQuizAttempts(subjectId, quizId) {
    return getSubjectState(subjectId).quizStatus[quizId]?.attempts || 0;
  }

  function isAssignmentSubmitted(subjectId, assignmentId) {
    return !!getSubjectState(subjectId).assignmentStatus[assignmentId]?.done;
  }

  function getAssignmentAttempts(subjectId, assignmentId) {
    return getSubjectState(subjectId).assignmentStatus[assignmentId]?.attempts || 0;
  }

  function isEnrolled(subjectId) {
    return getSubjectState(subjectId).enrolled;
  }

  // Progress % = (quizzes completed + assignments submitted) / total activities for that subject.
  // Only counts items currently marked done - if something is put back into
  // "pending" via retake, it temporarily doesn't count until redone, same as
  // a real backend would report it.
  function getProgress(subjectId) {
    const subject = subjectsCatalog.find((s) => s.id === subjectId);
    if (!subject) return 0;
    const total = subject.quizzes.length + subject.assignments.length;
    if (total === 0) return 0;
    const current = getSubjectState(subjectId);
    const doneQuizzes = Object.values(current.quizStatus).filter((q) => q.done).length;
    const doneAssignments = Object.values(current.assignmentStatus).filter((a) => a.done).length;
    return Math.round(((doneQuizzes + doneAssignments) / total) * 100);
  }

  const enrolledSubjects = subjectsCatalog.filter((s) => isEnrolled(s.id));

  const value = {
    enrolledSubjects,
    enroll,
    completeQuiz,
    submitAssignment,
    resetQuiz,
    resetAssignment,
    isQuizCompleted,
    isAssignmentSubmitted,
    getQuizAttempts,
    getAssignmentAttempts,
    isEnrolled,
    getProgress,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside <ProgressProvider>");
  return ctx;
}