import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { User } from '../../types';

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  isAdmin?: boolean;
  currentView?: 'dashboard' | 'admin';
  onViewChange?: (view: 'dashboard' | 'admin') => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogin, onLogout, isAdmin, currentView, onViewChange }) => {
  const { t } = useTranslation();

  return (
    <header className="bg-white border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16" dir="ltr">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2.5 group">
              <img
                src="/3yn eye.png"
                alt="3YN Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-lg font-bold text-navy-950 tracking-tight">{t('header.subtitle')}</span>
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!user && (
              <>
                <a href="#features" className="text-navy-600 hover:text-navy-950 transition-colors text-sm font-medium">
                  Features
                </a>
                <a href="#pricing" className="text-navy-600 hover:text-navy-950 transition-colors text-sm font-medium">
                  {t('header.pricing')}
                </a>
                <a href="#contact" className="text-navy-600 hover:text-navy-950 transition-colors text-sm font-medium">
                  Contact
                </a>
              </>
            )}
            {user && isAdmin && (
              <div className="flex items-center">
                <button
                  onClick={() => onViewChange?.('dashboard')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'text-navy-950 bg-surface-100'
                      : 'text-navy-500 hover:text-navy-950'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => onViewChange?.('admin')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
                    currentView === 'admin'
                      ? 'text-navy-950 bg-surface-100'
                      : 'text-navy-500 hover:text-navy-950'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              </div>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 bg-navy-950 flex items-center justify-center">
                    <UserIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-navy-950 leading-tight">{user.name}</p>
                    <p className="text-xs text-success-600 font-medium">{user.plan}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1.5 text-navy-500 hover:text-navy-950 transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('header.logout')}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="bg-navy-950 text-white px-5 py-2 text-sm font-semibold hover:bg-navy-800 transition-colors"
              >
                {t('header.login')}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
