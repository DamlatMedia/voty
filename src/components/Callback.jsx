import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (code) {
      // Send code to the backend for token exchange
      fetch("/api/auth/exchange", {
        method: "POST",
        body: JSON.stringify({ code, state }),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Assuming the backend sends back user data along with the token
            const { username, email, password, provider } = data.userData;
            registerOrLoginUser({ username, email, password, provider });
          } else {
            alert("Authentication failed");
          }
        });
    } else {
      alert("Authorization code not received");
    }
  }, [navigate]);

  const registerOrLoginUser = async (userData) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Failed to register or login");

      const data = await response.json();
      navigate("/dashboard");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return <p>Processing authentication...</p>;
};

export default AuthCallback;
