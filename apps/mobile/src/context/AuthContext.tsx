import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import type {
  User,
  SignupData,
  LoginData,
  AuthResponse,
} from '@crewdirectoryapp/shared';

const AUTH_TOKEN_KEY = '@crew_lounge_token';
const AUTH_USER_KEY = '@crew_lounge_user';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from storage on app load
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        const storedUser = await AsyncStorage.getItem(AUTH_USER_KEY);

        if (storedToken) {
          apiService.setToken(storedToken);
          setToken(storedToken);

          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }

          // Verify token is still valid by fetching profile
          try {
            const profile = await apiService.getProfile();
            setUser(profile);
            await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
          } catch (error) {
            // Token is invalid, clear session
            console.log('Token expired, clearing session');
            await clearSession();
          }
        }
      } catch (error) {
        console.error('Error restoring session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const clearSession = async () => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(AUTH_USER_KEY);
    apiService.setToken(null);
    setToken(null);
    setUser(null);
  };

  const saveSession = async (response: AuthResponse) => {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.access_token);
    await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
    apiService.setToken(response.access_token);
    setToken(response.access_token);
    setUser(response.user);
  };

  const login = useCallback(async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response = await apiService.login(data);
      await saveSession(response);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    setIsLoading(true);
    try {
      const response = await apiService.signup(data);
      await saveSession(response);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await clearSession();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    try {
      const profile = await apiService.getProfile();
      setUser(profile);
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  }, [token]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    signup,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
