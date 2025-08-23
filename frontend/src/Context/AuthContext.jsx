// src/Context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { fetchMe } from "../api/users";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  });

  // persist/remove token
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // HYDRATE: if token exists, fetch profile once on mount
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const { data } = await fetchMe();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      } catch (e) {
        console.error('hydrate /me failed', e);
        // optional: logout()
      }
    })();
  }, [token]);



  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
