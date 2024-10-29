import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface AuthProps {
  authState?: {
    accessToken: string | null;
    refreshToken: string | null;
    authenticated: boolean | null;
  };
  onRegister?: (email: string, password: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
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
  }>({
    accessToken: null,
    refreshToken: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      console.log("Stored Access:", accessToken);
      console.log("Stored Refresh:", refreshToken);

      if (accessToken && refreshToken) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        setAuthState({
          accessToken,
          refreshToken,
          authenticated: true,
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

      setAuthState({
        accessToken,
        refreshToken,
        authenticated: true,
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);

      return response;
    } catch (error) {
      console.error(error);
      return { error: true, msg: (error as any).response.data.message };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    axios.defaults.headers.common["Authorization"] = "";

    setAuthState({
      accessToken: null,
      refreshToken: null,
      authenticated: false,
    });
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

        // If error is 401 and refresh token exists, try refreshing the access token
        if (error.response?.status === 401 && authState.refreshToken) {
          const newAccessToken = await refreshAccessToken();

          if (newAccessToken) {
            // Retry the original request with the new token
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
