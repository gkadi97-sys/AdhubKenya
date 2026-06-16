import { createContext, useContext, useEffect, useState } from 'react';
import { getUser, getToken, setAuth, clearAuth, login as apiLogin, register as apiRegister } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const u = getUser();
    const t = getToken();
    if (u && t) setUser(u);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin({ email, password });
    setAuth(data.token, data);
    setUser(data);
    return data;
  };

  const register = async (formData) => {
    const data = await apiRegister(formData);
    setAuth(data.token, data);
    setUser(data);
    return data;
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
