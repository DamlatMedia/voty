import React, { useContext, useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import style from "../styles/Register.module.css";
import { NavLink } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
      await axios.post(
        `${API_BASE_URL}/student/forgot-password`, { email });
        // `http://localhost:4000/user/forgot-password`, { email });
      toast.success("Check your email for reset instructions.");
      //  setEmail(""); // Clear input after successful request
    } catch (error) {
      // toast.error(
      //   error.response?.data?.message || "Error sending reset email."
      // );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />{" "}
      {/* Toast Notifications */}
      <div className={style.register}>
        <div className={style.Para}>
          <p className={style.cardTitle}>Reset your password</p>
          <p>
            Enter your registered email address, and we’ll send you password
            reset instructions.
          </p>
        </div>

        <form action="" className={style.action} onSubmit={handleSubmit}>
          <div className={style.input}>
            <label htmlFor="" className={style.registered}>
              Enter Your Registered Email: 
            </label>
          
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={style.inputs}
              placeholder="Input Your Registered Email Address"
            />
          </div>

          <button className={style.investConsult4}>
          {loading ? "Submitting..." : "Submit"}
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

export default ForgotPassword;
