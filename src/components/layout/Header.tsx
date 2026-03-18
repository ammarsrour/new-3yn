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
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20" dir="ltr">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3 group">
              <img
                src="/3yn eye.png"
                alt="3YN Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold text-navy-950 tabular-nums tracking-tight">{t('header.subtitle')}</span>
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
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
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onViewChange?.('dashboard')}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'text-navy-950 bg-slate-100'
                      : 'text-navy-500 hover:text-navy-950'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => onViewChange?.('admin')}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
                    currentView === 'admin'
                      ? 'text-navy-950 bg-slate-100'
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
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-navy-950 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-navy-950">{user.name}</p>
                    <p className="text-xs text-emerald-600 font-medium">{user.plan}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 text-navy-500 hover:text-navy-950 transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('header.logout')}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="bg-navy-950 text-white px-6 py-2.5 text-sm font-semibold hover:bg-navy-800 transition-colors"
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
