import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from './store/userStore';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPages';

function App() {
  const location = useLocation();
  const { user, isSignedIn } = useUser();
  const setClerkUser = useUserStore(state => state.setClerkUser);
  
  // Sync Clerk user with our store
  useEffect(() => {
    setClerkUser(user);
  }, [user, setClerkUser]);
  
  // Check if user is an admin
  const isAdmin = user?.publicMetadata?.role === 'admin';
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          {/* Auth Routes */}
          <Route path="/sign-in" element={<AuthPage type="sign-in" />} />
          <Route path="/sign-up" element={<AuthPage type="sign-up" />} />
          
          {/* Main Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/event/:id/leaderboard" element={<LeaderboardPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/profile" 
              element={isSignedIn ? <ProfilePage /> : <Navigate to="/sign-in" />} 
            />
            <Route 
              path="/profile/:username" 
              element={<ProfilePage />} 
            />
            <Route 
              path="/admin" 
              element={isSignedIn && isAdmin ? <AdminPage /> : <Navigate to="/" />} 
            />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;