import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

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
  onRegister?: (email: string, password: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_DATA_KEY = "userData";
export const API_URL = "http://192.168.0.231:3000/api/mobile";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
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

      console.log("Stored Access:", accessToken);
      console.log("Stored Data:", userData);
      console.log("Stored Refresh:", refreshToken);

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

  const register = async (email: string, password: string) => {
    try {
      return await axios.post(`${API_URL}/auth`, { email, password });
    } catch (error) {
      return { error: true, msg: (error as any).response.data.msg };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth`, { email, password });
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
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_DATA_KEY);

    axios.defaults.headers.common["Authorization"] = "";

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

    return { msg: "Logout Successfully!" };
  };

  const refreshAccessToken = async () => {
    const oldRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

    if (!oldRefreshToken) {
      return { error: true, msg: "No refresh token available" };
    }

    try {
      const response = await axios.post(`${API_URL}/auth/refresh`, {
        token: oldRefreshToken,
      });
      const { accessToken, refreshToken } = response.data;

      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      setAuthState((prevState) => ({
        ...prevState,
        accessToken,
        refreshToken,
      }));

      return accessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return { error: true, msg: (error as any).response.data.message };
    }
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && authState.refreshToken) {
          const newAccessToken = await refreshAccessToken();

          if (newAccessToken) {
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [authState.refreshToken]);

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
