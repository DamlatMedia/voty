import style from "../adminStyles/authentication.module.css";
import React, { useState, useContext } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner"; // Import spinner
import TextInput from "../../components/TextInput";
import "react-toastify/dist/ReactToastify.css";
import { useAdmin } from "../../components/AdminContext";
const App = () => {
  const { setUsername } = useContext(useAdmin);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const response = await axios.post(`${API_BASE_URL}/admin/login`, values);
      const { adminData, authToken: token } = response.data;

      if (token && adminData.username) {
        // Store the token and username in localStorage
        localStorage.setItem("adminAuthToken", token);
        localStorage.setItem("adminUsername", adminData.username);

        setUsername(adminData.username);
        console.log(response.data);
        // console.log("Login successful, username:", adminData.username); // Double-check the username value

        toast.success("successful", { autoClose: 2000 });

        // Redirect to the admin dashboard after a short delay
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 3000); // Delay for 3 seconds before redirecting
      } else {
        throw new Error("Token is missing from the response.");
      }
    } catch (error) {
      // Handle errors, including missing token or network errors
      console.error("Login error:", error);
      toast.error("Login failed!");
      // handleApiError(error, setErrors);
      // handleApiError(error, setErrors); // Pass setErrors to handle API validation errors
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
        <div className={style.settings} onSubmit={handleSubmit}>
          <div className={style.login}>
            <div>
              <h1>Login</h1>
            </div>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
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

                  {/* Register Link */}
                  <span className={style.option}>
                    <h3 className={style.register}>Don't Have An Account?</h3>
                    <h3 className={style.register}>
                      <NavLink to="/admin/register">Sign Up</NavLink>
                    </h3>
                  </span>
                  
                  <button
                    type="submit"
                    className={style.button}
                    aria-label="Login"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <TailSpin // Use react-loader-spinner
                        height="20"
                        width="20"
                        color="#fff"
                        ariaLabel="loading"
                      />
                    ) : (
                      "LOGIN"
                    )}
                  </button>
                </Form>
              )}
            </Formik>

            <ToastContainer />
          </div>
        </div>
        {/* <div>{username ? <h2>Welcome back, {username}!</h2> : <></>}</div> */}
      </div>
    </>
  );
};

export default App;
