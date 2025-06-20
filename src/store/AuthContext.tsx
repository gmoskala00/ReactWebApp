import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthApi, User } from "../api/AuthApi";

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (token) {
      fetchUser(token).catch(logout);
    }
  }, [token]);

  const fetchUser = async (accessToken: string) => {
    try {
      const user = await AuthApi.getMe(accessToken);
      setUser(user);
    } catch {
      if (refreshToken) {
        try {
          const newTokens = await AuthApi.refresh(refreshToken);
          setToken(newTokens.token);
          setRefreshToken(newTokens.refreshToken);
          localStorage.setItem("token", newTokens.token);
          localStorage.setItem("refreshToken", newTokens.refreshToken);
          const user = await AuthApi.getMe(newTokens.token);
          setUser(user);
        } catch {
          logout();
        }
      } else {
        logout();
      }
    }
  };

  const login = async (login: string, password: string) => {
    const tokens = await AuthApi.login(login, password);
    setToken(tokens.token);
    setRefreshToken(tokens.refreshToken);
    localStorage.setItem("token", tokens.token);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    const user = await AuthApi.getMe(tokens.token);
    setUser(user);
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
