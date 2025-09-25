import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import LostItems from '../pages/LostItems';
import FoundItems from '../pages/FoundItems';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AboutUs from '../pages/AboutUs';
import FAQ from '../pages/FAQ';
import Team from '../pages/Team';
import Profile from '../pages/Profile';
import UserProfile from '../pages/UserProfile';
import ContactUs from '../pages/ContactUs';
import Terms from '../pages/Terms';
import Privacy from '../pages/Privacy';
import Cookies from '../pages/Cookies';
import AdminDashboard from '../pages/AdminDashboard';
import AdminLogin from '../pages/AdminLogin';
import QuickSearch from '../pages/QuickSearch';
import InstantAlerts from '../pages/InstantAlerts';
import EasyReport from '../pages/EasyReport';
import SecurePlatform from '../pages/SecurePlatform';
import Support24x7 from '../pages/Support24x7';
import VerifiedUsers from '../pages/VerifiedUsers';
import FastResponse from '../pages/FastResponse';
import CommunitySupport from '../pages/CommunitySupport';
import { useAdmin } from '../contexts/AdminContext';

const AppRouter: React.FC = () => {
  console.log('AppRouter rendering, current path:', window.location.pathname);
  const navigate = useNavigate();
  const { login: adminLogin, isAdmin } = useAdmin();

  const handleAdminLogin = (user: any) => {
    adminLogin(user);
    navigate('/admin-dashboard');
  };

  // Always show website view (desktop layout)
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lost" element={<Navigate to="/lost-items" replace />} />
        <Route path="/lost-items" element={<LostItems />} />
        <Route path="/found" element={<Navigate to="/found-items" replace />} />
        <Route path="/found-items" element={<FoundItems />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/team" element={<Team />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/admin" element={<AdminLogin onLogin={handleAdminLogin} />} />
        <Route path="/admin-dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin" replace />} />
        <Route path="/search" element={<QuickSearch />} />
        <Route path="/alerts" element={<InstantAlerts />} />
        <Route path="/report" element={<EasyReport />} />
        <Route path="/secure" element={<SecurePlatform />} />
        <Route path="/support" element={<Support24x7 />} />
        <Route path="/verified" element={<VerifiedUsers />} />
        <Route path="/support-24x7" element={<Support24x7 />} />
        <Route path="/verified-users" element={<VerifiedUsers />} />
        <Route path="/fast-response" element={<FastResponse />} />
        <Route path="/community" element={<CommunitySupport />} />
      </Routes>
      <Footer />
    </>
  );
};

export default AppRouter;
