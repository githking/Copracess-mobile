export interface AuthState {
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
}

export interface AuthContextType {
  authState?: AuthState;
  isLoading: boolean;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}
