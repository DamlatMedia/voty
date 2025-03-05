import React, { useContext, useState, useEffect, useCallback } from "react";

import { User } from "../components/User";
import { LoginSocialGoogle, LoginSocialFacebook } from "reactjs-social-login";
// import style from "../styles/authentication.module.css"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import style from "../styles/Register.module.css";
import { NavLink } from "react-router-dom";

function Login() {
  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState(null);
  // State to track password visibility
  const [showPassword, setShowPassword] = useState(false);

  const onLoginStart = useCallback(() => {
    alert("login start");
  }, []);

  const onLogoutSuccess = useCallback(() => {
    setProfile(null);
    setProvider("");
    alert("Logged out successfully");
  }, []);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginResolve = ({ provider, data }) => {
    setProvider(provider);
    setProfile(data);

    // Redirect to dashboard after processing login
    window.location.href = "/";
  };

  const handleLoginReject = (error) => {
    console.error("Login failed:", error);
  };
  return (
    <>
      <div className={style.register}>
        <div className={style.Para}>
        <div className={style.logoH}>
        <NavLink to="/">
          <img
            src="./images/gVestLogo.png"
            alt="gVest Logo"
            className={style.logo}
          />
        </NavLink>
      </div>
          <p className={style.cardTitle}>Email Verification</p>
          <p>Enter your registered email address, and we’ll send you password reset instructions.</p>
        </div>

        <form action="" className={style.action}>
          <div className={style.input}>
            <label htmlFor="" className={style.registered}>Registered Email</label>
            <input
              type="email"
              required
              className={style.inputs}
              placeholder="Input Your Email"
            />
          </div>


          
          <button className={style.investConsult4}>
            <NavLink to="/">Submit</NavLink>{" "}
          </button>

          <button className={style.investConsult3}>
            <NavLink to="/">Back To Login</NavLink>{" "}
          </button>
        </form>

    

        <div className={style.linav1}>
          <p className={style.vest}>@ 2024 Gvest. Alrights reserved. </p>

          <div className={style.navUl}>
            <li className={style.navLi}>
              <NavLink to="/t&c">Terms & Condition</NavLink>
            </li>
            <li className={style.navLi}>
              <NavLink to="/privacy-policy">Privacy Policy</NavLink>
            </li>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
