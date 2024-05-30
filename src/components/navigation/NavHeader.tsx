import React from "react";
import { Link } from "react-scroll";
import { useAuth } from "../../security/AuthProvider";
import Nav from "../../styles/Nav";
import { FaBowlingBall } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import BowlingColors from "../../styles/BowlingColors";

export default function NavHeader() {
  const auth = useAuth();
  const location = useLocation();

  return (
    <Nav>
      <nav>
        <NavLink to="/">
          <FaBowlingBall size={35} color={BowlingColors.SecondaryColor} />
        </NavLink>
        <ul>
          <li>
            {location.pathname === "/" ? (
              <Link to="activities" smooth={true} duration={500} style={{ cursor: "pointer" }}>
                Alle aktiviteter
              </Link>
            ) : (
              <NavLink to="/">Alle aktiviteter</NavLink>
            )}
          </li>
          <li>
            <NavLink to="/products">Produkter</NavLink>
          </li>
          <li>
            {location.pathname === "/" ? (
              <Link to="about" smooth={true} duration={500} style={{ cursor: "pointer" }}>
                About
              </Link>
            ) : (
              <NavLink to="/">About</NavLink>
            )}
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
