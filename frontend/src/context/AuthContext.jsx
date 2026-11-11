
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import authApi from "../services/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify the existing session when the application starts.
  const verifySession = useCallback(async () => {
    if (!authApi.isAuthenticated()) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.me();
      setUser(response.user);
    } catch (error) {
      console.error("Session verification failed:", error.message);

      authApi.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify session on application startup.
  useEffect(() => {
    verifySession();
  }, [verifySession]);

  // Handle expired or invalid JWT tokens globally.
  useEffect(() => {
    const handleUnauthorized = () => {
      authApi.logout();
      setUser(null);
      navigate("/login", { replace: true });
    };

    window.addEventListener(
      "copper:unauthorized",
      handleUnauthorized
    );

    return () => {
      window.removeEventListener(
        "copper:unauthorized",
        handleUnauthorized
      );
    };
  }, [navigate]);

  // Login and update global authentication state.
  const login = async (email, password) => {
    const response = await authApi.login(email, password);

    setUser(response.user);

    return response;
  };

  // Logout and clear global authentication state.
  const logout = () => {
    authApi.logout();
    setUser(null);
    navigate("/login", { replace: true });
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    role: user?.role || null,
    login,
    logout,
    refreshUser: verifySession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing authentication.
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};

export default AuthContext;
