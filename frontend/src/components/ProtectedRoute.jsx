import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingScreen from "./LoadingScreen";
import AuthSyncError from "./AuthSyncError";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isClerkSignedIn, authError, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isClerkSignedIn && authError) {
    return <AuthSyncError />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
