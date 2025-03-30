import { useAuth } from '@/providers/auth-provider';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute() {
  const location = useLocation();
  const { accessToken, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <>
      {accessToken ? (
        <Outlet />
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )}
    </>
  );
}
