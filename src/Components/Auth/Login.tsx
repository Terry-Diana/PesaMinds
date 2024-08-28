import React, { useState } from 'react';
import { supabase } from '../../Services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      gsap.fromTo('.error-message', { opacity: 0 }, { opacity: 1, duration: 1 });
    } else {
      gsap.fromTo('.success-message', { opacity: 0 }, { opacity: 1, duration: 1 });
      setTimeout(() => navigate('/'), 2000);
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
      <button onClick={handleLogin}>Login</button>
      {error && <p className="error-message">{error}</p>}
      <p className="success-message">Login successful! Redirecting...</p>
    </div>
  );
};

export default Login;
