import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../Services/supabaseClient";
import Recaptcha from "../../Recaptcha/Recaptcha";
import "./SignUp.css";

interface SignUpProps {
  captchaVerified: boolean; 
  onCaptchaVerified: (verified: boolean) => void;
}

const SignUp: React.FC<SignUpProps> = ({ captchaVerified, onCaptchaVerified }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const errorRef = useRef<HTMLParagraphElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);
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

  useEffect(() => {
    if (messageRef.current && message) {
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

    if (!captchaVerified) {
      setError("Please complete the CAPTCHA.");
      return;
    }

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
      {error && <p ref={errorRef} className="error">{error}</p>}
      {message && <p ref={messageRef} className="message">{message}</p>}
      
      <Recaptcha onCaptchaVerified={onCaptchaVerified} />

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
      
      <button onClick={handleSignUp} disabled={!captchaVerified}>Sign Up</button>
      
      <p className="login-message">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignUp;
