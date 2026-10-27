import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import client, { clearCsrfToken } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { unwrapUser } from '@/api/unwrap';
import { getErrorMessage } from '@/utils/format';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await client.get(endpoints.authMe);
      setUser(unwrapUser(res));
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email, password) => {
    const res = await client.post(endpoints.authLogin, { email, password });
    const user = unwrapUser(res);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await client.post(endpoints.authLogout);
    } catch {
      // ignore
    } finally {
      clearCsrfToken();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
      checkAuth,
      getLoginError: (err) => getErrorMessage(err, 'Invalid email or password.'),
    }),
    [user, loading, login, logout, checkAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
