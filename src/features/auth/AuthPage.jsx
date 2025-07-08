"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Login from "./ui/Login";
import Register from "./ui/Register";
import ForgotPassword from "./ui/ForgotPassword";
import ResetPassword from "./ui/ResetPassword";
import "./App.css";

function AuthPage({ initialView = "login" }) {
  const [currentView, setCurrentView] = useState(initialView);
  const navigate = useNavigate();
  const location = useLocation();

  // Update view based on URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/register")) {
      setCurrentView("register");
    } else if (path.includes("/forgot-password")) {
      setCurrentView("forgot-password");
    } else if (path.includes("/reset-password")) {
      setCurrentView("reset-password");
    } else {
      setCurrentView("login");
    }
  }, [location.pathname]);

  const handleView = (view) => {
    setCurrentView(view);

    // Update URL when view changes
    switch (view) {
      case "login":
        navigate("/auth/login");
        break;
      case "register":
        navigate("/auth/register");
        break;
      case "forgot-password":
        navigate("/auth/forgot-password");
        break;
      case "reset-password":
        navigate("/auth/reset-password");
        break;
      default:
        navigate("/auth/login");
    }
  };

  const renderView = () => {
    switch (currentView) {
      case "login":
        return <Login onSwitchView={handleView} />;
      case "register":
        return <Register onSwitchView={handleView} />;
      case "forgot-password":
        return <ForgotPassword onSwitchView={handleView} />;
      case "reset-password":
        return <ResetPassword onSwitchView={handleView} />;
      default:
        return <Login onSwitchView={handleView} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-auth flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* Bulatan-bulatan dekoratif */}
      <div className="fixed top-20 left-20 w-50 h-50 bg-blue-500 opacity-15 rounded-full blur-xl z-0"></div>
      <div className="fixed top-20 right-20 w-72 h-72 bg-blue-500 opacity-15 rounded-full blur-xl z-0"></div>
      <div className="fixed bottom-[-20px] left-40 w-60 h-60 bg-blue-500 opacity-15 blur-xl rounded-full "></div>
      {/* Konten utama */}

      {renderView()}
    </div>
  );
}

export default AuthPage;
