import { createRootRoute, Outlet } from '@tanstack/react-router';
import { App as KonstaApp } from 'konsta/react';

export const Route = createRootRoute({
  component: () => (
    <KonstaApp safeAreas theme="material"> 
      <Outlet />
    </KonstaApp>
  ),
});