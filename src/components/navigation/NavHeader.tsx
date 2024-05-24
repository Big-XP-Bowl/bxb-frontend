import { Link } from "react-scroll";
import { useAuth } from "../../security/AuthProvider";
import Nav from "../../styles/Nav";
import { FaBowlingBall } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import BowlingColors from "../../styles/BowlingColors";

export default function NavHeader() {
  const auth = useAuth();

  return (
    <Nav>
      <nav>
        <NavLink to="/">
          <FaBowlingBall size={35} color={BowlingColors.SecondaryColor} />
        </NavLink>
        <ul>
          <li>
            <Link
              to="activities"
              smooth={true}
              duration={500}
              style={{ cursor: "pointer" }}
            >
              Alle aktiviter
            </Link>
          </li>
          <li>
            <NavLink to="/products"
            >
              Produkter
            </NavLink>
          </li>
          <li>
            <Link
              to="about"
              smooth={true}
              duration={500}
              style={{ cursor: "pointer" }}
            >
              About
            </Link>
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
