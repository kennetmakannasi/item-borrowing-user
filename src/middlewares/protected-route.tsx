import { useAuth } from '../context/authContext';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const publicRoutes = ['/auth/login', '/auth/register', '/auth/verify-email'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  console.log(isPublicRoute)

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: '/auth/login', replace: true });
      return;
    }

    if (user?.role !== 'user') {
      logout();
      navigate({ to: '/auth/login', replace: true });
      return;
    }

    if (user && isPublicRoute) {
      navigate({ to: '/', replace: true });
      return;
    }

  }, [user, isLoading, navigate]);

  console.log(location.pathname)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Memvalidasi Sesi...</p>
      </div>
    );
  }

  return user ? <>{children}</> : null;
}