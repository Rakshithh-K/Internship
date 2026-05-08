import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';
import {
  AUTH_MODE_OFFLINE,
  AUTH_MODE_SERVER,
  AUTH_MODE_STORAGE_KEY,
  clearStoredAuth,
  getStoredAuthMode,
  getStoredToken,
  getStoredUser,
  isJwtToken,
  isServerSession,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from '../utils/auth';

const AuthContext = createContext();

const getInitialAuthMode = () => {
  const storedAuthMode = getStoredAuthMode();

  if (storedAuthMode) {
    return storedAuthMode;
  }

  const storedToken = getStoredToken();
  if (!storedToken) {
    return null;
  }

  return isJwtToken(storedToken) ? AUTH_MODE_SERVER : AUTH_MODE_OFFLINE;
};

const normalizeAuthResponse = (payload) => {
  const token = payload?.token || payload?.accessToken || null;
  const email = payload?.email || null;

  if (!token || !email) {
    return { token: null, user: null };
  }

  return {
    token,
    user: {
      id: payload.id || payload._id || null,
      email,
      firstName: payload.firstName || '',
      lastName: payload.lastName || '',
      role: payload.role || 'USER',
      type: payload.type || 'Bearer',
    },
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(getStoredToken);
  const [authMode, setAuthMode] = useState(getInitialAuthMode);
  const [loading, setLoading] = useState(false);

  const isServerAuthenticated = isServerSession(token, authMode) && !!user;
  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';

  // Persist user and token
  useEffect(() => {
    if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_STORAGE_KEY);

    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
    else localStorage.removeItem(TOKEN_STORAGE_KEY);

    if (authMode) localStorage.setItem(AUTH_MODE_STORAGE_KEY, authMode);
    else localStorage.removeItem(AUTH_MODE_STORAGE_KEY);
  }, [user, token, authMode]);

  const applyAuthSession = useCallback((sessionToken, userData, mode) => {
    setToken(sessionToken);
    setUser(userData);
    setAuthMode(mode);
  }, []);

  const clearAuthState = useCallback((showToast = true) => {
    setUser(null);
    setToken(null);
    setAuthMode(null);
    clearStoredAuth();

    if (showToast) {
      toast.success('Logged out successfully');
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const payload = {
        ...credentials,
        email: credentials.email.trim().toLowerCase(),
      };
      const res = await authApi.login(payload);
      const session = normalizeAuthResponse(res.data);

      if (!session.token || !session.user) {
        throw new Error('Invalid login response from server');
      }

      applyAuthSession(session.token, session.user, AUTH_MODE_SERVER);
      toast.success(`Welcome back, ${session.user.firstName || 'User'}!`);
      return { success: true, user: session.user };
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data?.message || 'Invalid email or password');
        return { success: false, error: err.response.data?.message || 'Invalid credentials' };
      }
      // Offline fallback
      const role = credentials.email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';
      const userData = { id: 'offline-user', firstName: role === 'ADMIN' ? 'Admin' : 'Demo', lastName: 'User', email: credentials.email, role: role };
      applyAuthSession('offline-demo-token', userData, AUTH_MODE_OFFLINE);
      toast.success(`(Offline Mode) Welcome, ${userData.firstName}!`);
      return { success: true, user: userData };
    } finally {
      setLoading(false);
    }
  }, [applyAuthSession]);

  const signup = useCallback(async (data) => {
    setLoading(true);
    try {
      const payload = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        password: data.password,
      };
      const res = await authApi.signup(payload);
      const session = normalizeAuthResponse(res.data);

      if (session.token && session.user) {
        applyAuthSession(session.token, session.user, AUTH_MODE_SERVER);
        toast.success('Account created successfully!');
        return { success: true, user: session.user };
      }

      toast.success(res.data?.message || 'Account created successfully! Please sign in.');
      return { success: true, requiresLogin: true };
    } catch (err) {
      if (err.response) {
        const responseData = err.response.data || {};
        toast.error(responseData.message || 'Error creating account');
        return {
          success: false,
          error: responseData.message || 'Error creating account',
          validationErrors: responseData.errors || {},
        };
      }
      // Offline fallback
      const role = data.email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';
      const userData = { id: 'offline-user', firstName: data.firstName, lastName: data.lastName, email: data.email, role: role };
      applyAuthSession('offline-demo-token', userData, AUTH_MODE_OFFLINE);
      toast.success('(Offline Mode) Account created!');
      return { success: true };
    } finally {
      setLoading(false);
    }
  }, [applyAuthSession]);

  const logout = useCallback(() => {
    clearAuthState();
  }, [clearAuthState]);

  const updateUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authMode,
        loading,
        isAuthenticated,
        isServerAuthenticated,
        isAdmin,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
