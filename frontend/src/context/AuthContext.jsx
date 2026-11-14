import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem('jobnova_token') || localStorage.getItem('talentpulse_token') || null
  );
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notifications
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch {
      // ignore silently if not logged in or error
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken =
        localStorage.getItem('jobnova_token') || localStorage.getItem('talentpulse_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          fetchUnreadCount();
        }
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        localStorage.removeItem('jobnova_token');
        localStorage.removeItem('talentpulse_token');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [fetchUnreadCount]);

  // Login handler
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('jobnova_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      fetchUnreadCount();
      return res.data.user;
    }
  };

  // Register handler
  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      localStorage.setItem('jobnova_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      fetchUnreadCount();
      return res.data.user;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('jobnova_token');
    localStorage.removeItem('talentpulse_token');
    setToken(null);
    setUser(null);
    setUnreadCount(0);
  };

  // Refresh current user data
  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        fetchUnreadCount();
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  // Toggle bookmark / saved job
  const toggleBookmark = async (jobId) => {
    if (!user) throw new Error('Please sign in to save jobs');
    const res = await api.post(`/saved-jobs/${jobId}`);
    if (res.data.success) {
      // Refresh current user savedJobs
      const isSaved = res.data.isSaved;
      setUser((prev) => {
        if (!prev) return prev;
        const currentSaved = prev.savedJobs || [];
        const updated = isSaved
          ? [...currentSaved, jobId]
          : currentSaved.filter((id) => id.toString() !== jobId.toString());
        return { ...prev, savedJobs: updated };
      });
      return isSaved;
    }
  };

  const isJobSeeker = user?.role === 'jobseeker' || user?.role === 'candidate';
  const isEmployer = user?.role === 'employer' || user?.role === 'recruiter';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        unreadCount,
        isAuthenticated: !!user,
        isJobSeeker,
        isEmployer,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
        setUser,
        toggleBookmark,
        fetchUnreadCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
