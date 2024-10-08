import React, { useState, useEffect } from "react";
import { supabase } from "./Services/supabaseClient";
import {
  BrowserRouter as Router,
  Route,
  useNavigate,
  Routes,
} from "react-router-dom";
import Header from "./Components/Header/Header";
import Sidebar from "./Components/Sidebar/Sidebar";
import Reports from "./Pages/Reports/Reports";
import Blogs from "./Pages/Blogs/Blogs";
import Home from "./Pages/Home/Home";
import Login from "./Components/Auth/Login/Login";
import SignUp from "./Components/Auth/SignUp/SignUp";
import Recaptcha from "./Components/Recaptcha/Recaptcha";

const App: React.FC = () => {
  const navigate = useNavigate();
  const [captchaVerified, setCaptchaVerified] = useState(false); // State to track CAPTCHA verification

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentPath = window.location.pathname;
        if (!session?.user && currentPath !== "/signup") {
          navigate("/login");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Function to handle CAPTCHA verification
  const handleCaptchaVerified = (verified: boolean) => {
    setCaptchaVerified(verified);
  };

  return (
    <div className="App">
      <Header />
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login captchaVerified={captchaVerified} />} />
          <Route path="/signup" element={<SignUp captchaVerified={captchaVerified} />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/blogs" element={<Blogs />} />
          {/* If no route matches, redirect to home */}
          <Route path="*" element={<Home />} />
        </Routes>
        <Recaptcha onCaptchaVerified={handleCaptchaVerified} /> {/* Pass the handler function */}
      </div>
    </div>
  );
};

export default App;
