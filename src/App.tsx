import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardLayout } from './components/DashboardLayout';
import { Overview } from './pages/dashboard/Overview';
import { DLLGenerator } from './pages/dashboard/DLLGenerator';
import { EADownloads } from './pages/dashboard/EADownloads';
import { SignalMonitor } from './pages/dashboard/SignalMonitor';
import { ProfileSettings } from './pages/dashboard/ProfileSettings';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Overview />} />
                <Route path="generate" element={<DLLGenerator />} />
                <Route path="downloads" element={<EADownloads />} />
                <Route path="logs" element={<SignalMonitor />} />
                <Route path="settings" element={<ProfileSettings />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;