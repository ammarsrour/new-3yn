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
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    company: userProfile?.company || ''
  });

  const handleSaveProfile = () => {
    // TODO: Save to Supabase
    setIsEditing(false);
  };

  const handlePasswordReset = async () => {
    try {
      await supabaseAuthService.resetPassword(user.email);
      alert('Password reset email sent. Check your inbox.');
    } catch (error) {
      alert('Failed to send password reset email.');
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
      {/* Profile Info */}
      <div className="bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-navy-600" />
            <h2 className="font-semibold text-navy-950">Profile</h2>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-navy-600 hover:text-navy-800"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-secondary mb-1">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-secondary mb-1">Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-secondary mb-1">Company</label>
              <input
                type="text"
                value={editForm.company}
                onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 text-sm"
                placeholder="Your company name"
              />
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleSaveProfile}
                className="bg-navy-950 text-white px-4 py-2 text-sm font-medium hover:bg-navy-800"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-navy-600 px-4 py-2 text-sm hover:text-navy-800"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Name</span>
              <span className="text-navy-950">{user.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Email</span>
              <span className="text-navy-950">{user.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Company</span>
              <span className="text-navy-950">{userProfile?.company || '—'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Subscription */}
      <div className="bg-white p-6">
        <div className="flex items-center space-x-2 mb-4">
          <CreditCard className="w-5 h-5 text-navy-600" />
          <h2 className="font-semibold text-navy-950">Subscription</h2>
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
            <button className="bg-navy-950 text-white px-4 py-2 text-sm font-medium hover:bg-navy-800 transition-colors">
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-navy-600" />
          <h2 className="font-semibold text-navy-950">Security</h2>
        </div>

        <div className="space-y-4">
          <div>
            <button
              onClick={handlePasswordReset}
              className="text-sm text-navy-600 hover:text-navy-800 underline"
            >
              Change Password
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
      </div>

      {/* Data */}
      <div className="bg-white p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Database className="w-5 h-5 text-navy-600" />
          <h2 className="font-semibold text-navy-950">Data</h2>
        </div>

        <div className="space-y-4">
          <div>
            <button className="text-sm text-navy-600 hover:text-navy-800 underline">
              Export My Data
            </button>
            <p className="text-xs text-secondary mt-1">
              Download all your analyses and account data
            </p>
          </div>

          <div className="pt-3 border-t border-surface-100">
            {showDeleteConfirm ? (
              <div className="bg-danger-50 border border-danger-200 p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-danger-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-danger-800 mb-2">
                      Are you sure you want to delete your account?
                    </p>
                    <p className="text-xs text-danger-700 mb-3">
                      This action cannot be undone. All your data will be permanently deleted.
                    </p>
                    <div className="flex space-x-2">
                      <button className="bg-danger-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-danger-700">
                        Yes, Delete Account
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="text-danger-700 px-3 py-1.5 text-sm hover:text-danger-900"
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
                className="text-sm text-danger-600 hover:text-danger-700"
              >
                Delete Account
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div className="pt-4">
        <button className="flex items-center space-x-2 text-sm text-secondary hover:text-navy-700">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
