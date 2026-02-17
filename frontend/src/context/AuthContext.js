import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Example user object:
  // { role: "user" } or { role: "admin" }

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (roleOrUser = "user") => {
    if (typeof roleOrUser === "string") {
      setUser({ role: roleOrUser });
    } else if (roleOrUser && typeof roleOrUser === "object") {
      setUser(roleOrUser);
      localStorage.setItem("user", JSON.stringify(roleOrUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
