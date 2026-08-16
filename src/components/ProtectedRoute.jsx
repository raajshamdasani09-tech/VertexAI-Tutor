import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap any <Route element={...}> with this to require login.
// If not authenticated, user is bounced to /login.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Avoid a flash-redirect while we check localStorage on first load
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}