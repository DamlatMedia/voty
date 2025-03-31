import style from "../studentStyles/authentication.module.css";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner"; // Import spinner
import TextInput from "../../components/TextInput";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../components/UserContext";
import { User } from "../studentComponent/User"; // component display user (see detail on /example directory)
import { LoginSocialGoogle, LoginSocialFacebook } from "reactjs-social-login";

const StudentLogin = () => {
  const { setUsername } = useContext(UserContext); // Access UserContext
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // Validation schema for Formik
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

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
    window.location.href = "/student/dashboard";
  };

  const handleLoginReject = (error) => {
    console.error("Login failed:", error);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const response = await axios.post(
        `${API_BASE_URL}/student/login`,
        values
      );
 
      console.log("Login response:", response.data); // Debugging

      const { studentData, authToken: token } = response.data;

      if (token && studentData.username) {
        // Save token and username in localStorage

        localStorage.setItem("authToken", token);
        localStorage.setItem("username", studentData.username);
        localStorage.setItem("email", studentData.email);

        localStorage.setItem("studentId", studentData._id);

        // Assume studentData contains the ageCategory field
        if (studentData.ageCategory) {
          localStorage.setItem("ageCategory", studentData.ageCategory);
        }
        // Update context
        setUsername(studentData.username);
        toast.success("Login successful!", { autoClose: 2000 });

        // Navigate to dashboard
        setTimeout(() => {
          navigate("/student/dashboard");
        }, 3000);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed! Please check your credentials.");
    } finally {
      setSubmitting(false); // Reset the form submission state
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />

      <div className={style.dashboard}>
        <div className={style.settings}>
          <div className={style.login1}>
            <h1 className={style.sign}>Welcome Back!</h1>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <div>
                  <Form>
                    <div>
                      <h4 className={style.label}>Email Address</h4>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        component={TextInput}
                        ariaLabel="Enter Your Email Address"
                      />
                    </div>

                    {/* Password Input with Visibility Toggle */}
                    <div style={{ position: "relative" }}>
                      <h4 className={style.label}>Password</h4>

                      <Field
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        component={TextInput}
                        ariaLabel="Enter Your Password"
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "75%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                        }}
                      >
                        <span className="material-symbols-outlined">
                          {showPassword ? "visibility" : "visibility_off"}
                        </span>
                      </span>
                    </div>

                    
                    <div className={style.forgt}>
                  <div className={style.checkme}>
                    <input type="checkbox" name="" id="" />
                    <p>Remember Me</p>
                  </div>

                  <li className={style.navLi}>
                    <NavLink to="/forgot-password">Forgot Password</NavLink>
                  </li>
                </div>

                    <div className={style.btn}>
                      {/* Submit Button */}
                      <button
                        type="submit"
                        className={style.btnFeedback1}
                        aria-label="Login"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <TailSpin
                            height="20"
                            width="20"
                            color="#fff"
                            ariaLabel="loading"
                          />
                        ) : (
                          "LOGIN"
                        )}
                      </button>
                    </div>

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
                        </LoginSocialFacebook>
                      </div>
                    )}

                    {/* Register Link */}
                    <span className={style.option1}>
                      <h3 className={style.register}>Don't Have An Account?</h3>
                      <h3 className={style.register}>
                        <NavLink to="/student/register">Sign Up</NavLink>
                      </h3>
                    </span>

                  </Form>
                </div>
              )}
            </Formik>
          </div>
        </div>

        <ToastContainer />
      </div>
    </>
  );
};

export default StudentLogin;
