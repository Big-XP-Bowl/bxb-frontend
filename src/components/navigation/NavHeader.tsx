import { NavLink } from "react-router-dom";
import { useAuth } from "../../security/AuthProvider";
import Nav from "../../styles/Nav";
import { FaBowlingBall } from "react-icons/fa";

export default function NavHeader() {
  const auth = useAuth();

  return (
    <Nav>
      <nav>
        <NavLink to="/" style={{ padding: "1rem" }}>
          <FaBowlingBall size={35} color="#f9abab" />
        </NavLink>
        <ul>
          <li>
            <NavLink to="/activities">Alle aktiviter</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          {!auth.isLoggedIn() && (
            <li>
              <NavLink to="/login">Medarbejderside</NavLink>
            </li>
          )}
          {auth.isLoggedIn() && (
            <>
              <li>
                <NavLink to="/admin">Admin</NavLink>
              </li>
              <li>
                <NavLink to="/reservations">Reservationer</NavLink>
              </li>
              <li>
                <NavLink to="/logout">Log ud</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </Nav>
  );
}
