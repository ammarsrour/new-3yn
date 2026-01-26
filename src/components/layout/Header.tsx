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
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16" dir="ltr">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <img 
                src="/3yn eye.png" 
                alt="3YN Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-gray-900 ltr-numbers">{t('header.subtitle')}</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {!user && (
              <>
                <a href="#demo" className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t('header.demo')}
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t('header.pricing')}
                </a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </a>
              </>
            )}
            {user && isAdmin && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onViewChange?.('dashboard')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => onViewChange?.('admin')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'admin'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              </div>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-700">{user.name}</span>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {user.plan}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('header.logout')}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
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