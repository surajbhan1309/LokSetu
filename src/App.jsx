import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import KioskLayout from './components/KioskLayout';
import ThemeToggleButton from './components/ThemeToggleButton';

// Kiosk Screens
import WelcomeScreen from './screens/WelcomeScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import AuthScreen from './screens/AuthScreen';
import ServiceSelectionScreen from './screens/ServiceSelectionScreen';
import ServiceTypeScreen from './screens/ServiceTypeScreen';
import ComplaintFormScreen from './screens/ComplaintFormScreen';
import ServiceRequestScreen from './screens/ServiceRequestScreen';
import StatusTrackingScreen from './screens/StatusTrackingScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import PaymentScreen from './screens/PaymentScreen';

// Admin Screens
import AdminLogin from './admin/AdminLogin';
import RequestsList from './admin/RequestsList';
import RequestDetail from './admin/RequestDetail';
import AdminTracker from './admin/AdminTracker';
import AdminDashboard from './admin/AdminDashboard';
import AdminLayout from './admin/AdminLayout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/choose-role" replace />;
};

// Admin Protected Route Component
const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === 'admin' ? (
    children
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <ThemeToggleButton />
            <Routes>
            {/* Kiosk Routes - No Layout */}
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/choose-role" element={<RoleSelectionScreen />} />
            <Route path="/auth" element={<AuthScreen />} />
            
            {/* Kiosk Routes - With Layout */}
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <KioskLayout>
                    <ServiceSelectionScreen />
                  </KioskLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/service-type/:department"
              element={
                <ProtectedRoute>
                  <KioskLayout>
                    <ServiceTypeScreen />
                  </KioskLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/complaint/:department"
              element={
                <ProtectedRoute>
                  <KioskLayout>
                    <ComplaintFormScreen />
                  </KioskLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/service-request/:department"
              element={
                <ProtectedRoute>
                  <KioskLayout>
                    <ServiceRequestScreen />
                  </KioskLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/track-status"
              element={
                <ProtectedRoute>
                  <KioskLayout>
                    <StatusTrackingScreen />
                  </KioskLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/confirmation"
              element={
                <ProtectedRoute>
                  <KioskLayout>
                    <ConfirmationScreen />
                  </KioskLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <KioskLayout>
                    <PaymentScreen />
                  </KioskLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/requests"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <RequestsList />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/requests/:requestId"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <RequestDetail />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/tracker"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <AdminTracker />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
