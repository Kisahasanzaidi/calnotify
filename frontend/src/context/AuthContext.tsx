import React, { createContext, useState, ReactNode, FC, useEffect } from "react";
import { isTokenExpired, getTokenExpiry } from "../helpers/helper.ts";

interface AuthContextType {
  token: string | null;
  userId: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("jwt");
    const savedUserId = localStorage.getItem("userId");

    if (savedToken && !isTokenExpired(savedToken)) {
      setToken(savedToken);
      setUserId(savedUserId);

      const expiry = getTokenExpiry(savedToken);
      if (expiry) {
        const timeLeft = expiry.getTime() - Date.now();
        setTimeout(() => {
          logout();
          alert("Session expired. Please log in again.");
        }, timeLeft);
      }
    } else {
      localStorage.removeItem("jwt");
      localStorage.removeItem("userId");
    }
  }, []);

  const login = (newToken: string, newUserId: string) => {
    localStorage.setItem("jwt", newToken);
    localStorage.setItem("userId", newUserId);
    setToken(newToken);
    setUserId(newUserId);

    const expiry = getTokenExpiry(newToken);
    if (expiry) {
      const timeLeft = expiry.getTime() - Date.now();
      setTimeout(() => {
        logout();
        alert("Session expired. Please log in again.");
      }, timeLeft);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userId");
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
