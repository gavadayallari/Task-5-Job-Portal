import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import MyApplications from './pages/MyApplications';
import SavedJobs from './pages/SavedJobs';
import PostJob from './pages/PostJob';
import ManageJobs from './pages/ManageJobs';
import ManageApplicants from './pages/ManageApplicants';
import Notifications from './pages/Notifications';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import NotFound from './pages/NotFound';

// Scroll to top helper on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Route Guard with role normalization
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    // Normalize user role
    const normalizedUserRole =
      user.role === 'candidate'
        ? 'jobseeker'
        : user.role === 'recruiter'
        ? 'employer'
        : user.role;

    const normalizedAllowed = allowedRoles.map((r) =>
      r === 'candidate' ? 'jobseeker' : r === 'recruiter' ? 'employer' : r
    );

    // Admin can access all or role must match
    const hasPermission =
      normalizedUserRole === 'admin' || normalizedAllowed.includes(normalizedUserRole);

    if (!hasPermission) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-blue-600 selection:text-white">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/contact-us" element={<ContactUs />} />

          {/* Job Seeker Protected Routes */}
          <Route
            path="/dashboard/seeker"
            element={
              <ProtectedRoute allowedRoles={['jobseeker']}>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/candidate"
            element={
              <ProtectedRoute allowedRoles={['jobseeker']}>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute allowedRoles={['jobseeker']}>
                <MyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-jobs"
            element={
              <ProtectedRoute allowedRoles={['jobseeker']}>
                <SavedJobs />
              </ProtectedRoute>
            }
          />

          {/* Employer Protected Routes */}
          <Route
            path="/dashboard/employer"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/recruiter"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-job"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/new"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-job/:id"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/manage-jobs"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <ManageJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-jobs"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <ManageJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/applicants"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <ManageApplicants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/applicants/:jobId"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <ManageApplicants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-applicants"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <ManageApplicants />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Authenticated Common Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
