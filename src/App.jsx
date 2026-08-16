import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AITutor from "./pages/AITutor";
import MyCourses from "./pages/MyCourses";
import SubjectDetail from "./pages/SubjectDetail";
import Quizzes from "./pages/Quizzes";
import Assignments from "./pages/Assignments";
import Progress from "./pages/Progress";
import Notes from "./pages/Notes";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/my-courses/:subjectId" element={<SubjectDetail />} />
        <Route path="/ai-tutor" element={<AITutor />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}