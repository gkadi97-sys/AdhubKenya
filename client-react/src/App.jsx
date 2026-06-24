import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from '@/components/ErrorBoundary';

// --- Public Layout ---
import Navbar from '@/components/Navbar.jsx';
import Footer from '@/components/Footer.jsx';
import MobileBottomNav from '@/components/MobileBottomNav.jsx';
import GoogleSignInPrompt from '@/components/GoogleSignInPrompt.jsx';

// --- Public Pages ---
import Home from '@/pages/Home.jsx';
import Browse from '@/pages/Browse.jsx';
import Category from '@/pages/Category.jsx';
import Listing from '@/pages/Listing.jsx';
import Login from '@/pages/Login.jsx';
import Register from '@/pages/Register.jsx';
import PostAd from '@/pages/PostAd.jsx';
import MyAds from '@/pages/MyAds.jsx';
import SavedSearches from '@/pages/SavedSearches.jsx';

// --- Admin Layout & Pages ---
import AdminLayout from '@/layouts/AdminLayout.jsx';
import AdminLogin from '@/pages/admin/AdminLogin.jsx';
import AdminDashboard from '@/pages/admin/AdminDashboard.jsx';
import AdminUsers from '@/pages/admin/AdminUsers.jsx';
import AdminAds from '@/pages/admin/AdminAds.jsx';
import AdminPayments from '@/pages/admin/AdminPayments.jsx';
import AdminReports from '@/pages/admin/AdminReports.jsx';
import AdminCMS from '@/pages/admin/AdminCMS.jsx';
import AdminAnalytics from '@/pages/admin/AdminAnalytics.jsx';
import AdminSettings from '@/pages/admin/AdminSettings.jsx';

// --- Guards ---
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>Loading...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  // Role check: must have a recognised admin role stored in the profile
  const adminRoles = ['super_admin', 'admin', 'moderator', 'support', 'finance', 'content_reviewer', 'analytics_viewer'];
  if (!adminRoles.includes(user.role)) return <Navigate to="/admin/login" replace />;
  return children;
}

// --- Public App Shell ---
function AppLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/listing/:id" element={<Listing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post-ad" element={<ProtectedRoute><PostAd /></ProtectedRoute>} />
          <Route path="/my-ads" element={<ProtectedRoute><MyAds /></ProtectedRoute>} />
          <Route path="/saved-searches" element={<ProtectedRoute><SavedSearches /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <MobileBottomNav />
      <GoogleSignInPrompt />
    </>
  );
}

// --- Root App ---
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-center" />
          <Routes>
            {/* ── Admin: completely isolated from public layout ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="ads" element={<AdminAds />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="cms" element={<AdminCMS />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* ── Public: existing site, no changes ── */}
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </ErrorBoundary>
  );
}
