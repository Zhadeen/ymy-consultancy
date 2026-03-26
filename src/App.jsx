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
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TouristDashboard from './pages/TouristDashboard';
import GuideRegistration from './pages/GuideRegistration';
import GuideDashboard from './pages/GuideDashboard';
import AdminPanel from './pages/AdminPanel';
import HelpCenterPage from './pages/HelpCenterPage';
import SafetyPage from './pages/SafetyPage';
import CancellationPage from './pages/CancellationPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

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
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <ScrollToTop />
          <Routes>
            {/* Main layout with footer */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/guide/:id" element={<GuideProfilePage />} />
              <Route path="/booking/:id" element={<BookingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<TouristDashboard />} />
              <Route path="/guide-register" element={<GuideRegistration />} />
              <Route path="/guide-dashboard" element={<GuideDashboard />} />
              <Route path="/help" element={<HelpCenterPage />} />
              <Route path="/safety" element={<SafetyPage />} />
              <Route path="/cancellation" element={<CancellationPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
            </Route>

            {/* Chat - no footer */}
            <Route element={<ChatLayout />}>
              <Route path="/chat" element={<ChatPage />} />
            </Route>

            {/* Admin - no footer */}
            <Route element={<ChatLayout />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Routes>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
