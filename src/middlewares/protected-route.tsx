import { useAuth } from '../context/authContext';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, logout ,isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: '/auth/login', replace: true });
    }

    if(user?.role !== 'user' ){
        logout();
        navigate({ to: '/auth/login', replace: true });
    }

  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Memvalidasi Sesi...</p>
      </div>
    );
  }

  return user ? <>{children}</> : null;
}