import { NavLink } from "react-router-dom";
import { useAuth } from "../../security/AuthProvider";
import Nav from "../../styles/Nav";

export default function NavHeader() {
  const auth = useAuth();

  return (
    <Nav>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/bowling">Bowling</NavLink>
          </li>
          <li>
            <NavLink to="/airhockey">Airhockey</NavLink>
          </li>
          <li>
            <NavLink to="/dining">Diner</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
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
            <li>
              <NavLink to="/admin">Admin</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/logout">Log ud</NavLink>
          </li>
        </ul>
      </nav>
    </Nav>
  );
}
