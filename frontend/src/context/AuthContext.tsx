import React, { createContext, useState, ReactNode, FC, useEffect } from "react";
import { isTokenExpired, getTokenExpiry } from "../helpers/helper.ts";
import { message } from "antd";

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

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userId");
    setToken(null);
    setUserId(null);
  };

  const scheduleExpiry = (expiryToken: string) => {
    const expiry = getTokenExpiry(expiryToken);
    if (expiry) {
      const timeLeft = expiry.getTime() - Date.now();
      setTimeout(() => {
        logout();
        message.error("Session expired. Please log in again.", 3); // 3 sec duration
      }, timeLeft);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("jwt");
    const savedUserId = localStorage.getItem("userId");

    if (savedToken && !isTokenExpired(savedToken)) {
      setToken(savedToken);
      setUserId(savedUserId);
      scheduleExpiry(savedToken);
    } else {
      logout();
    }
  }, []);

  const login = (newToken: string, newUserId: string) => {
    localStorage.setItem("jwt", newToken);
    localStorage.setItem("userId", newUserId);
    setToken(newToken);
    setUserId(newUserId);
    scheduleExpiry(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
