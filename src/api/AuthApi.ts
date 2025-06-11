export interface LoginResponse {
  token: string;
  refreshToken: string;
}

export interface User {
  _id: string;
  login: string;
  firstName: string;
  lastName: string;
  role: string;
}

const API_URL = "http://localhost:4000/api";

export const AuthApi = {
  async login(login: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });
    if (!res.ok) throw new Error("Nieprawidłowy login lub hasło");
    return await res.json();
  },

  async refresh(refreshToken: string): Promise<LoginResponse> {
    const res = await fetch(`${API_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) throw new Error("Nieprawidłowy refresh token");
    return await res.json();
  },

  async getMe(token: string): Promise<User> {
    const res = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Nieprawidłowy lub wygasły token");
    return await res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch("http://localhost:4000/api/users");
    if (!res.ok) throw new Error("Błąd pobierania listy użytkowników");
    return await res.json();
  },
};
