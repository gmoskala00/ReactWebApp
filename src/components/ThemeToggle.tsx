import { useTheme } from "../store/ThemeContext";

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button
      className="btn btn-outline-secondary ms-3 mx-3"
      onClick={toggle}
      style={{ minWidth: 100 }}
    >
      {dark ? "Tryb jasny" : "Tryb ciemny"}
    </button>
  );
}
