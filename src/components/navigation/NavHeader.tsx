import { Link } from "react-scroll";
import { useAuth } from "../../security/AuthProvider";
import Nav from "../../styles/Nav";
import { FaBowlingBall } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import BowlingColors from "../../styles/BowlingColors";
export default function NavHeader() {
  const auth = useAuth();
  const location = useLocation();
  const myLocation = location.pathname;

  return (
    <Nav>
      <nav>
        <NavLink to="/">
          <FaBowlingBall size={35} color={BowlingColors.SecondaryColor} />
        </NavLink>
        <ul>
          <li>
            {/* depending on the const myLocation this is either a Link or a NavLink */}
            {/* if the user is on homepage, then they are Link. If they are on any other location, then it's a NavLink */}
            {myLocation === "/" ? (
              <Link
                to="activities"
                smooth={true}
                duration={666}
                style={{ cursor: "pointer" }}
              >
                Aktiviteter
              </Link>
            ) : (
              <NavLink to="/activities">Aktiviteter</NavLink>
            )}
          </li>
          <li>
            {/* depending on myLocation, the user is clicking either Link or NavLink */}
            {myLocation === "/" ? (
              <Link
                to="about"
                smooth={true}
                duration={666}
                style={{ cursor: "pointer" }}
              >
                Om os
              </Link>
            ) : (
              <NavLink to="/about">Om os</NavLink>
            )}
          </li>
          <li>
            <NavLink to="/products">Produkter</NavLink>
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
