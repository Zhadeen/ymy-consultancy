import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import GuideProfilePage from './pages/GuideProfilePage';
import BookingPage from './pages/BookingPage';
import ChatPage from './pages/ChatPage';
import ChatInbox from './pages/ChatInbox';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VisitorDashboard from './pages/VisitorDashboard';
import AccountSettings from './pages/AccountSettings';
import GuideRegistration from './pages/GuideRegistration';
import GuideDashboard from './pages/GuideDashboard';
import AdminPanel from './pages/AdminPanel';
import HelpCenterPage from './pages/HelpCenterPage';
import SafetyPage from './pages/SafetyPage';
import CancellationPage from './pages/CancellationPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import PricingPage from './pages/PricingPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import VisitorPricingPage from './pages/VisitorPricingPage';
import FloatingContact from './components/common/FloatingContact';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useZendesk } from './hooks/useZendesk';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || (role && user.role !== role)) return <Navigate to="/login" />;
  return children;
}

function DashboardRouter() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
  if (user.role === 'guide') return <GuideDashboard />;
  return <VisitorDashboard />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout({ hideFooter = false }) {
  return (
    <>
      <Navbar />
      <Outlet />
      {!hideFooter && <Footer />}
    </>
  );
}

function ChatLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function App() {
  useZendesk();

  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <ScrollToTop />
          <FloatingContact />
          <Routes>
            {/* Main layout with footer */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/guide/:id" element={<GuideProfilePage />} />
              <Route path="/booking/:id" element={<BookingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardRouter />} />
              <Route path="/guide-dashboard" element={<Navigate to="/dashboard" />} />
              <Route path="/settings" element={<AccountSettings />} />
              <Route path="/guide-register" element={<GuideRegistration />} />
              <Route path="/help" element={<HelpCenterPage />} />
              <Route path="/safety" element={<SafetyPage />} />
              <Route path="/cancellation" element={<CancellationPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/cancel" element={<PaymentCancel />} />
              <Route path="/subscription/success" element={<SubscriptionSuccess />} />
              <Route path="/visitor-pricing" element={<VisitorPricingPage />} />
            </Route>

            {/* Chat - no footer */}
            <Route element={<ChatLayout />}>
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <ChatInbox />
                  </ProtectedRoute>
                } 
              />
              <Route path="/chat/:guideId" element={<ChatPage />} />
            </Route>

            {/* Admin - no footer */}
            <Route element={<ChatLayout />}>
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute role="admin">
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
            </Route>
          </Routes>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
