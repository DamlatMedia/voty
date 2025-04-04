import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import style from "../styles/Header2.module.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />
      <div className={style.header}>
        <div className={style.logoHead}>
          <img src="./images/logo.jpg" alt="logo" className={style.logo} />
        </div>

        {/* Menu Button for Mobile */}
        <div className={style.style}>
        <button className={style.menuButton} onClick={toggleMenu}>
          <span className="material-symbols-outlined">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>

        <nav className={`${style.headNav} ${menuOpen ? style.active : ""}`}>
          <ul className={style.navUl}>
            <li className={style.navLi}>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                Home
              </NavLink>
            </li>

            {/* <li className={style.navLi}>
              <NavLink
                to="/resources"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                Resources
              </NavLink>
            </li> */}

            <li className={style.navLi}>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                About Us
              </NavLink>
            </li>

            <li className={style.navLi}>
              <NavLink
                to="/contact"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                Contact Us
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className={style.auth}>
          <li className={style.navLi}>
            <NavLink to="/student/login">Login</NavLink>
          </li>

          <button className={style.sign}>
            <NavLink to="/student/register">Sign Up</NavLink>
          </button>
        </div>
        </div>
      </div>
    </>
  );
}

export default Header;
