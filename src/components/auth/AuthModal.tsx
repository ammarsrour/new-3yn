import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Mail, Lock, User, Building } from 'lucide-react';

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string, name: string, company?: string) => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  mode,
  onClose,
  onLogin,
  onSignup,
  onSwitchMode
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await onLogin(email, password);
      } else {
        await onSignup(email, password, name, company);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0f2942]/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-md w-full relative">
        {/* Header bar */}
        <div className="bg-[#0f2942] px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              {mode === 'login' ? t('auth.login.title') : t('auth.signup.title')}
            </h2>
            <p className="text-navy-400 text-sm mt-1">
              {mode === 'login' ? t('auth.login.subtitle') : t('auth.signup.subtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-navy-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {mode === 'signup' && (
            <div className="mb-6 bg-success-50 border-l-4 border-success-500 p-4">
              <p className="text-sm text-success-700 font-medium">7-day free trial with 3 analyses included</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-danger-50 border-l-4 border-danger-500 p-4">
                <p className="text-sm text-danger-700">{error}</p>
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#0f2942] mb-2">
                    {t('auth.fields.name')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400 w-5 h-5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border-2 border-surface-200 focus:border-[#0f2942] focus:outline-none transition-colors"
                      placeholder={t('auth.fields.namePlaceholder')}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f2942] mb-2">
                    Company Name <span className="text-navy-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400 w-5 h-5" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border-2 border-surface-200 focus:border-[#0f2942] focus:outline-none transition-colors"
                      placeholder="Your company name"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-[#0f2942] mb-2">
                {t('auth.fields.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-surface-200 focus:border-[#0f2942] focus:outline-none transition-colors"
                  placeholder={t('auth.fields.emailPlaceholder')}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f2942] mb-2">
                {t('auth.fields.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-surface-200 focus:border-[#0f2942] focus:outline-none transition-colors"
                  placeholder={t('auth.fields.passwordPlaceholder')}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0f2942] text-white py-4 font-semibold hover:bg-[#1a3d5c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('auth.messages.loading') : (mode === 'login' ? t('auth.buttons.signIn') : t('auth.buttons.signUp'))}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-surface-200">
            <p className="text-navy-600 text-sm">
              {mode === 'login' ? t('auth.messages.noAccount') : t('auth.messages.hasAccount')}{' '}
              <button
                onClick={() => onSwitchMode(mode === 'login' ? 'signup' : 'login')}
                className="text-success-600 hover:text-success-700 font-semibold transition-colors"
              >
                {mode === 'login' ? t('auth.buttons.switchToSignup') : t('auth.buttons.switchToLogin')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;