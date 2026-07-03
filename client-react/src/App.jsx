import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from '@/components/ErrorBoundary';

// --- Public Layout ---
import Navbar from '@/components/Navbar.jsx';
import Footer from '@/components/Footer.jsx';
import MobileBottomNav from '@/components/MobileBottomNav.jsx';
import GoogleSignInPrompt from '@/components/GoogleSignInPrompt.jsx';

// --- Public Pages (Eager) ---
import Home from '@/pages/Home.jsx';
import Browse from '@/pages/Browse.jsx';
import Category from '@/pages/Category.jsx';
import Listing from '@/pages/Listing.jsx';
import Login from '@/pages/Login.jsx';
import Register from '@/pages/Register.jsx';
import Profile from './pages/Profile';
import SavedAds from './pages/SavedAds';
import Messages from './pages/Messages';

// --- Lazy Loaded Pages ---
const ResetPassword = lazy(() => import('@/pages/ResetPassword.jsx'));
const PostAd = lazy(() => import('@/pages/PostAd.jsx'));
const EditAd = lazy(() => import('@/pages/EditAd.jsx'));
const MyAds = lazy(() => import('@/pages/MyAds.jsx'));
const ProfilePage = lazy(() => import('@/pages/Profile.jsx'));
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
const AdminCVs = lazy(() => import('@/pages/admin/AdminCVs.jsx'));
const AdminPayments = lazy(() => import('@/pages/admin/AdminPayments.jsx'));
const AdminReports = lazy(() => import('@/pages/admin/AdminReports.jsx'));
const AdminCMS = lazy(() => import('@/pages/admin/AdminCMS.jsx'));
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics.jsx'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings.jsx'));

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
      <Navbar />
      <main id="main-content">
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/category/:slug" element={<Category />} />
            {['vehicles','property','land-plots','phones-tablets','electronics',
              'home-furniture','fashion','beauty','services','repair-construction',
              'commercial-equipment','commercial-vehicles','leisure','babies-kids',
              'food-agriculture','animals-pets','auto-spares','jobs','seeking-work'
            ].map(cat => (
              <Route key={cat} path={`/${cat}`} element={<Browse key={cat} defaultCategory={cat} />} />
            ))}
            <Route path="/listing/:id" element={<Listing />} />
            <Route path="/post-cv" element={<ProtectedRoute><PostCvPage /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/post-ad" element={<ProtectedRoute><PostAd /></ProtectedRoute>} />
            <Route path="/edit-ad/:id" element={<ProtectedRoute><EditAd /></ProtectedRoute>} />
            <Route path="/my-ads" element={<ProtectedRoute><MyAds /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/saved-searches" element={<ProtectedRoute><SavedSearches /></ProtectedRoute>} />
            
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:conversationId" element={<Messages />} />
            
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/saved" element={<SavedAds />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
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
              <Route path="cvs" element={<AdminCVs />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="cms" element={<AdminCMS />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
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
