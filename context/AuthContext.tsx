import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import type { AuthState, AuthContextType } from "../types/auth";
import { useRouter, useSegments } from "expo-router";

// Constants
const STORAGE_KEYS = {
  ACCESS_TOKEN: "auth.access_token",
  REFRESH_TOKEN: "auth.refresh_token",
  USER_DATA: "auth.user_data",
} as const;

const TOKEN_REFRESH_BUFFER = 60; // Refresh 60 seconds before expiry
const TOKEN_CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL_DEV || "https://www.copracess.live";

interface DecodedToken {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: string;
  organizationId?: string;
  exp: number;
}

// Create context with default loading state
const AuthContext = createContext<AuthContextType>({
  isLoading: true,
});

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
const clearStoredAuth = async () => {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA),
    ]);
    delete axios.defaults.headers.common["Authorization"];
  } catch (error) {
    console.error("Error clearing stored auth:", error);
  }
};

// Auth error boundary component
const AuthErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  const handleError = async (error: Error) => {
    if (error.message === "AUTH_EXPIRED") {
      await clearStoredAuth();
      router.replace("/signIn");
    }
  };

  return <>{children}</>;
};

let refreshPromise: Promise<string | null> | null = null;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const segments = useSegments();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    refreshToken: null,
    authenticated: null,
    data: {
      id: null,
      email: null,
      name: null,
      image: null,
      role: null,
      organizationId: null,
    },
  });

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.baseURL = API_BASE_URL;
  }, []);

  // Token Management Functions
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded.exp * 1000 <= Date.now() + TOKEN_REFRESH_BUFFER * 1000;
    } catch {
      return true;
    }
  };

  const refreshAccessToken = async () => {
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      try {
        const refreshToken = await SecureStore.getItemAsync(
          STORAGE_KEYS.REFRESH_TOKEN
        );
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await axios.post("/api/mobile/auth/refresh", {
          token: refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        await Promise.all([
          SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken),
          SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken),
        ]);

        // Update auth state
        setAuthState((prev) => ({
          ...prev,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          authenticated: true,
        }));

        // Update axios default header
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        return newAccessToken;
      } catch (error) {
        await clearStoredAuth();
        setAuthState({
          accessToken: null,
          refreshToken: null,
          authenticated: false,
          data: {
            id: null,
            email: null,
            name: null,
            image: null,
            role: null,
            organizationId: null,
          },
        });
        throw error;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  };

  // Authentication Functions
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`api/mobile/auth`, { email, password });
      const { accessToken, refreshToken } = response.data;

      const decoded: DecodedToken = jwtDecode(accessToken);
      const userData = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        image: decoded.image,
        role: decoded.role,
        organizationId: decoded.organizationId,
      };

      await Promise.all([
        SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
        SecureStore.setItemAsync(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(userData)
        ),
      ]);

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      setAuthState({
        accessToken,
        refreshToken,
        authenticated: true,
        data: userData,
      });

      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        error: true,
        msg: error.response?.data?.message || "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      setIsLoading(true);

      await clearStoredAuth();

      setAuthState({
        accessToken: null,
        refreshToken: null,
        authenticated: false,
        data: {
          id: null,
          email: null,
          name: null,
          image: null,
          role: null,
          organizationId: null,
        },
      });

      return { success: true, msg: "Logout successful" };
    } catch (error) {
      console.error("Logout error:", error);
      return { error: true, msg: "Logout failed" };
    } finally {
      setIsLoggingOut(false);
      setIsLoading(false);
    }
  };

  // Load stored authentication state on app start
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        setIsLoading(true);
        const [accessToken, refreshToken, storedUserData] = await Promise.all([
          SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
          SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
          SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA),
        ]);

        if (accessToken && refreshToken && storedUserData) {
          const userData = JSON.parse(storedUserData);

          // Validate token before restoring session
          if (!isTokenExpired(accessToken)) {
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${accessToken}`;
            setAuthState({
              accessToken,
              refreshToken,
              authenticated: true,
              data: userData,
            });
          } else {
            // Try to refresh if token is expired
            await refreshAccessToken();
          }
        } else {
          setAuthState((prev) => ({ ...prev, authenticated: false }));
        }
      } catch (error) {
        console.error("Error loading stored auth:", error);
        await clearStoredAuth();
        setAuthState((prev) => ({ ...prev, authenticated: false }));
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Navigation guard effect
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inProtectedGroup = segments[0] === "(protected)";

    if (!authState.authenticated && !inAuthGroup) {
      router.replace("/(auth)/signIn");
    } else if (authState.authenticated && inAuthGroup) {
      if (authState.data.role === "COPRA_BUYER") {
        router.replace("/(protected)/buyerhome");
      } else {
        router.replace("/(protected)/oilhome");
      }
    }
  }, [authState.authenticated, segments, isLoading]);

  // Token refresh interval
  useEffect(() => {
    if (authState.authenticated && !isLoggingOut) {
      const interval = setInterval(async () => {
        const accessToken = await SecureStore.getItemAsync(
          STORAGE_KEYS.ACCESS_TOKEN
        );
        if (accessToken && isTokenExpired(accessToken)) {
          try {
            await refreshAccessToken();
          } catch (error) {
            console.error("Token refresh error:", error);
          }
        }
      }, TOKEN_CHECK_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [authState.authenticated, isLoggingOut]);

  // Axios interceptors for automatic token refresh
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        const accessToken = await SecureStore.getItemAsync(
          STORAGE_KEYS.ACCESS_TOKEN
        );
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            await clearStoredAuth();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const contextValue = {
    authState,
    isLoading,
    onLogin: login,
    onLogout: logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <AuthErrorBoundary>{children}</AuthErrorBoundary>
    </AuthContext.Provider>
  );
};
