import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { router } from "expo-router";

interface UserData {
  id: string | null;
  email: string | null;
  name: string | null;
  image: string | null;
  role: string | null;
  organizationId: string | null;
  isActive: boolean;
  emailVerified: Date | null;
  position: string | null;
  isTwoFactorEnabled: boolean;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  authenticated: boolean | null;
  data: UserData;
}

interface AuthProps {
  authState?: AuthState;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
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

const initialUserData: UserData = {
  id: null,
  email: null,
  name: null,
  image: null,
  role: null,
  organizationId: null,
  isActive: false,
  emailVerified: null,
  position: null,
  isTwoFactorEnabled: false,
};

const initialAuthState: AuthState = {
  accessToken: null,
  refreshToken: null,
  authenticated: null,
  data: initialUserData,
};

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  axios.defaults.baseURL = "https://www.copracess.live/api/mobile";
  // axios.defaults.baseURL = "http://192.168.0.231:3000/api/mobile";

  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const tokenExpiryBuffer = 60 * 1000; // 1 minute buffer

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 <= Date.now() + tokenExpiryBuffer;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        const storedUserData = await SecureStore.getItemAsync(USER_DATA_KEY);
        const userData = storedUserData
          ? JSON.parse(storedUserData)
          : initialUserData;

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

      const { accessToken, refreshToken, user } = response.data;

      const userData: UserData = {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
        organizationId: user.organizationId,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        position: user.position,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
      };

      setAuthState({
        accessToken,
        refreshToken,
        authenticated: true,
        data: userData,
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      console.log(
        "Setting auth header:",
        axios.defaults.headers.common["Authorization"]
      );

      await Promise.all([
        SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
        SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData)),
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

      await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_DATA_KEY),
      ]);

      delete axios.defaults.headers.common["Authorization"];
      setAuthState(initialAuthState);
      router.replace("/signIn");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const oldRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      if (!oldRefreshToken) {
        throw new Error("No refresh token found");
      }

      console.log("Starting token refresh");

      const response = await axios.post(
        `/auth/refresh`,
        { token: oldRefreshToken },
        { headers: { Authorization: undefined } }
      );

      const { accessToken, refreshToken, user } = response.data;

      if (!accessToken || !refreshToken) {
        throw new Error("Invalid token response");
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      console.log(
        "New auth header set:",
        axios.defaults.headers.common["Authorization"]
      );

      setAuthState((prev) => ({
        ...prev,
        accessToken,
        refreshToken,
        authenticated: true,
        data: user || prev.data,
      }));

      await Promise.all([
        SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
        user && SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user)),
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

    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        if (config.url?.includes("/auth/refresh")) {
          return config;
        }

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

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            failedQueue.forEach(({ resolve }) => resolve());

            return await axios(originalRequest);
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
