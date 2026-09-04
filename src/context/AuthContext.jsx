/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const applySession = ({ user: nextUser, accessToken }) => {
    setAccessToken(accessToken);
    setUser(nextUser);
  };

  useEffect(() => {
    api.post("/auth/refresh").then(({ data }) => applySession(data.data)).catch(() => setAccessToken(null)).finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    applySession(data.data);
    return data.data.user;
  };

  const register = async (details) => {
    const { data } = await api.post("/auth/register", details);
    applySession(data.data);
    return data.data.user;
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } finally { setAccessToken(null); setUser(null); }
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
