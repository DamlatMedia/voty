import { NavLink } from "react-router-dom";
import style from "../styles/Footer.module.css";
import "react-toastify/dist/ReactToastify.css";

function Footer() {
  return (
    <>
      <hr />
      <div className={style.foot}>
        <div className={style.logTag}>
          <div className={style.logoHead}>
            <img src="./images/logo.jpg" alt="logo" className={style.logo} />
          </div>
          <p className={style.phTag}>
            Unlock Your Potential Shape Your Tomorrow
          </p>
          <p className={style.pTag}>Damlat Media Concept Limited 2024</p>
        </div>

        <div className={style.company}>
          <p className={style.pmTag}>Company</p>
          <li className={style.navLi}>
            <NavLink to="/home">Home</NavLink>
          </li>
          <li className={style.navLi}>
            <NavLink to="/about">About us</NavLink>
          </li>
          <li className={style.navLi}>
            <NavLink to="/contact">Contact us</NavLink>
          </li>

          <li className={style.navLi}>
            <NavLink to="/faq">FAQ</NavLink>
          </li>
        </div>

        <div className={style.resources}>
        <p className={style.pmTag}>Resources</p>
          <li className={style.navLi}>
            <NavLink to="/video">Video Library</NavLink>
          </li>
          <li className={style.navLi}>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
          </li>
          <li className={style.navLi}>
            <NavLink to="/scholarship">Scholarship</NavLink>
          </li>

          <li className={style.navLi}>
            <NavLink to="/trivia">Trivia Games</NavLink>
          </li>
        </div>

        <div className={style.newsletter}>
          <p>Subscribe to our newsletter</p>

          <input type="text" placeholder="Enter your email" className={style.inp} />
          <button className={style.subscribe}>Subscribe</button>
        </div>
      </div>

      <div className={style.copyright}>
        <p>c 2024 Damlat Media Concept Limited All rights reserved</p>
        <div className={style.termPolicy}>
          <p>Terms of service</p>
          <p>Privacy policy</p>
        </div>
      </div>
    </>
  );
}

export default Footer;
