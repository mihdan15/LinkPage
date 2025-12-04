// App Component with React Router

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, ToastProvider } from './contexts';
import { LinkPage } from './pages/LinkPage';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import './App.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Your slug - set in .env file as VITE_MY_SLUG
export const MY_SLUG = import.meta.env.VITE_MY_SLUG || 'mihdan';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Home - Your public link page */}
              <Route path="/" element={<LinkPage slug={MY_SLUG} />} />
              
              {/* Login page */}
              <Route path="/login" element={<Login />} />
              
              {/* Dashboard - protected, redirects to /login if not logged in */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Public link page with slug */}
              <Route path="/:slug" element={<LinkPage />} />
              
              {/* 404 page */}
              <Route path="/404" element={<NotFound />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
