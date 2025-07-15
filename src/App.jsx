import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./features/landing_page/ui/LandingPage.jsx";
import AuthPage from "./features/auth/AuthPage.jsx";
import HomePage from "./features/home_page/ui/screen/home_page.jsx";
import TaskPage from "./features/task_page/ui/screen/task_page.jsx";
import ActivityPage from "./features/activity/ui/screen/activity_page.jsx";
import Header from "./core/widgets/header/header.jsx";
import ProtectedRoute from "./core/auth/ProtectedRoute.jsx";
import { AuthProvider } from "./core/auth/AuthContext.jsx";
import { DragDropContext } from "@hello-pangea/dnd";
import React, { useState, useEffect } from "react";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const routeToIndex = {
    "/home": 0,
    "/task": 1,
    "/activity": 2,
  };

  useEffect(() => {
    const newIndex = routeToIndex[location.pathname] ?? 0;
    setCurrentIndex(newIndex);
  }, [location.pathname]);

  const isAuthPage =
    location.pathname.startsWith("/auth") || location.pathname === "/";

  return (
    <>
      {/* Show Header & Swipable Pages only on authenticated routes */}
      {isAuthPage ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/auth/login"
            element={<AuthPage initialView="login" />}
          />
          <Route
            path="/auth/register"
            element={<AuthPage initialView="register" />}
          />
          <Route
            path="/auth/forgot-password"
            element={<AuthPage initialView="forgot-password" />}
          />
          <Route
            path="/auth/reset-password"
            element={<AuthPage initialView="reset-password" />}
          />
        </Routes>
      ) : (
        <ProtectedRoute>
          <DragDropContext>
            <Header
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
            <div className="h-[20vh]" />
            <div
              className="overflow-hidden w-full"
              style={{ margin: 0, padding: 0 }}
            >
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 33.333}%)`,
                  width: "300%",
                  margin: 0,
                  padding: 0,
                }}
              >
                <div style={{ width: "33.333%", flexShrink: 0 }}>
                  <Routes>
                    <Route path="/home" element={<HomePage />} />
                  </Routes>
                </div>
                <div style={{ width: "33.333%", flexShrink: 0 }}>
                  <Routes>
                    <Route path="/task" element={<TaskPage />} />
                  </Routes>
                </div>
                <div style={{ width: "33.333%", flexShrink: 0 }}>
                  <Routes>
                    <Route path="/activity" element={<ActivityPage />} />
                  </Routes>
                </div>
              </div>
            </div>
          </DragDropContext>
        </ProtectedRoute>
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
