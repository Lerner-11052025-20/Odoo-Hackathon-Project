import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Lazy load pages for code splitting
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Stock = lazy(() => import('./pages/Stock'));
const Operations = lazy(() => import('./pages/Operations'));
const Receipts = lazy(() => import('./pages/Receipts'));
const Deliveries = lazy(() => import('./pages/Deliveries'));
const Adjustments = lazy(() => import('./pages/Adjustments'));
const InternalTransfers = lazy(() => import('./pages/InternalTransfers'));
const Warehouse   = lazy(() => import('./pages/Warehouse'));
const Locations   = lazy(() => import('./pages/Locations'));
const Profile     = lazy(() => import('./pages/Profile'));
const MoveHistory = lazy(() => import('./pages/MoveHistory'));

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

              {/* Protected: Stock (Products) Management */}
              <Route
                path="/products"
                element={
                  <ProtectedRoute allowedRoles={['inventory_manager', 'warehouse_staff']}>
                    <Stock />
                  </ProtectedRoute>
                }
              />

              {/* Protected: Operations Hub */}
              <Route
                path="/operations"
                element={
                  <ProtectedRoute allowedRoles={['inventory_manager', 'warehouse_staff']}>
                    <Operations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/operations/receipts"
                element={
                  <ProtectedRoute allowedRoles={['inventory_manager', 'warehouse_staff']}>
                    <Receipts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/operations/deliveries"
                element={
                  <ProtectedRoute allowedRoles={['inventory_manager', 'warehouse_staff']}>
                    <Deliveries />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/operations/adjustments"
                element={
                  <ProtectedRoute allowedRoles={['inventory_manager', 'warehouse_staff']}>
                    <Adjustments />
                  </ProtectedRoute>
                }
              />

              {/* Protected: Internal Transfers */}
              <Route
                path="/transfers"
                element={
                  <ProtectedRoute allowedRoles={['inventory_manager', 'warehouse_staff']}>
                    <InternalTransfers />
                  </ProtectedRoute>
                }
              />

              {/* Protected: Warehouse Management */}
              <Route
                path="/warehouses"
                element={
                  <ProtectedRoute allowedRoles={['inventory_manager', 'warehouse_staff']}>
                    <Warehouse />
                  </ProtectedRoute>
                }
              />

              {/* Protected: Location Management */}
              <Route
                path="/locations"
                element={
                  <ProtectedRoute allowedRoles={['inventory_manager', 'warehouse_staff']}>
                    <Locations />
                  </ProtectedRoute>
                }
              />

              {/* Protected: Profile Management */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['inventory_manager', 'warehouse_staff']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Protected: Move History (Stock Ledger) */}
              <Route
                path="/history"
                element={
                  <ProtectedRoute allowedRoles={['inventory_manager', 'warehouse_staff']}>
                    <MoveHistory />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/auth" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
