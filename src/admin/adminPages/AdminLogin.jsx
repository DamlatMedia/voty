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
import { UserContext } from "../../components/UserContext";

const App = () => {
  const { username, setUsername } = useContext(UserContext); // Access UserContext

  // State to track password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Hook to navigate programmatically
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // const response = await axios.post('https://quiz-interfaces-backend.onrender.com/user/login', formData);
      
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const response = await axios.post(
        `${API_BASE_URL}/admin/login` ,
      // const response = await axios.post(
        // "http://localhost:4000/admin/login",
        values
      );
      const { adminData, authToken } = response.data;

      setUsername(adminData.username);
      console.log(response.data);
      console.log("Login successful, username:", adminData.username); // Double-check the username value

      const { authToken: token, username: storedUsername } = response.data;

      if (token) {
        // Store the token in localStorage
        localStorage.setItem("authToken", token);

        localStorage.setItem("username", storedUsername);

        toast.success("successful", { autoClose: 2000 });

        // Redirect to the admin dashboard after a short delay
        setTimeout(() => {
          navigate("/admin/home");
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
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
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email"
                      component={TextInput}
                      ariaLabel="Enter Your Email Address"
                    />
                  </div>

                  <div>
                    <div
                      className={style.textInputs}
                      style={{ position: "relative" }}
                    >
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
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                        }}
                      >
                        {showPassword ? "👁️" : "🙈"}
                      </span>
                    </div>
                  </div>

                  <span className={style.option}>
                    <h3 className={style.register}>Don't Have An Account? </h3>
                    <p className={style.register}>
                      {" "}
                      <NavLink to="/admin/register">Register</NavLink>{" "}
                    </p>
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
        <div>{username ? <h2>Welcome back, {username}!</h2> : <></>}</div>
      </div>
    </>
  );
};

export default App;
