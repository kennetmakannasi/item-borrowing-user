import { createFileRoute, Outlet } from '@tanstack/react-router';
import BottomNavigation from '../components/bottomNavigation';
import { ProtectedRoute } from '../middlewares/protected-route';

export const Route = createFileRoute('/_main')({
  component: () => (
    <ProtectedRoute>
      <Outlet />
      <BottomNavigation />
    </ProtectedRoute>

  ),
});