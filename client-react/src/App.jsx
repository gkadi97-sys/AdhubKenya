import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import { logPageView } from '@/lib/api';

// --- Tracking Component ---
function PageViewTracker() {
  const location = useLocation();
  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);
  return null;
}

// --- Public Layout ---
import GlobalSEO from '@/components/SEO.jsx';
import Navbar from '@/components/Navbar.jsx';
import Footer from '@/components/Footer.jsx';
import MobileBottomNav from '@/components/MobileBottomNav.jsx';
import GoogleSignInPrompt from '@/components/GoogleSignInPrompt.jsx';
import AIChatbot from '@/components/AIChatbot.jsx';

// --- Public Pages (Eager) ---
import Home from '@/pages/Home.jsx';
import Browse from '@/pages/Browse.jsx';
import Listing from '@/pages/Listing.jsx';
import CategoryRouter from '@/components/CategoryRouter.jsx';
import Login from '@/pages/Login.jsx';
import Register from '@/pages/Register.jsx';
import SavedAds from './pages/SavedAds';
import Messages from './pages/Messages';

// --- Lazy Loaded Pages ---
const ResetPassword = lazy(() => import('@/pages/ResetPassword.jsx'));
const PostAd = lazy(() => import('@/pages/PostAd.jsx'));
const PostAdConfirmation = lazy(() => import('@/pages/PostAdConfirmation.jsx'));
const EditAd = lazy(() => import('@/pages/EditAd.jsx'));
const MyAds = lazy(() => import('@/pages/MyAds.jsx'));
const ProfilePage = lazy(() => import('@/pages/Profile.jsx'));
const PublicProfilePage = lazy(() => import('@/pages/PublicProfile.jsx'));
const SavedSearches = lazy(() => import('@/pages/SavedSearches.jsx'));
const PostCvPage = lazy(() => import('@/pages/PostCv.jsx'));

// --- Legal Pages (Lazy) ---
const TermsPage = lazy(() => import('@/pages/legal/Terms.jsx'));
const PrivacyPage = lazy(() => import('@/pages/legal/Privacy.jsx'));
const SafetyPage = lazy(() => import('@/pages/legal/Safety.jsx'));
const ContactPage = lazy(() => import('@/pages/legal/Contact.jsx'));
const HelpPage = lazy(() => import('@/pages/legal/Help.jsx'));
const AboutPage = lazy(() => import('@/pages/legal/About.jsx'));
const CareersPage = lazy(() => import('@/pages/legal/Careers.jsx'));
const ReportPage = lazy(() => import('@/pages/legal/Report.jsx'));
const CookiesPage = lazy(() => import('@/pages/legal/Cookies.jsx'));

// --- Admin Layout & Pages (Lazy) ---
const AdminLayout = lazy(() => import('@/layouts/AdminLayout.jsx'));
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin.jsx'));
const AdminResetPassword = lazy(() => import('@/pages/admin/AdminResetPassword.jsx'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard.jsx'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers.jsx'));
const AdminAds = lazy(() => import('@/pages/admin/AdminAds.jsx'));
const AdminModeration = lazy(() => import('@/pages/admin/AdminModeration.jsx'));
const AdminCVs = lazy(() => import('@/pages/admin/AdminCVs.jsx'));
const AdminPayments = lazy(() => import('@/pages/admin/AdminPayments.jsx'));
const AdminReports = lazy(() => import('@/pages/admin/AdminReports.jsx'));
const AdminCMS = lazy(() => import('@/pages/admin/AdminCMS.jsx'));
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics.jsx'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings.jsx'));
const AdminMetadata = lazy(() => import('@/pages/admin/AdminMetadata.jsx'));
const AdminMetadataBuilder = lazy(() => import('@/pages/admin/AdminMetadataBuilder.jsx'));
const AdminVehicles = lazy(() => import('@/pages/admin/AdminVehicles.jsx'));

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
  const adminRoles = ['super_admin', 'admin', 'moderator', 'support', 'finance', 'content_reviewer', 'analytics_viewer'];
  if (!adminRoles.includes(user.role)) return <Navigate to="/admin/login" replace />;
  return children;
}

// --- Public App Shell ---
function AppLayout() {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-background focus:text-foreground">
        Skip to main content
      </a>
      <PageViewTracker />
      <Navbar />
      <main id="main-content">
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/listing/:id" element={<Listing />} />

            {/* Protected user routes */}
            <Route path="/post-cv" element={<ProtectedRoute><PostCvPage /></ProtectedRoute>} />
            <Route path="/post-ad" element={<ProtectedRoute><PostAd /></ProtectedRoute>} />
            <Route path="/post-ad/success" element={<ProtectedRoute><PostAdConfirmation /></ProtectedRoute>} />
            <Route path="/edit-ad/:id" element={<ProtectedRoute><EditAd /></ProtectedRoute>} />
            <Route path="/my-ads" element={<ProtectedRoute><MyAds /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/saved-searches" element={<ProtectedRoute><SavedSearches /></ProtectedRoute>} />

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Messaging */}
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:conversationId" element={<Messages />} />

            {/* User profiles */}
            <Route path="/user/:id" element={<PublicProfilePage />} />

            {/* Saved */}
            <Route path="/saved" element={<SavedAds />} />

            {/* Legal / Info pages */}
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/cookies" element={<CookiesPage />} />

            {/* Catch-all: dynamic category paths (must be last) */}
            <Route path="/*" element={<CategoryRouter />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <MobileBottomNav />
      <GoogleSignInPrompt />
      <AIChatbot />
    </>
  );
}

// --- Root App ---
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <GlobalSEO />
          <Toaster position="top-center" />
          <Routes>
            {/* ── Admin Routes ── */}
            <Route path="/admin/login" element={
              <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>}>
                <AdminLogin />
              </Suspense>
            } />
            <Route path="/admin/reset-password" element={
              <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>}>
                <AdminResetPassword />
              </Suspense>
            } />
            <Route path="/admin/*" element={
              <AdminProtectedRoute>
                <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>}>
                  <AdminLayout />
                </Suspense>
              </AdminProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="ads" element={<AdminAds />} />
              <Route path="moderation" element={<AdminModeration />} />
              <Route path="cvs" element={<AdminCVs />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="cms" element={<AdminCMS />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="metadata" element={<AdminMetadata />} />
              <Route path="metadata/builder/:id" element={<AdminMetadataBuilder />} />
              <Route path="vehicles" element={<AdminVehicles />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>

            {/* ── Public App Shell ── */}
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
