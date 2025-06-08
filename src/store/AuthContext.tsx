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
      AuthApi.getMe(token)
        .then(setUser)
        .catch(() => {
          setUser(null);
          setToken(null);
          setRefreshToken(null);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        });
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (login: string, password: string) => {
    const { token, refreshToken } = await AuthApi.login(login, password);
    setToken(token);
    setRefreshToken(refreshToken);
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    const user = await AuthApi.getMe(token);
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
