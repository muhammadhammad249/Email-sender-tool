'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId?: string;
  organizationName?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  verify: (email: string, otp: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    organizationName: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to restore authentication:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get('content-type');

      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        console.error('Backend returned non-JSON:', text);
        if (response.status >= 500) {
          throw new Error('The server is taking too long to respond. This might be a database connection issue. Please verify your MongoDB Atlas IP Whitelist or check server logs.');
        }
        throw new Error(`Server error (${response.status}). Please try again.`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Login failed');
      }

      if (!data?.token || !data?.user) {
        throw new Error('Invalid login response from backend');
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      router.push('/');
    },
    [router]
  );

  const register = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      organizationName: string
    ): Promise<void> => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, organizationName }),
      });

      const contentType = response.headers.get('content-type');

      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        console.error('Backend returned non-JSON:', text);
        if (response.status >= 500) {
          throw new Error('The server is taking too long to respond. This might be a database connection issue. Please verify your MongoDB Atlas IP Whitelist or check server logs.');
        }
        throw new Error(`Server error (${response.status}). Please try again.`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Registration failed');
      }

      const registeredEmail = data?.email || email;
      router.push(`/verify-otp?email=${encodeURIComponent(registeredEmail)}`);
    },
    [router]
  );

  const verify = useCallback(
    async (email: string, otp: string): Promise<void> => {
      const response = await fetch(`${API_URL}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const contentType = response.headers.get('content-type');

      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        console.error('Backend returned non-JSON:', text);
        if (response.status >= 500) {
          throw new Error('The server is taking too long to respond. This might be a database connection issue. Please verify your MongoDB Atlas IP Whitelist or check server logs.');
        }
        throw new Error(`Server error (${response.status}). Please try again.`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Verification failed');
      }

      if (!data?.token || !data?.user) {
        throw new Error('Invalid verification response from backend');
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      router.push('/');
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    setToken(null);
    setUser(null);

    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        verify,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
