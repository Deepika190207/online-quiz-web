import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./authContextValue";

interface User {
  id?: string;
  name: string;
  email: string;
  tests?: unknown[];
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUserStr = localStorage.getItem("user");

      if (!storedToken || !storedUserStr) {
        return;
      }

      const parsedUser: User = JSON.parse(storedUserStr);

      if (parsedUser?.name && parsedUser?.email) {
        setUser(parsedUser);
        setToken(storedToken);
      } else {
        console.warn("User data incomplete in localStorage. Clearing...");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.warn(
        "Invalid user data in localStorage. Clearing...",
        err
      );
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    if (!newUser?.name || !newUser?.email) {
      console.error(
        "Attempted to log in with incomplete user data",
        newUser
      );
      return;
    }

    setToken(newToken);
    setUser(newUser);

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};