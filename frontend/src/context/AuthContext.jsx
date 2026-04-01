import { createContext, useContext, useState, useEffect } from "react";
import { authAPI, notificationsAPI } from "../services/api";
import { io } from "socket.io-client";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      connectSocket(parsedUser);
      checkUnreadNotifications();
    }

    setLoading(false);
  }, []);

  const connectSocket = (user) => {
    const newSocket = io("http://localhost:4004", {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    newSocket.on("connect", () => {
      
    });

    newSocket.on("notification:new", (data) => {
      console.log("New notification:", data);
      setHasNewNotification(true);
    });

    setSocket(newSocket);
  };

  const checkUnreadNotifications = async () => {
    try {
      const data = await notificationsAPI.getAll();

      const hasUnread = data.some((n) => !n.isRead);
      setHasNewNotification(hasUnread);
    } catch (error) {
      console.error("Failed to check notifications:", error);
    }
  };

  const register = async (userData) => {
    try {
      await authAPI.register(userData);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        "Registration failed";
      return { success: false, error: message };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { user, token } = response;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      connectSocket(user);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      if (socket) {
        socket.disconnect();
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
      setSocket(null);
      setHasNewNotification(false);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    socket,
    hasNewNotification,
    setHasNewNotification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
