import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import './index.css'
import { ToastProvider } from './context/toastContext';
import { AuthProvider } from './context/authContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SSEProvider } from './context/streamSSEContext';

const router = createRouter({ routeTree });
const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <SSEProvider>
              <RouterProvider router={router} />
            </SSEProvider>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}