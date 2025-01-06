import React, { useContext, useState, useEffect, useCallback } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ToastContainer, toast } from "react-toastify";
import { User } from "../studentComponent/User"; // component display user (see detail on /example directory)
import { TailSpin } from "react-loader-spinner"; // Import spinner
import { UserContext } from "../../components/UserContext";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TextInput from "../../components/TextInput";
import style from "../studentStyles/authentication.module.css";
import * as Yup from "yup";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "../../App.css";

import { LoginSocialGoogle, LoginSocialFacebook } from "reactjs-social-login";

// REDIRECT URL must be same with URL where the (reactjs-social-login) components is locate
// MAKE SURE the (reactjs-social-login) components aren't unmounted or destroyed before the ask permission dialog closes
// const REDIRECT_URI = window.location.href;
// Set a fixed redirect URI
const REDIRECT_URI = `${window.location.origin}/auth/callback`;

function Register() {
  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState(null);

  const { setUsername } = useContext(UserContext); // Access setUsername from UserContext

  // State to track password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  // Hook to navigate programmatically
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .min(5, "Username must be at least 5 characters"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/\d/, "Password must contain at least one digit"),
  });

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []); // This will run only once when the component mounts

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/student/register",
        values
      );

      console.log(response.data);
      // Save username globally using UserContext
      setUsername(values.username);
      // localStorage.setItem('username', response.data.username); // Save to localStorage
      // setUsername(response.data.username);

      // Display success message using toastify
      toast.success("Registration successful", { autoClose: 2000 });
      // Redirect to the login page after a short delay
      setTimeout(() => {
        navigate("/student/login");
      }, 2000); // Delay for 2 seconds before redirecting
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed!");
      console.log("Submitting data:", values);
      //   handleApiError(error, setErrors); // Pass setErrors to handle API validation errors
    } finally {
      setSubmitting(false); // Reset the form submission state
    }
  };

  const onLoginStart = useCallback(() => {
    alert("login start");
  }, []);

  const onLogoutSuccess = useCallback(() => {
    setProfile(null);
    setProvider("");
    alert("Logged out successfully");
  }, []);

  const handleLoginResolve = ({ provider, data }) => {
    setProvider(provider);
    setProfile(data);

    // Redirect to dashboard after processing login
    window.location.href = "/student/home";
  };

  const handleLoginReject = (error) => {
    console.error("Login failed:", error);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleRePasswordVisibility = () => setShowRePassword(!showRePassword);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=visibility"
      />
      <div className={style.dashboard}>
        <div className={style.settings}>
          <div className={style.login}>
            <h1 className={style.sign}>Sign Up</h1>

            <span className={style.option}>
              <h3 className={style.register}>Already Have An Account? </h3>
              <h3 className={style.register}>
                {" "}
                <NavLink to="/student/login">Login</NavLink>{" "}
              </h3>
            </span>

            <Formik
              initialValues={{ username: "", email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div>
                    <h4 className={style.label}>Username</h4>
                    <Field
                      type="text"
                      name="username"
                      component={TextInput}
                      placeholder="Username"
                      ariaLabel="Enter Your Username"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>

                  <div>
                    <h4 className={style.label}>Email Address</h4>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email"
                      component={TextInput}
                      ariaLabel="Enter Your Email Address"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>

                  <div>
                    <h4 className={style.label}>Phone Number</h4>
                    <Field
                      type="number"
                      name="number"
                      placeholder="Phone Number"
                      component={TextInput}
                      ariaLabel="Enter Your Phone Number"
                    />
                    <ErrorMessage
                      name="number"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>

                  <div>
                    <div
                      className={style.textInputs}
                      style={{ position: "relative" }}
                    >
                      <h4 className={style.label}>Password</h4>
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        component={TextInput}
                        style={{ position: "relative" }}
                        ariaLabel="Enter Your Password"
                      />

                      <span
                        onClick={togglePasswordVisibility}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "80%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                        }}
                      >
                        <span className="material-symbols-outlined">
                          {showPassword ? "visibility" : "🙈"}
                        </span>
                      </span>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>

                  {/* Re-enter Password Field */}
                  <div>
                    <div
                      className={style.textInputs}
                      style={{ position: "relative" }}
                    >
                      <h4 className={style.label}>Re-enter Password</h4>
                      <Field
                        type={showRePassword ? "text" : "password"}
                        name="repassword"
                        placeholder="Re-enter Password"
                        component={TextInput}
                        style={{ position: "relative" }}
                        ariaLabel="Re-enter Your Password"
                      />

                      <span
                        onClick={toggleRePasswordVisibility}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "80%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                        }}
                      >
                        <span className="material-symbols-outlined">
                          {showRePassword ? "visibility" : "visibility"}
                        </span>
                      </span>
                    </div>
                    <ErrorMessage
                      name="repassword"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>

                  <div className={style.btn}>
                    <button
                      type="submit"
                      className={style.btnFeedback}
                      aria-label="Sign Up"
                      disabled={isSubmitting}
                    >
                      {/* REGISTER */}
                      {/* {isSubmitting ? <span className="spinner"></span> : "REGISTER"} */}
                      {isSubmitting ? (
                        <TailSpin // Use react-loader-spinner
                          height="20"
                          width="20"
                          color="#fff"
                          ariaLabel="loading"
                        />
                      ) : (
                        "Sign Up"
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            <ToastContainer />

            <div className={style.hrsign}>
              <hr className={style.horiz} />
              <p>Or sign up with</p>
              <hr className={style.horiz} />
            </div>

            {provider && profile ? (
              <User
                provider={provider}
                profile={profile}
                onLogout={onLogoutSuccess}
              />
            ) : (
              <div className={style.socials}>
                <LoginSocialGoogle
                  isOnlyGetToken
                  client_id={process.env.REACT_APP_GG_APP_ID || ""}
                  onLoginStart={onLoginStart}
                  onResolve={handleLoginResolve}
                  onReject={handleLoginReject}
                >
                  <div className={style.social}>
                    <img
                      src="/images/Google.png"
                      alt="Googl"
                      className={style.socio}
                    />
                    <p>Google</p>
                  </div>
                  {/* <GoogleLoginButton /> */}
                </LoginSocialGoogle>

                <LoginSocialFacebook
                  isOnlyGetToken
                  appId={process.env.REACT_APP_FB_APP_ID || ""}
                  onLoginStart={onLoginStart}
                  onResolve={handleLoginResolve}
                  onReject={handleLoginReject}
                >
                  <div className={style.social}>
                    <img
                      src="/images/FB.png"
                      alt="FB"
                      className={style.socio}
                    />
                    <p>Facebook</p>
                  </div>
                  {/* <FacebookLoginButton /> */}
                </LoginSocialFacebook>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
