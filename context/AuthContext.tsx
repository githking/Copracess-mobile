import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { router } from "expo-router";

interface AuthProps {
  authState?: {
    accessToken: string | null;
    refreshToken: string | null;
    authenticated: boolean | null;
    data: {
      id: string | null;
      email: string | null;
      name: string | null;
      image?: string | null;
      role: string | null;
      organizationId?: string | null;
      isActive?: boolean;
      emailVerified?: string | null;
      position: string | null;
      isTwoFactorEnabled: boolean; // Add this field
    };
  };
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<void>;
}

interface ApiError extends Error {
  response?: {
    status: number;
    data: any;
  };
}

const ACCESS_TOKEN_KEY =
  process.env.EXPO_PUBLIC_ACCESS_TOKEN_KEY || "accessToken";
const REFRESH_TOKEN_KEY =
  process.env.EXPO_PUBLIC_REFRESH_TOKEN_KEY || "refreshToken";
const USER_DATA_KEY = "userData";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  // Initialize axios defaults
  axios.defaults.baseURL =
    process.env.EXPO_PUBLIC_API_URL_DEV || "https://copracess.live/api/mobile";

  const [authState, setAuthState] = useState<{
    accessToken: string | null;
    refreshToken: string | null;
    authenticated: boolean | null;
    data: {
      id: string | null;
      email: string | null;
      name: string | null;
      image?: string | null;
      role: string | null;
      organizationId?: string | null;
      isActive?: boolean;
      emailVerified?: string | null;
      position: string | null; // Add position field
      isTwoFactorEnabled: false;
    };
  }>({
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
      isActive: undefined,
      emailVerified: null,
      position: null, // Add position field
      isTwoFactorEnabled: false,
    },
  });

  // Token expiry buffer (1 minute)
  const tokenExpiryBuffer = 60 * 1000;

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 <= Date.now() + tokenExpiryBuffer;
    } catch {
      return true;
    }
  };

  // Load stored tokens on startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        const storedUserData = await SecureStore.getItemAsync(USER_DATA_KEY);
        const userData = storedUserData ? JSON.parse(storedUserData) : null;

        console.log("Loading stored auth data:", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          userData,
        });

        if (accessToken && refreshToken) {
          if (isTokenExpired(accessToken)) {
            console.log("Stored access token is expired, attempting refresh");
            await refreshAccessToken();
          } else {
            console.log("Setting stored access token");
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${accessToken}`;
            setAuthState({
              accessToken,
              refreshToken,
              authenticated: true,
              data: userData,
            });
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login...");
      delete axios.defaults.headers.common["Authorization"];

      const response = await axios.post(`/auth`, { email, password });
      console.log("Login successful");

      const { accessToken, refreshToken } = response.data.tokens;
      const userData = response.data.user;
      const decoded: any = jwtDecode(accessToken);

      const completeUserData = {
        id: userData.id || decoded.id,
        email: userData.email || decoded.email,
        name: userData.name || decoded.name,
        image: userData.image || decoded.image,
        role: userData.role || decoded.role,
        organizationId: userData.organizationId || decoded.organizationId,
        isActive: userData.isActive,
        emailVerified: userData.emailVerified,
        position: userData.position,
        isTwoFactorEnabled: userData.isTwoFactorEnabled || false, // Add this field
      };

      setAuthState({
        accessToken,
        refreshToken,
        authenticated: true,
        data: completeUserData,
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      await Promise.all([
        SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
        SecureStore.setItemAsync(
          USER_DATA_KEY,
          JSON.stringify(completeUserData)
        ),
      ]);

      return response;
    } catch (error) {
      console.error("Login error:", error);
      return { error: true, msg: (error as ApiError).response?.data?.message };
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out...");

      // Clear stored data first
      await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_DATA_KEY),
      ]);

      // Clear axios headers
      delete axios.defaults.headers.common["Authorization"];

      // Reset auth state last
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
          isActive: undefined,
          emailVerified: null,
          position: null,
          isTwoFactorEnabled: false,
        },
      });

      // Navigate after state is cleared
      router.replace("/signIn");
    } catch (error) {
      console.error("Logout error:", error);
      // Force navigation on error
      router.replace("/signIn");
    }
  };

  // In AuthContext.tsx

  const refreshAccessToken = async () => {
    try {
      const oldRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      if (!oldRefreshToken) {
        console.log("No refresh token found, logging out");
        await logout();
        return null;
      }

      const response = await axios.post(`/auth/refresh`, {
        token: oldRefreshToken,
      });

      const { accessToken, refreshToken } = response.data;

      if (!accessToken || !refreshToken) {
        throw new Error("Missing tokens in response");
      }

      // Decode new token to get updated user data
      const decoded: any = jwtDecode(accessToken);
      const updatedUserData = {
        ...authState?.data,
        isTwoFactorEnabled: decoded.isTwoFactorEnabled || false,
      };

      setAuthState((prev) => ({
        ...prev,
        accessToken,
        refreshToken,
        authenticated: true,
        data: updatedUserData,
      }));

      await Promise.all([
        SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
        SecureStore.setItemAsync(
          USER_DATA_KEY,
          JSON.stringify(updatedUserData)
        ),
      ]);

      return accessToken;
    } catch (error) {
      console.error("Refresh token error:", error);
      await logout();
      return null;
    }
  };

  useEffect(() => {
    let isRefreshing = false;
    let failedQueue: Array<{
      resolve: (value?: unknown) => void;
      reject: (reason?: any) => void;
    }> = [];

    // Request interceptor
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        // Skip auth header for refresh requests
        if (config.url?.includes("/auth/refresh")) {
          return config;
        }

        // Ensure headers object exists
        config.headers = config.headers || {};

        const token = authState?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        console.log("Request config:", {
          url: config.url,
          method: config.method,
          headers: {
            Authorization:
              typeof config.headers.Authorization === "string"
                ? config.headers.Authorization.substring(0, 20) + "..."
                : config.headers.Authorization,
          },
        });

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        console.log("Response error:", {
          status: error.response?.status,
          url: originalRequest?.url,
          retry: originalRequest?._retry,
          headers: originalRequest?.headers,
        });

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const newToken = await refreshAccessToken();
            if (!newToken) {
              throw new Error("Token refresh failed");
            }

            // Update the failed request's authorization header
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            // Process other queued requests
            failedQueue.forEach(({ resolve }) => resolve());

            // Make the original request again
            const response = await axios(originalRequest);

            return response;
          } catch (error) {
            failedQueue.forEach(({ reject }) => reject(error));
            throw error;
          } finally {
            isRefreshing = false;
            failedQueue = [];
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [authState?.accessToken]);

  const value = {
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
