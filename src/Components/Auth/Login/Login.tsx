import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../Services/supabaseClient";
import Recaptcha from "../../Recaptcha/Recaptcha";
import "./Login.css";

interface LoginProps {
  captchaVerified: boolean; 
  onCaptchaVerified: (verified: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ captchaVerified, onCaptchaVerified }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
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
    if (!captchaVerified) {
      setError("Please complete the CAPTCHA.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setError(null);
      navigate("/dashboard"); 
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p ref={errorRef} className="error">{error}</p>}

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

      <button onClick={handleLogin} disabled={!captchaVerified}>
        Login
      </button>

      <p className="signup-message">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
