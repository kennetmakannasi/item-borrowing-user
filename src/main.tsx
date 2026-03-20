import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import './index.css'
import { ToastProvider } from './context/toastContext';

const router = createRouter({ routeTree });

// Registrasi router untuk type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </React.StrictMode>
  );
}