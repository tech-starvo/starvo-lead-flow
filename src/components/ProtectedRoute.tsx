import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Renders children only when the user is authenticated.
 * Redirects to home with a return URL so the user can sign in and come back.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isAuthAvailable } = useAuth();
  const location = useLocation();

  if (!isAuthAvailable) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Loading" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
