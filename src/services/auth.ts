export interface AuthUser {
  id: string;
  email: string;
  name: string;
  plan: 'Starter' | 'Professional' | 'Enterprise';
  analysesThisMonth: number;
  maxAnalyses: number;
  totalAnalyses: number;
}

export interface AuthToken {
  token: string;
  user: AuthUser;
  expiresAt: number;
}

const AUTH_STORAGE_KEY = 'billboard_auth_token';
const TOKEN_EXPIRY_HOURS = 24 * 7; // 7 days

// Simulate JWT token generation (in production, this would come from your backend)
const generateToken = (user: AuthUser): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (TOKEN_EXPIRY_HOURS * 3600)
  }));
  const signature = btoa(`signature_${user.id}_${Date.now()}`);
  
  return `${header}.${payload}.${signature}`;
};

// Validate and decode token (in production, this would verify with your backend)
const validateToken = (token: string): AuthUser | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.exp < now) {
      // Token expired
      return null;
    }
    
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      plan: payload.plan,
      analysesThisMonth: 12, // In production, fetch from backend
      maxAnalyses: payload.plan === 'Starter' ? 10 : payload.plan === 'Professional' ? 50 : 999,
      totalAnalyses: 47
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
};

export const authService = {
  // Store authentication token securely
  storeAuth: (user: AuthUser): void => {
    try {
      const token = generateToken(user);
      const authData: AuthToken = {
        token,
        user,
        expiresAt: Date.now() + (TOKEN_EXPIRY_HOURS * 3600 * 1000)
      };
      
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    } catch (error) {
      console.error('Failed to store authentication:', error);
    }
  },

  // Retrieve and validate stored authentication
  getStoredAuth: (): AuthUser | null => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!stored) return null;
      
      const authData: AuthToken = JSON.parse(stored);
      
      // Check if token is expired
      if (Date.now() > authData.expiresAt) {
        authService.clearAuth();
        return null;
      }
      
      // Validate token
      const user = validateToken(authData.token);
      if (!user) {
        authService.clearAuth();
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('Failed to retrieve stored authentication:', error);
      authService.clearAuth();
      return null;
    }
  },

  // Clear authentication data
  clearAuth: (): void => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear authentication:', error);
    }
  },

  // Simulate login API call
  login: async (email: string, password: string): Promise<AuthUser> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, this would make an actual API call
    // For demo purposes, we'll simulate successful login
    if (email && password.length >= 6) {
      const user: AuthUser = {
        id: btoa(email).slice(0, 8),
        email,
        name: email.split('@')[0],
        plan: 'Professional',
        analysesThisMonth: 12,
        maxAnalyses: 50,
        totalAnalyses: 47
      };
      
      authService.storeAuth(user);
      return user;
    } else {
      throw new Error('Invalid credentials');
    }
  },

  // Simulate signup API call
  signup: async (email: string, password: string, name: string): Promise<AuthUser> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, this would make an actual API call
    if (email && password.length >= 6 && name.trim()) {
      const user: AuthUser = {
        id: btoa(email).slice(0, 8),
        email,
        name: name.trim(),
        plan: 'Starter',
        analysesThisMonth: 0,
        maxAnalyses: 10,
        totalAnalyses: 0
      };
      
      authService.storeAuth(user);
      return user;
    } else {
      throw new Error('Invalid registration data');
    }
  },

  // Logout user
  logout: (): void => {
    authService.clearAuth();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return authService.getStoredAuth() !== null;
  },

  // Refresh token (extend session)
  refreshToken: (): boolean => {
    const user = authService.getStoredAuth();
    if (user) {
      authService.storeAuth(user);
      return true;
    }
    return false;
  }
};