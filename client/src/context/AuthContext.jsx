import { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../api/client.js';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem('portfolio_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem('portfolio_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('portfolio_user');
    }
  }, [user]);

  async function login(email, password) {
    const data = await apiRequest('/api/users/login', { method: 'POST', body: { email, password } });
    setUser(data);
    return data;
  }

  async function register(username, email, password) {
    const data = await apiRequest('/api/users/register', {
      method: 'POST',
      body: { username, email, password }
    });
    setUser(data);
    return data;
  }

  function logout() {
    setUser(null);
  }

  const value = { user, token: user?.token || null, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
