import React, { useState } from "react";
import { Link } from "react-scroll";
import { useAuth } from "../../security/AuthProvider";
import { FaBowlingBall, FaBars, FaTimes } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import BowlingColors from "../../styles/BowlingColors";
import Nav from "../../styles/Nav"; // Ensure the correct import path

export default function NavHeader() {
  const auth = useAuth();
  const location = useLocation();
  const myLocation = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Nav menuOpen={menuOpen}>
      <nav>
        <NavLink to="/">
          <FaBowlingBall size={35} color={BowlingColors.SecondaryColor} />
        </NavLink>
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? (
            <FaTimes size={35} color={BowlingColors.SecondaryColor} />
          ) : (
            <FaBars size={35} color={BowlingColors.SecondaryColor} />
          )}
        </div>
        <ul className={menuOpen ? "nav-menu active" : "nav-menu"}>
          <li>
            {myLocation === "/" ? (
              <Link
                to="activities"
                smooth={true}
                duration={666}
                style={{ cursor: "pointer" }}
                onClick={toggleMenu}
              >
                Aktiviteter
              </Link>
            ) : (
              <NavLink to="/activities" onClick={toggleMenu}>
                Aktiviteter
              </NavLink>
            )}
          </li>
          <li>
            {myLocation === "/" ? (
              <Link
                to="about"
                smooth={true}
                duration={666}
                style={{ cursor: "pointer" }}
                onClick={toggleMenu}
              >
                Om os
              </Link>
            ) : (
              <NavLink to="/about" onClick={toggleMenu}>
                Om os
              </NavLink>
            )}
          </li>
          <li>
            <NavLink to="/products" onClick={toggleMenu}>
              Produkter
            </NavLink>
          </li>
          {!auth.isLoggedIn() && (
            <li>
              <NavLink to="/login" onClick={toggleMenu}>
                Medarbejderside
              </NavLink>
            </li>
          )}
          {auth.isLoggedIn() && (
            <>
              <li>
                <NavLink to="/admin" onClick={toggleMenu}>
                  Admin
                </NavLink>
              </li>
              <li>
                <NavLink to="/reservations" onClick={toggleMenu}>
                  Reservationer
                </NavLink>
              </li>
              <li>
                <NavLink to="/logout" onClick={toggleMenu}>
                  Log ud
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </Nav>
  );
}
