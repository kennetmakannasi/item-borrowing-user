import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
  beforeLoad: ({ location }) => {
    if (location.pathname === '/auth' || location.pathname === '/auth/') {
      throw redirect({
        to: '/auth/login', 
      });
    }
  }
});

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}