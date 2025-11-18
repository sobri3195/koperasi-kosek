import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoginPage from './pages/LoginPage';
import DashboardHome from './pages/DashboardHome';
import CooperativesList from './pages/CooperativesList';
import CooperativeDetail from './pages/CooperativeDetail';
import CooperativeForm from './pages/CooperativeForm';
import AnalysisPage from './pages/AnalysisPage';
import AuditsPage from './pages/AuditsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import MonthlyReportsPage from './pages/MonthlyReportsPage';
import MonthlyReportDetail from './pages/MonthlyReportDetail';
import MonthlyReportForm from './pages/MonthlyReportForm';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cooperatives"
        element={
          <ProtectedRoute>
            <CooperativesList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cooperatives/new"
        element={
          <ProtectedRoute>
            <CooperativeForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cooperatives/:id"
        element={
          <ProtectedRoute>
            <CooperativeDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cooperatives/:id/edit"
        element={
          <ProtectedRoute>
            <CooperativeForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analysis"
        element={
          <ProtectedRoute>
            <AnalysisPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/audits"
        element={
          <ProtectedRoute>
            <AuditsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/monthly-reports"
        element={
          <ProtectedRoute>
            <MonthlyReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/monthly-reports/new"
        element={
          <ProtectedRoute>
            <MonthlyReportForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/monthly-reports/:id"
        element={
          <ProtectedRoute>
            <MonthlyReportDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/monthly-reports/:id/edit"
        element={
          <ProtectedRoute>
            <MonthlyReportForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <AppRoutes />
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
