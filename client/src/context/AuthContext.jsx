import { createContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/authService";
import { setAuthToken } from "../services/http";
import { disconnectRealtime } from "../services/realtimeService";

export const AuthContext = createContext(null);

const storedSession = localStorage.getItem("agroconnect_auth");

export function AuthProvider({ children }) {
  const [session, setSession] = useState(storedSession ? JSON.parse(storedSession) : null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.token) {
      setAuthToken(session.token);
      localStorage.setItem("agroconnect_auth", JSON.stringify(session));
      return;
    }

    setAuthToken(null);
    disconnectRealtime();
    localStorage.removeItem("agroconnect_auth");
  }, [session]);

  const login = async (payload) => {
    setLoading(true);

    try {
      const data = await loginUser(payload);
      setSession(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);

    try {
      const data = await registerUser(payload);
      setSession(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        login,
        logout,
        register,
        user: session?.user ?? null,
        token: session?.token ?? null,
        isAuthenticated: Boolean(session?.token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
