import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../Services/supabaseClient";
import "./Login.css";

interface LoginProps {
  captchaVerified: boolean; // Accept captchaVerified prop
}

const Login: React.FC<LoginProps> = ({ captchaVerified }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const errorRef = useRef<HTMLParagraphElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (errorRef.current && error) {
      gsap.fromTo(
        errorRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    }
  }, [error]);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setSuccess(false);
      gsap.fromTo(
        errorRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    } else {
      setError(null);
      setSuccess(true);
      gsap.fromTo(
        ".success-message",
        { opacity: 0 },
        { opacity: 1, duration: 1 }
      );
      setTimeout(() => navigate("/home"), 2000);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} disabled={!captchaVerified}>Login</button> {/* Disable if captcha is not verified */}
      {error && (
        <p ref={errorRef} className="error-message">{error}</p>
      )}
      {success && (
        <p className="success-message">Login successful! Redirecting...</p>
      )}
      <p className="signup-message">
        Do not have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
