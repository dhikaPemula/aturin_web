// "use client"

// import { useState } from "react"
// import Login from "./ui/Login"
// import Register from "./ui/Register"
// import ForgotPassword from "./ui/ForgotPassword"
// import ResetPassword from "./ui/ResetPassword"
// import Header from "../landing_page/application/header";
// import "./App.css"

// function App() {
//   const [currentView, setCurrentView] = useState("login")

//   const handleView = (view) =>{
//     setCurrentView(view);
//   }

//   const renderView = () => {
//     switch (currentView) {
//       case "login":
//         return <Login onSwitchView={setCurrentView} />
//       case "register":
//         return <Register onSwitchView={setCurrentView} />
//       case "forgot-password":
//         return <ForgotPassword onSwitchView={setCurrentView} />
//       case "reset-password":
//         return <ResetPassword onSwitchView={setCurrentView} />
//       default:
//         return <Login onSwitchView={setCurrentView} />
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-auth flex items-center justify-center p-4 sm:p-6 md:p-8">
//       {renderView()}
//     </div>
//   )
// }

// export default App
