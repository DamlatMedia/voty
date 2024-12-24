import style from "../studentStyles/authentication.module.css";
import React, { useState, useContext } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner"; // Import spinner
import TextInput from "../../components/TextInput";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../components/UserContext";
import logo from "../studentAssests/logo.jpg";
// import logos from "../studentAssests/IES1.png";

const StudentLogin = () => {
  const { setUsername } = useContext(UserContext); // Access UserContext
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const navigate = useNavigate();

  // Validation schema for Formik
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/student/login",
        values
      );

      const { studentData, authToken: token } = response.data;

      if (token && studentData.username) {
        // Save token and username in localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("username", studentData.username);

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
      <div className={style.dashboard}>
        <div className={style.settings}>
          <div className={style.login}>
            <div className={style.logoHead}>
              {/* <div> */}
              <img src={logo} alt="Logo 1" />
              {/* <img src={logos} alt="Logo 2" /> */}
              {/* </div> */}
              <h1>Voty</h1>
            </div>

            <h1 className={style.welcome}>Welcome back.</h1>
            <p className={style.welcome}>
              Stay ahead. Sign Up or Sign In right now.
            </p>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <div>
                  <Form>
                    {/* Email Input */}
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
                          top: "66%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                        }}
                      >
                        {showPassword ? "👁️" : "🙈"}
                      </span>

                    </div>

                    {/* Register Link */}
                    <span className={style.option}>
                      <h3 className={style.register}>Don't Have An Account?</h3>
                      <h3 className={style.register}>
                        <NavLink to="/student/register">Register</NavLink>
                      </h3>
                    </span>
                    <div className={style.btn}>
                      {/* Submit Button */}
                      <button
                        type="submit"
                        // className={style.button}
                        className={style.btnFeedback}
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
