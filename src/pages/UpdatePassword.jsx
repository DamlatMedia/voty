import React, { useContext, useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import style from "../styles/Register.module.css";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation(); // Access the query params
  const navigate = useNavigate(); // For navigation after success

  // Extract the token and email from the query string
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const email = params.get("email");

  useEffect(() => {
    // Redirect if the token or email is missing
    if (!token || !email) {
      setError("Invalid or expired token.");
    }
  }, [token, email]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Send reset password request to the backend
      // Log the token from URL to verify it's being sent correctly
      console.log("Token from URL:", token);

      console.log("Extracted email:", email);

      // const response = await axios.post('http://localhost:7000/user/reset-password', {
      //   token,
      //   email,
      //   newPassword,
      // });
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const response = await axios.post(
        `${API_BASE_URL}/student/reset-password`,
        // `http://localhost:4000/user/reset-password`,
        { token, email, newPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Token from URL:", token); // Log token to verify

      if (response.data.status === "success") {
        setMessage(response.data.message);
        toast.success(response.data.message);
        // Redirect to login page after success

        setTimeout(() => navigate("/student/login"), 2000);
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resetting password.");
    }

    setLoading(false);
  };

  return (
    <div className="reset-password-form">
      <h2>Reset Your Password</h2>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {/* Toast container for showing success/error messages */}
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;
