import { useState } from "react";

interface Props {
  onLogin: (login: string, password: string) => Promise<void>;
}

export default function LoginForm({ onLogin }: Props) {
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await onLogin(loginValue, password);
    } catch (err: any) {
      setError(err.message || "Błąd logowania");
    }
  };

  return (
    <form className="card p-4 mx-auto w-25 mt-5" onSubmit={handleSubmit}>
      <h3 className="mb-3">Logowanie</h3>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Login"
        value={loginValue}
        onChange={(e) => setLoginValue(e.target.value)}
      />
      <input
        type="password"
        className="form-control mb-2"
        placeholder="Hasło"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <div className="alert alert-danger py-1">{error}</div>}
      <button type="submit" className="btn btn-success w-100">
        Zaloguj
      </button>
    </form>
  );
}
