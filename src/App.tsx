import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/layout/Header';
import LandingPage from './components/pages/LandingPage';
import Dashboard from './components/pages/Dashboard';
import AuthModal from './components/auth/AuthModal';
import { User } from './types';
import { supabaseAuthService, UserProfile } from './services/supabaseAuth';
import { activityLogger } from './services/activityLogger';
import AdminDashboard from './components/pages/AdminDashboard';

function App() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'admin'>('dashboard');

  useEffect(() => {
    console.log('App initializing - checking Supabase connection...');
    supabaseAuthService.getSession().then(({ data: { session } }) => {
      console.log('Session check completed:', session ? 'User logged in' : 'No session');
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    }).catch((error) => {
      console.error('Failed to get session:', error);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabaseAuthService.onAuthStateChange((session) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    const profile = await supabaseAuthService.getProfile(userId);
    if (profile) {
      setUserProfile(profile);
      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.full_name || profile.email.split('@')[0],
        plan: profile.subscription_status === 'active' ? 'Professional' : 'Starter',
        analysesThisMonth: profile.trial_credits_total - profile.trial_credits_remaining,
        maxAnalyses: profile.subscription_status === 'active' ? 999 : profile.trial_credits_total,
        totalAnalyses: profile.trial_credits_total - profile.trial_credits_remaining
      });
    }
    setIsLoading(false);
  };

  const handleLogin = async (email: string, password: string) => {
    console.log('Attempting login for:', email);
    try {
      const { data, error } = await supabaseAuthService.signIn(email, password);

      if (error) {
        console.error('Login error:', error);
        throw new Error(error.message || 'Login failed. Please check your credentials.');
      }

      if (data.user) {
        console.log('Login successful for user:', data.user.id);
        await loadUserProfile(data.user.id);
        await activityLogger.logLogin(data.user.id, email);
        setShowAuthModal(false);
        showToast(t('auth.messages.loginSuccess'), 'success');
      }
    } catch (error: any) {
      console.error('Login exception:', error);
      throw new Error(error.message || 'Network error. Please check your connection and try again.');
    }
  };

  const handleSignup = async (email: string, password: string, name: string, company?: string) => {
    console.log('[App] Attempting signup for:', email);
    try {
      const { user, profile, error } = await supabaseAuthService.signUp({
        email,
        password,
        fullName: name,
        companyName: company
      });

      if (error) {
        console.error('[App] Signup error received:', {
          message: error.message,
          originalError: error.originalError,
          errorType: error.errorType,
          fullError: error
        });

        // Show specific error message based on error type
        let displayMessage = error.message;
        if (error.errorType === 'network') {
          displayMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        } else if (error.originalError) {
          displayMessage = `${error.message} (${error.originalError})`;
        }

        throw new Error(displayMessage || 'Sign up failed. Please try again.');
      }

      if (!user) {
        console.error('[App] No user returned from signup');
        throw new Error('Sign up failed. Please try again.');
      }

      console.log('[App] Signup successful for user:', user.id);
      await loadUserProfile(user.id);
      await activityLogger.logSignup(user.id, email, name, company);
      setShowAuthModal(false);
      showToast(t('auth.messages.accountCreated'), 'success');
    } catch (error: any) {
      console.error('[App] Signup exception:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      throw new Error(error.message || 'Network error. Please check your connection and try again.');
    }
  };

  const handleLogout = async () => {
    if (user?.id) {
      await activityLogger.logLogout(user.id);
    }
    await supabaseAuthService.signOut();
    setUser(null);
    setUserProfile(null);
    showToast('Successfully logged out', 'info');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500'
    };

    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    if (user) return;
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isAdmin = userProfile?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        onLogin={() => openAuthModal('login')}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {user ? (
        currentView === 'admin' && isAdmin ? (
          <AdminDashboard userId={user.id} />
        ) : (
          <Dashboard user={user} userProfile={userProfile} />
        )
      ) : (
        <LandingPage onGetStarted={() => openAuthModal('signup')} />
      )}

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}
    </div>
  );
}

export default App;
