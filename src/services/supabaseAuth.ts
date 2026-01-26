import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration missing:', {
    url: supabaseUrl ? 'configured' : 'MISSING',
    key: supabaseAnonKey ? 'configured' : 'MISSING'
  });
  throw new Error('Supabase configuration is incomplete. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  created_at: string;
  trial_start_date: string;
  trial_end_date: string;
  trial_credits_remaining: number;
  trial_credits_total: number;
  subscription_status: 'trial' | 'active' | 'expired' | 'cancelled';
  subscription_tier: string | null;
  last_analysis_at: string | null;
  role: 'user' | 'admin';
}

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  companyName?: string;
}

export const supabaseAuthService = {
  signUp: async (data: SignUpData): Promise<{ user: any; profile: UserProfile | null; error: any }> => {
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: data.fullName,
            company_name: data.companyName || null,
          }
        }
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        return { user: null, profile: null, error: signUpError };
      }

      if (!authData.user) {
        return { user: null, profile: null, error: { message: 'Sign up failed. No user returned.' } };
      }

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: data.email,
          full_name: data.fullName,
          company_name: data.companyName || null,
        })
        .select()
        .maybeSingle();

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      return { user: authData.user, profile, error: profileError };
    } catch (error: any) {
      console.error('Sign up exception:', error);
      return {
        user: null,
        profile: null,
        error: {
          message: error.message || 'Network error. Please check your connection and try again.'
        }
      };
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) {
        console.error('Sign in error:', result.error);
      }
      return result;
    } catch (error: any) {
      console.error('Sign in exception:', error);
      return {
        data: { user: null, session: null },
        error: {
          message: error.message || 'Network error. Please check your connection and try again.'
        }
      };
    }
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getSession: async () => {
    return await supabase.auth.getSession();
  },

  getProfile: async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  },

  updateProfile: async (userId: string, updates: Partial<UserProfile>) => {
    return await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId);
  },

  decrementTrialCredit: async (userId: string): Promise<boolean> => {
    const profile = await supabaseAuthService.getProfile(userId);

    if (!profile) return false;

    if (profile.trial_credits_remaining <= 0) {
      return false;
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({
        trial_credits_remaining: profile.trial_credits_remaining - 1,
        last_analysis_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return !error;
  },

  isTrialActive: (profile: UserProfile): boolean => {
    const now = new Date();
    const trialEnd = new Date(profile.trial_end_date);

    return (
      profile.subscription_status === 'trial' &&
      now <= trialEnd &&
      profile.trial_credits_remaining > 0
    );
  },

  isSubscriptionActive: (profile: UserProfile): boolean => {
    return profile.subscription_status === 'active';
  },

  canAnalyze: (profile: UserProfile): { allowed: boolean; reason?: string } => {
    if (supabaseAuthService.isSubscriptionActive(profile)) {
      return { allowed: true };
    }

    if (supabaseAuthService.isTrialActive(profile)) {
      return { allowed: true };
    }

    const now = new Date();
    const trialEnd = new Date(profile.trial_end_date);

    if (now > trialEnd) {
      return { allowed: false, reason: 'Your 7-day trial has expired. Please subscribe to continue.' };
    }

    if (profile.trial_credits_remaining <= 0) {
      return { allowed: false, reason: 'You have used all 3 trial credits. Please subscribe to continue.' };
    }

    return { allowed: false, reason: 'Please subscribe to continue using the analyzer.' };
  },

  onAuthStateChange: (callback: (session: any) => void) => {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  }
};
