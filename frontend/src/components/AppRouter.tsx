import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useMobileApp } from '../contexts/MobileAppContext';
import MobileAppLayout from './MobileAppLayout';
import MobileAppHome from '../pages/MobileAppHome';
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

const AppRouter: React.FC = () => {
  const { showMobileApp } = useMobileApp();

  // Mobile App Routes
  if (showMobileApp) {
    return (
      <MobileAppLayout>
        <Routes>
          <Route path="/" element={<MobileAppHome />} />
          <Route path="/lost-items" element={<LostItems />} />
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
          <Route path="/admin" element={<AdminLogin onLogin={() => {}} />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/search" element={<QuickSearch />} />
          <Route path="/alerts" element={<InstantAlerts />} />
          <Route path="/report" element={<EasyReport />} />
          <Route path="/secure" element={<SecurePlatform />} />
          <Route path="/support" element={<Support24x7 />} />
          <Route path="/verified" element={<VerifiedUsers />} />
        </Routes>
      </MobileAppLayout>
    );
  }

  // Website Routes (Desktop)
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lost-items" element={<LostItems />} />
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
        <Route path="/admin" element={<AdminLogin onLogin={() => {}} />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/search" element={<QuickSearch />} />
        <Route path="/alerts" element={<InstantAlerts />} />
        <Route path="/report" element={<EasyReport />} />
        <Route path="/secure" element={<SecurePlatform />} />
        <Route path="/support" element={<Support24x7 />} />
        <Route path="/verified" element={<VerifiedUsers />} />
      </Routes>
      <Footer />
    </>
  );
};

export default AppRouter;
