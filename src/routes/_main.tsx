import { createFileRoute, Outlet } from '@tanstack/react-router';
import BottomNavigation from '../components/bottomNavigation';

export const Route = createFileRoute('/_main')({
  component: () => (
    <>
      <Outlet />
      <BottomNavigation />
    </>
  ),
});