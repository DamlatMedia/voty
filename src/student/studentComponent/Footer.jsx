import { NavLink } from "react-router-dom";
import style from "../studentStyles/footer.module.css";

function Footer() {
  return (
    <>
      <div className={style.bar}>
        <nav className={style.sideHeader}>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          />
          <ul className={style.navUl}>
            <div className={style.footDesc}>
              <div className={style.footDesc1}>
                <li className={style.navLi}>
                  <NavLink to="/student/About">About</NavLink>
                </li>
                <li className={style.navLi}>
                  <NavLink to="/student/blog">Blog</NavLink>
                </li>
                <li className={style.navLi}>
                  <NavLink to="/student/jobs">Jobs</NavLink>
                </li>
              </div>

              <div className={style.footDesc2}>
                <li className={style.navLi}>
                  <NavLink to="/student/press">Press</NavLink>
                </li>
                <li className={style.navLi}>
                  <NavLink to="/student/accessibility">Accessibility</NavLink>
                </li>
                <li className={style.navLi}>
                  <NavLink to="/student/partners">Partners</NavLink>
                </li>
              </div>
            </div>

            <div className={style.footLogos}>
              <li className={style.navLi}>
                <NavLink to="/student/materials">
                  <span class="material-symbols-outlined">rss_feed</span>
                </NavLink>
              </li>
              <li className={style.navLi}>
                <NavLink to="/student/upload-materials">
                  <span class="material-symbols-outlined">rss_feed</span>
                </NavLink>
              </li>
              <li className={style.navLi}>
                <NavLink to="/student/encouragements">
                  <span class="material-symbols-outlined">upload</span>
                </NavLink>
              </li>
              <li className={style.navLi}>
                <NavLink to="/student/upload-encouragements">
                  <span class="material-symbols-outlined">upload</span>
                </NavLink>
              </li>
              <li className={style.navLi}>
                <NavLink to="/student/settings">
                  <span class="material-symbols-outlined">settings</span>
                </NavLink>
              </li>
            </div>

            <div className={style.footCopy}>
              <p className={style.navLi}>
                {" "}
                @ 2025 Math Learning Platform, Inc. All rights reserved.
              </p>
            </div>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Footer;
