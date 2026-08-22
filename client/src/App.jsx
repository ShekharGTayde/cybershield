import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { SyncProvider } from './context/SyncContext';
import { Layout } from './components/layout/Layout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboard } from './pages/UserDashboard';
import { ReportIncidentPage } from './pages/ReportIncidentPage';
import { TrackComplaintPage } from './pages/TrackComplaintPage';
import { ThreatAnalysisPage } from './pages/ThreatAnalysisPage';
import { CyberAwarenessPage } from './pages/CyberAwarenessPage';
import { InvestigatorDashboard } from './pages/InvestigatorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { OfflineSyncPage } from './pages/OfflineSyncPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Protected Route Guard
function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'INVESTIGATOR') {
    const isInvestigator = user?.role === 'INVESTIGATOR' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
    if (!isInvestigator) return <Navigate to="/dashboard" replace />;
  }

  if (requiredRole === 'ADMIN') {
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
    if (!isAdmin) return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <SyncProvider>
            <Routes>
              {/* Public & Landing Layout */}
              <Route element={<Layout withSidebar={false} />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Main Defence Portal with Tactical Sidebar */}
              <Route element={<Layout withSidebar={true} />}>
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/report" element={
                  <ProtectedRoute>
                    <ReportIncidentPage />
                  </ProtectedRoute>
                } />
                <Route path="/track" element={
                  <ProtectedRoute>
                    <TrackComplaintPage />
                  </ProtectedRoute>
                } />
                <Route path="/analyze" element={
                  <ProtectedRoute>
                    <ThreatAnalysisPage />
                  </ProtectedRoute>
                } />
                <Route path="/awareness" element={
                  <ProtectedRoute>
                    <CyberAwarenessPage />
                  </ProtectedRoute>
                } />
                <Route path="/sync" element={
                  <ProtectedRoute>
                    <OfflineSyncPage />
                  </ProtectedRoute>
                } />
                <Route path="/investigator" element={
                  <ProtectedRoute requiredRole="INVESTIGATOR">
                    <InvestigatorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </SyncProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
