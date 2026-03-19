import React, { useState } from 'react';
import { User, Shield, CreditCard, Database, LogOut, AlertTriangle } from 'lucide-react';
import { UserProfile, supabaseAuthService } from '../../services/supabaseAuth';
import { User as UserType } from '../../types';

interface AccountPageProps {
  user: UserType;
  userProfile?: UserProfile | null;
}

const AccountPage: React.FC<AccountPageProps> = ({ user, userProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    company: userProfile?.company || ''
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      // TODO: Save to Supabase
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setIsEditing(false);
      setStatusMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    setIsResettingPassword(true);
    setStatusMessage(null);
    try {
      await supabaseAuthService.resetPassword(user.email);
      setStatusMessage({ type: 'success', text: 'Password reset email sent. Check your inbox.' });
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to send password reset email.' });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const getTrialDaysRemaining = () => {
    if (!userProfile?.trial_end_date) return 0;
    const now = new Date();
    const trialEnd = new Date(userProfile.trial_end_date);
    const diffTime = trialEnd.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Status Message */}
      {statusMessage && (
        <div
          className={`p-3 text-sm ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-l-2 border-emerald-500'
              : 'bg-danger-50 text-danger-800 border-l-2 border-danger-500'
          }`}
          role="alert"
          aria-live="polite"
        >
          {statusMessage.text}
        </div>
      )}

      {/* Profile Info */}
      <section className="bg-white p-6" aria-labelledby="profile-heading">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-navy-600" aria-hidden="true" />
            <h2 id="profile-heading" className="font-semibold text-navy-950">Profile</h2>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-navy-600 hover:text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500 rounded px-2 py-1"
              aria-label="Edit profile information"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
            <div>
              <label htmlFor="profile-name" className="block text-sm text-secondary mb-1">Name</label>
              <input
                id="profile-name"
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                required
                maxLength={100}
              />
            </div>
            <div>
              <label htmlFor="profile-email" className="block text-sm text-secondary mb-1">Email</label>
              <input
                id="profile-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="profile-company" className="block text-sm text-secondary mb-1">Company</label>
              <input
                id="profile-company"
                type="text"
                value={editForm.company}
                onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                placeholder="Your company name"
                maxLength={100}
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-navy-950 text-white px-4 py-2 text-sm font-medium hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center space-x-2"
                aria-busy={isSaving}
              >
                {isSaving && (
                  <svg className="animate-spin motion-reduce:animate-none w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="text-navy-600 px-4 py-2 text-sm hover:text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500 rounded disabled:opacity-50 min-h-[44px]"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <dl className="space-y-3">
            <div className="flex justify-between text-sm">
              <dt className="text-secondary">Name</dt>
              <dd className="text-navy-950 truncate max-w-[200px] sm:max-w-none" title={user.name}>{user.name}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-secondary">Email</dt>
              <dd className="text-navy-950 truncate max-w-[200px] sm:max-w-none" title={user.email}>{user.email}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-secondary">Company</dt>
              <dd className="text-navy-950 truncate max-w-[200px] sm:max-w-none" title={userProfile?.company || 'Not set'}>{userProfile?.company || '—'}</dd>
            </div>
          </dl>
        )}
      </section>

      {/* Subscription */}
      <section className="bg-white p-6" aria-labelledby="subscription-heading">
        <div className="flex items-center space-x-2 mb-4">
          <CreditCard className="w-5 h-5 text-navy-600" aria-hidden="true" />
          <h2 id="subscription-heading" className="font-semibold text-navy-950">Subscription</h2>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-secondary">Plan</span>
            <span className="font-medium text-navy-950">{user.plan}</span>
          </div>

          {userProfile?.subscription_status === 'trial' && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Trial Status</span>
                <span className="text-navy-700">
                  {getTrialDaysRemaining()} days remaining
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Credits Remaining</span>
                <span className="font-medium text-navy-950 tabular-nums">
                  {userProfile.trial_credits_remaining}
                </span>
              </div>
            </>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-secondary">Analyses This Month</span>
            <span className="tabular-nums">
              {user.analysesThisMonth} / {user.maxAnalyses}
            </span>
          </div>

          <div className="pt-3">
            <button className="bg-navy-950 text-white px-4 py-2 text-sm font-medium hover:bg-navy-800 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 min-h-[44px]">
              Upgrade Plan
            </button>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="bg-white p-6" aria-labelledby="security-heading">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-navy-600" aria-hidden="true" />
          <h2 id="security-heading" className="font-semibold text-navy-950">Security</h2>
        </div>

        <div className="space-y-4">
          <div>
            <button
              onClick={handlePasswordReset}
              disabled={isResettingPassword}
              className="text-sm text-navy-600 hover:text-navy-800 underline focus:outline-none focus:ring-2 focus:ring-navy-500 rounded px-1 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
              aria-busy={isResettingPassword}
            >
              {isResettingPassword && (
                <svg className="animate-spin motion-reduce:animate-none w-3 h-3" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              <span>{isResettingPassword ? 'Sending...' : 'Change Password'}</span>
            </button>
            <p className="text-xs text-secondary mt-1">
              We'll send a password reset link to your email
            </p>
          </div>

          <div className="pt-2 border-t border-surface-100">
            <p className="text-sm text-secondary mb-2">Active Sessions</p>
            <div className="flex items-center justify-between text-sm bg-surface-50 p-3">
              <div>
                <p className="text-navy-950">Current session</p>
                <p className="text-xs text-secondary">Last active: Now</p>
              </div>
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1">Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Data */}
      <section className="bg-white p-6" aria-labelledby="data-heading">
        <div className="flex items-center space-x-2 mb-4">
          <Database className="w-5 h-5 text-navy-600" aria-hidden="true" />
          <h2 id="data-heading" className="font-semibold text-navy-950">Data</h2>
        </div>

        <div className="space-y-4">
          <div>
            <button className="text-sm text-navy-600 hover:text-navy-800 underline focus:outline-none focus:ring-2 focus:ring-navy-500 rounded px-1">
              Export My Data
            </button>
            <p className="text-xs text-secondary mt-1">
              Download all your analyses and account data
            </p>
          </div>

          <div className="pt-3 border-t border-surface-100">
            {showDeleteConfirm ? (
              <div className="bg-danger-50 border border-danger-200 p-4" role="alertdialog" aria-labelledby="delete-title" aria-describedby="delete-desc">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-danger-600 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <p id="delete-title" className="text-sm font-medium text-danger-800 mb-2">
                      Are you sure you want to delete your account?
                    </p>
                    <p id="delete-desc" className="text-xs text-danger-700 mb-3">
                      This action cannot be undone. All your data will be permanently deleted.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button className="bg-danger-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2 min-h-[44px]">
                        Yes, Delete Account
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="text-danger-700 px-3 py-1.5 text-sm hover:text-danger-900 focus:outline-none focus:ring-2 focus:ring-danger-500 rounded min-h-[44px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-sm text-danger-600 hover:text-danger-700 focus:outline-none focus:ring-2 focus:ring-danger-500 rounded px-1"
              >
                Delete Account
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Sign Out */}
      <div className="pt-4">
        <button className="flex items-center space-x-2 text-sm text-secondary hover:text-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-500 rounded px-2 py-1 min-h-[44px]">
          <LogOut className="w-4 h-4" aria-hidden="true" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
