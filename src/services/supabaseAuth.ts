import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log configuration status (without exposing sensitive values)
console.log('[Supabase] Configuration check:', {
  url: supabaseUrl ? `configured (${supabaseUrl.substring(0, 30)}...)` : 'MISSING',
  key: supabaseAnonKey ? `configured (${supabaseAnonKey.substring(0, 20)}...)` : 'MISSING',
  env: import.meta.env.MODE
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Configuration missing:', {
    url: supabaseUrl ? 'configured' : 'MISSING',
    key: supabaseAnonKey ? 'configured' : 'MISSING',
    availableEnvVars: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_'))
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

// Test Supabase connectivity on initialization
(async () => {
  try {
    console.log('[Supabase] Testing connectivity...');
    const startTime = performance.now();
    const { error } = await supabase.from('user_profiles').select('count', { count: 'exact', head: true });
    const latency = Math.round(performance.now() - startTime);

    if (error) {
      console.warn('[Supabase] Connectivity test warning:', {
        message: error.message,
        code: error.code,
        hint: error.hint,
        latency: `${latency}ms`
      });
    } else {
      console.log('[Supabase] Connectivity test passed:', {
        status: 'connected',
        latency: `${latency}ms`
      });
    }
  } catch (e: any) {
    console.error('[Supabase] Connectivity test failed:', {
      message: e.message,
      isNetworkError: e.message?.includes('Failed to fetch'),
      hint: 'Check if Supabase URL is correct and project is active'
    });
  }
})();

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
    console.log('[Supabase] signUp called for:', data.email);

    try {
      console.log('[Supabase] Calling auth.signUp...');
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
        console.error('[Supabase] Sign up error:', {
          message: signUpError.message,
          status: signUpError.status,
          name: signUpError.name,
          stack: signUpError.stack
        });
        return { user: null, profile: null, error: signUpError };
      }

      console.log('[Supabase] Auth signup successful, user:', authData.user?.id);

      if (!authData.user) {
        console.error('[Supabase] No user returned from signup');
        return { user: null, profile: null, error: { message: 'Sign up failed. No user returned.' } };
      }

      // Small delay to let the DB trigger complete
      await new Promise(resolve => setTimeout(resolve, 500));

      // Fetch profile created by DB trigger
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        // Profile fetch failed but user was created - don't treat as fatal
        return { user: authData.user, profile: null, error: null };
      }

      return { user: authData.user, profile, error: null };
    } catch (error: any) {
      // Detailed error logging for network/fetch errors
      const errorDetails = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        cause: error.cause,
        // Check for specific fetch error patterns
        isNetworkError: error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError'),
        isCorsError: error.message?.includes('CORS') || error.message?.includes('cross-origin'),
        supabaseUrl: supabaseUrl?.substring(0, 40) + '...'
      };

      console.error('[Supabase] Sign up exception:', errorDetails);

      // Provide user-friendly error messages based on error type
      let userMessage = 'An unexpected error occurred. Please try again.';

      if (errorDetails.isNetworkError) {
        userMessage = 'Network error: Unable to connect to the server. Please check your internet connection and try again.';
      } else if (errorDetails.isCorsError) {
        userMessage = 'Connection error: Please try again or contact support if the issue persists.';
      } else if (error.message) {
        userMessage = error.message;
      }

      return {
        user: null,
        profile: null,
        error: {
          message: userMessage,
          originalError: error.message,
          errorType: errorDetails.isNetworkError ? 'network' : errorDetails.isCorsError ? 'cors' : 'unknown'
        }
      };
    }
  },

  signIn: async (email: string, password: string) => {
    console.log('[Supabase] signIn called for:', email);

    try {
      console.log('[Supabase] Calling auth.signInWithPassword...');
      const result = await supabase.auth.signInWithPassword({ email, password });

      if (result.error) {
        console.error('[Supabase] Sign in error:', {
          message: result.error.message,
          status: result.error.status,
          name: result.error.name
        });
      } else {
        console.log('[Supabase] Sign in successful, user:', result.data.user?.id);
      }

      return result;
    } catch (error: any) {
      const errorDetails = {
        message: error.message,
        name: error.name,
        isNetworkError: error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError'),
        isCorsError: error.message?.includes('CORS')
      };

      console.error('[Supabase] Sign in exception:', errorDetails);

      let userMessage = 'An unexpected error occurred. Please try again.';
      if (errorDetails.isNetworkError) {
        userMessage = 'Network error: Unable to connect to the server. Please check your internet connection.';
      } else if (error.message) {
        userMessage = error.message;
      }

      return {
        data: { user: null, session: null },
        error: {
          message: userMessage,
          originalError: error.message
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
    // First, get current credits to calculate new value
    const { data: currentProfile } = await supabase
      .from('user_profiles')
      .select('trial_credits_remaining')
      .eq('id', userId)
      .single();

    if (!currentProfile || currentProfile.trial_credits_remaining <= 0) {
      return false;
    }

    // Atomic update: only decrement if credits still > 0
    // The .gt() condition prevents race conditions by only updating
    // rows where trial_credits_remaining > 0 at update time
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        trial_credits_remaining: currentProfile.trial_credits_remaining - 1,
        last_analysis_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .gt('trial_credits_remaining', 0)
      .select('trial_credits_remaining');

    // If no rows were updated (data is empty), the condition failed
    if (error || !data || data.length === 0) {
      return false;
    }

    return true;
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
