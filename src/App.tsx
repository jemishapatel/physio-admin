import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ClinicApprovals from './pages/ClinicApprovals';
import DoctorApprovals from './pages/DoctorApprovals';
import ClinicJoinRequests from './pages/ClinicJoinRequests';
import Profile from './pages/Profile';
import Login from './pages/Login';
import OTPVerification from './pages/OTPVerification';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="clinics" element={<ClinicApprovals />} />
            <Route path="doctors" element={<DoctorApprovals />} />
            <Route path="join-requests" element={<ClinicJoinRequests />} />
            <Route path="join-requests/:userId" element={<ClinicJoinRequests />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
