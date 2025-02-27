import React, { useContext, useState, useEffect, useCallback } from "react";
import "../../App.css";
import { User } from "../adminComponents/User"; // component display user (see detail on /example directory)
import {
  LoginSocialGoogle,
  LoginSocialAmazon,
  LoginSocialFacebook,
  LoginSocialGithub,
  LoginSocialInstagram,
  LoginSocialLinkedin,
  LoginSocialMicrosoft,
  LoginSocialPinterest,
  LoginSocialTwitter,
  LoginSocialApple,
  LoginSocialTiktok,
} from "reactjs-social-login";

// CUSTOMIZE ANY UI BUTTON
import {
  FacebookLoginButton,
  GoogleLoginButton,
  GithubLoginButton,
  AmazonLoginButton,
  InstagramLoginButton,
  LinkedInLoginButton,
  MicrosoftLoginButton,
  TwitterLoginButton,
  AppleLoginButton,
} from "react-social-login-buttons";

import { ReactComponent as PinterestLogo } from "../adminAssests/Pinterest-logo.svg";
import { ReactComponent as TiktokLogo } from "../adminAssests/Tiktok_icon.svg";
import style from "../adminStyles/authentication.module.css";
import { TailSpin } from "react-loader-spinner"; // Import spinner
import TextInput from "../../components/TextInput";
import { UserContext } from "../../components/UserContext";
import { NavLink } from "react-router-dom";
// import React, { useContext, useCallback, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

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
      .matches(/\d/, "Password must contain at least one digit")
      .matches(/[@$!%*?&]/, "Password must contain at least one special character")
  });
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [setUsername]); // Add dependency
  
  // useEffect(() => {
  //   const storedUsername = localStorage.getItem("username");
  //   if (storedUsername) {
  //     setUsername(storedUsername);
  //   }
  // }, []); // This will run only once when the component mounts

  // Handle form submission
 
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // const API_URL = process.env.REACT_APP_API_URL;
      // const response = await axios.post(`${API_URL}/user/register`, values); // use values directly from Formik

      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const response = await axios.post(
        `${API_BASE_URL}/admin/register`,
        // const response = await axios.post(
        //   "http://localhost:4000/admin/register",
        values
      );

      console.log(response.data);
      // Save username globally using UserContext
      setUsername(values.username);

      // Display success message using toastify
      toast.success("Registration successful", { autoClose: 2000 });
      // Redirect to the login page after a short delay
      setTimeout(() => {
        navigate("/admin/login");
      }, 2000); // Delay for 2 seconds before redirecting
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong! Please try again.");
      }
      
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
    window.location.href = "/admin/home";
  };

  const handleLoginReject = (error) => {
    console.error("Login failed:", error);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className={style.dashboard}>
        <div className={style.settings}>
          <div className={style.login}>
            <div>
              <h1>Register</h1>
            </div>

            <Formik
              initialValues={{ username: "", email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div>
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
                    <ErrorMessage
                      name="password"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>

                  <span className={style.option}>
                    <h3 className={style.register}>
                      Already Have An Account?{" "}
                    </h3>
                    <p className={style.register}>
                      {" "}
                      <NavLink to="/admin/login">Login</NavLink>{" "}
                    </p>
                  </span>

                  <button
                    type="submit"
                    className={style.button}
                    aria-label="Register"
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
                      "REGISTER"
                    )}
                  </button>
                </Form>
              )}
            </Formik>

            <ToastContainer />
          </div>
        </div>
      </div>

      {provider && profile ? (
        <User
          provider={provider}
          profile={profile}
          onLogout={onLogoutSuccess}
        />
      ) : (
        <div className={`App ${provider && profile ? "hide" : ""}`}>
          <h1 className="title">or sign up with</h1>

          <LoginSocialFacebook
            isOnlyGetToken
            appId={process.env.REACT_APP_FB_APP_ID || ""}
            onLoginStart={onLoginStart}
            onResolve={handleLoginResolve}
            onReject={handleLoginReject}
          >
            <FacebookLoginButton />
          </LoginSocialFacebook>

          <LoginSocialGoogle
            isOnlyGetToken
            client_id={process.env.REACT_APP_GG_APP_ID || ""}
            onLoginStart={onLoginStart}
            onResolve={handleLoginResolve}
            onReject={handleLoginReject}
          >
            <GoogleLoginButton />
          </LoginSocialGoogle>

          <LoginSocialInstagram
            isOnlyGetToken
            client_id={process.env.REACT_APP_INSTAGRAM_APP_ID || ""}
            client_secret={process.env.REACT_APP_INSTAGRAM_APP_SECRET || ""}
            redirect_uri={REDIRECT_URI}
            onLoginStart={onLoginStart}
            onResolve={handleLoginResolve}
            onReject={handleLoginReject}
          >
            <InstagramLoginButton />
          </LoginSocialInstagram>

          <LoginSocialMicrosoft
            isOnlyGetToken
            client_id={process.env.REACT_APP_MICROSOFT_APP_ID || ""}
            redirect_uri={REDIRECT_URI}
            onLoginStart={onLoginStart}
            onResolve={handleLoginResolve}
            onReject={handleLoginReject}
          >
            <MicrosoftLoginButton />
          </LoginSocialMicrosoft>

          <LoginSocialLinkedin
            isOnlyGetToken
            client_id={process.env.REACT_APP_LINKEDIN_APP_ID || ""}
            client_secret={process.env.REACT_APP_LINKEDIN_APP_SECRET || ""}
            redirect_uri={REDIRECT_URI}
            onLoginStart={onLoginStart}
            onResolve={handleLoginResolve}
            onReject={handleLoginReject}
          >
            <LinkedInLoginButton />
          </LoginSocialLinkedin>

          <LoginSocialGithub
            isOnlyGetToken
            client_id={process.env.REACT_APP_GITHUB_APP_ID || ""}
            client_secret={process.env.REACT_APP_GITHUB_APP_SECRET || ""}
            redirect_uri={REDIRECT_URI}
            onLoginStart={onLoginStart}
            onResolve={handleLoginResolve}
            onReject={handleLoginReject}
          >
            <GithubLoginButton />
          </LoginSocialGithub>

          <LoginSocialTwitter
            isOnlyGetToken
            client_id={process.env.REACT_APP_TWITTER_V2_APP_KEY || ""}
            redirect_uri={REDIRECT_URI}
            onLoginStart={onLoginStart}
            onResolve={handleLoginResolve}
            onReject={handleLoginReject}
          >
            <TwitterLoginButton />
          </LoginSocialTwitter>

          {/* <LoginSocialApple
            client_id={process.env.REACT_APP_APPLE_ID || ''}
            scope={'name email'}
            redirect_uri={REDIRECT_URI}
            onLoginStart={onLoginStart}
            onResolve={({ provider, data }) => {
              setProvider(provider);
              setProfile(data);
            }}
            onReject={err => {
              console.log(err);
            }}
          >
            <AppleLoginButton />
          </LoginSocialApple> */}

          {/* <LoginSocialAmazon
            isOnlyGetToken
            client_id={process.env.REACT_APP_AMAZON_APP_ID || ''}
            redirect_uri={REDIRECT_URI}
            onResolve={({ provider, data }) => {
              setProvider(provider)
              setProfile(data)
            }}
            onReject={(err) => {
              console.log(err)
            }}
            onLoginStart={onLoginStart}
          >
            <AmazonLoginButton />
          </LoginSocialAmazon> */}

          {/* <LoginSocialPinterest
            isOnlyGetToken
            client_id={process.env.REACT_APP_PINTEREST_APP_ID || ''}
            client_secret={process.env.REACT_APP_PINTEREST_APP_SECRET || ''}
            redirect_uri={REDIRECT_URI}
            onLoginStart={onLoginStart}
            onResolve={({ provider, data }) => {
              setProvider(provider)
              setProfile(data)
            }}
            onReject={(err) => {
              console.log(err)
            }}
            className='pinterest-btn'
          >
            <div className='content'>
              <div className='icon'>
                <PinterestLogo />
              </div>
              <span className='txt'>Login With Pinterest</span>
            </div>
          </LoginSocialPinterest> */}

          {/* <LoginSocialTiktok
            client_key={process.env.REACT_APP_TIKTOK_CLIENT_KEY}
            redirect_uri={REDIRECT_URI}
            onLoginStart={onLoginStart}
            onResolve={({ provider, data }) => {
              setProvider(provider);
              setProfile(data);
            }}
            onReject={(err) => {
              console.log(err);
            }}
            className="pinterest-btn"
          >
            <div className="content">
              <div className="icon">
                <TiktokLogo />
              </div>
              <span className="txt">Login With Tiktok</span>
            </div>
          </LoginSocialTiktok> */}
        </div>
      )}
    </>
  );
}

export default Register;
