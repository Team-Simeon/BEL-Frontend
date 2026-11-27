import { NavLink } from "react-router";
import "./Navbar.css";

// Minimal navigation; FE-02 will replace it with the full shared layout.
export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Основна навигация">
      <NavLink to="/" end>
        Начало
      </NavLink>
      <NavLink to="/feedback">Обратна връзка</NavLink>
      <NavLink to="/login">Вход</NavLink>
    </nav>
  );
}
