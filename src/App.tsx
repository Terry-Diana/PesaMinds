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

const App: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        navigate("/login");
      }
    };

    checkUser();
  }, [navigate]);

  return (
    <div className="App">
      <Header />
      <Sidebar />
      <div className="main-content">
        <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/blogs" element={<Blogs />} />
          {/* Add more routes if needed */}
        </Routes>
      </div>
    </div>
  );
};

export default App;
