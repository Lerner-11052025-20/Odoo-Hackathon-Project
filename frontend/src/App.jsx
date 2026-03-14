import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Lazy load pages for code splitting
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      <p className="text-slate-500 dark:text-slate-400 text-sm">Loading...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Default: redirect to auth */}
              <Route path="/" element={<Navigate to="/auth" replace />} />

              {/* Auth Page */}
              <Route path="/auth" element={<AuthPage />} />

              {/* Protected: Manager Dashboard */}
              <Route
                path="/dashboard/manager"
                element={
                  <ProtectedRoute allowedRoles={['inventory_manager']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected: Staff Dashboard */}
              <Route
                path="/dashboard/staff"
                element={
                  <ProtectedRoute allowedRoles={['warehouse_staff']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
