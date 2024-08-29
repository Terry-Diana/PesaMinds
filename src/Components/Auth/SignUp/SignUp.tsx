// src/Components/Auth/SignUp.tsx
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../Services/supabaseClient";
import "./SignUp.css";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const errorRef = useRef<HTMLParagraphElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (errorRef.current) {
      gsap.fromTo(
        errorRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    }
  }, [error]);

  useEffect(() => {
    if (messageRef.current) {
      gsap.fromTo(
        messageRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    }
  }, [message]);

  const handleSignUp = async () => {
    setError(null);
    setMessage(null);

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Registration successful! Check your email to confirm details...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && (
        <p ref={errorRef} className="error">
          {error}
        </p>
      )}
      {message && (
        <p ref={messageRef} className="message">
          {message}
        </p>
      )}
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
      <button onClick={handleSignUp}>Sign Up</button>

      <p className="login-message">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignUp;
