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
    };
  };
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
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
    },
  });

  useEffect(() => {
    const loadToken = async () => {
      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      const storedUserData = await SecureStore.getItemAsync(USER_DATA_KEY);
      const userData = storedUserData ? JSON.parse(storedUserData) : null;

      console.log("Stored Data:", userData);

      if (accessToken && refreshToken) {
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
    };
    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`/auth`, { email, password });
      console.log("Login Result: ", response.data);
      const { accessToken, refreshToken } = response.data;

      const decoded: any = jwtDecode(accessToken);
      const userData = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        image: decoded.image,
        role: decoded.role,
        organizationId: decoded.organizationId,
      };

      setAuthState({
        accessToken,
        refreshToken,
        authenticated: true,
        data: userData,
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));

      return response;
    } catch (error) {
      console.error(error);
      return { error: true, msg: (error as any).response.data.message };
    }
  };

  const logout = async () => {
    try {
      // Clear all tokens
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_DATA_KEY);

      // Clear axios headers
      delete axios.defaults.headers.common["Authorization"];

      // Reset auth state
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

      // Navigate to login
      router.replace("/signIn");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const oldRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      if (!oldRefreshToken) {
        console.log("No refresh token found");
        await logout();
        return { error: true, msg: "No refresh token available" };
      }

      // Log token details for debugging
      console.log("Refresh attempt with token:", {
        tokenPreview: oldRefreshToken.substring(0, 20) + "...",
        tokenLength: oldRefreshToken.length,
      });

      const response = await axios.post(`/auth/refresh`, {
        token: oldRefreshToken,
      });

      if (response.data.accessToken && response.data.refreshToken) {
        await SecureStore.setItemAsync(
          ACCESS_TOKEN_KEY,
          response.data.accessToken
        );
        await SecureStore.setItemAsync(
          REFRESH_TOKEN_KEY,
          response.data.refreshToken
        );

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;

        return response.data.accessToken;
      }

      return { error: true, msg: "Invalid response format" };
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log("Token refresh failed with 401 - logging out");
        await logout();
      }
      return {
        error: true,
        msg: error.response?.data?.message || "Refresh failed",
      };
    }
  };
  useEffect(() => {
    let isRefreshing = false;
    let failedQueue: any[] = [];

    const processQueue = (error: any, token: string | null = null) => {
      failedQueue.forEach((prom) => {
        if (error) {
          prom.reject(error);
        } else {
          prom.resolve(token);
        }
      });
      failedQueue = [];
    };

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            // Wait for the token refresh
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                return axios(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const newToken = await refreshAccessToken();
            if (newToken && !newToken.error) {
              // Process any queued requests
              processQueue(null, newToken);
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              return axios(originalRequest);
            } else {
              processQueue(new Error("Refresh failed"));
              // if (onLogout) await onLogout();
              return Promise.reject(new Error("Token refresh failed"));
            }
          } catch (refreshError) {
            processQueue(refreshError);
            // if (onLogout) await onLogout();
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [authState?.refreshToken]);

  const value = {
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
