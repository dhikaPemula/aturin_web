"use client";

import { AturinIcon } from "../../../../public/assets/landing_page/icon.jsx";
import { useState } from "react";
import { registerUser } from "../services/authService";
import { validatePassword } from "../application/passwordValidator";
import { useNavigate } from "react-router-dom";

// Heroicons components
const EyeIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const EyeSlashIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.243 4.243L9.88 9.88"
    />
  </svg>
);

const EnvelopeIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);

const LockClosedIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
    />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

const Register = ({ onSwitchView }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDaftarClicked, setIsDaftarClicked] = useState(false);
  const [isGoogleClicked, setIsGoogleClicked] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      setPasswordStrength(validatePassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Password tidak cocok!");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    try {
      await registerUser(formData);
      // Handle successful registration
      navigate("/auth/login");
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage(error.message || "Gagal mendaftar.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDaftarClick = () => {
    setIsDaftarClicked(true);
    setTimeout(() => setIsDaftarClicked(false), 100);
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    setIsGoogleClicked(true);
    setTimeout(() => setIsGoogleClicked(false), 100);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return "bg-red-500";
    if (passwordStrength.score <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return "Rendah";
    if (passwordStrength.score <= 3) return "Sedang";
    return "Kuat";
  };

  const getPasswordStrengthTextColor = () => {
    if (passwordStrength.score <= 2) return "text-red-600";
    if (passwordStrength.score <= 3) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <img src={AturinIcon} />
          </div>
          <h1 className="text-2xl font-semibold text-blue-500 ml-2">Aturin</h1>
        </div>
        <h2 className="text-2xl font-medium text-gray-800 mb-1">
          Selamat bergabung
        </h2>
        <p className="text-sm text-gray-600">
          Aturin siap bantu kamu, yuk mulai sekarang!
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button
          className="px-6 py-2 font-medium text-sm transition-colors duration-200 focus:outline-none flex-1 text-gray-600 hover:text-gray-800"
          onClick={() => onSwitchView("login")}
        >
          Masuk
        </button>
        <button className="px-6 py-2 font-medium text-sm transition-colors duration-200 focus:outline-none flex-1 bg-blue-500 text-white rounded-lg">
          Daftar
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="mb-4 text-red-600 text-sm bg-red-100 border border-red-300 rounded-lg px-4 py-2">
            {errorMessage}
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="name"
              placeholder="Nama"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kata Sandi
          </label>
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Kata Sandi"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Konfirmasi Kata Sandi
          </label>
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Kata Sandi"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Password Strength */}
        {formData.password && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Password strength</span>
              <span className={`font-medium ${getPasswordStrengthTextColor()}`}>
                {getPasswordStrengthText()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
              ></div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      formData.password.length >= 8
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <span className="text-xs text-gray-600">8+ karakter</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      /[A-Z]/.test(formData.password)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <span className="text-xs text-gray-600">
                    Huruf besar (A-Z)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      /[a-z]/.test(formData.password)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <span className="text-xs text-gray-600">Huruf kecil</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      /[0-9!@#$%^&*]/.test(formData.password)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <span className="text-xs text-gray-600">Simbol (1@#...)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          onClick={handleDaftarClick}
          className={`w-full bg-blue-700 hover:bg-blue-700 ${
            isDaftarClicked ? "pb-0 mt-1.5" : "pb-1.5 mt-0"
          } text-white font-medium rounded-2xl`}
        >
          <div className="bg-blue-500 py-3 px-4 rounded-2xl">
            {" "}
            {isLoading ? "Memuat..." : "Daftar"}
          </div>
        </button>

        {/* Divider */}
        <div className="relative flex items-center my-3">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-sm text-gray-500 font-medium">
            Atau
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className={`w-full border bg-gray-300 border-gray-300 rounded-2xl justify-center ${
            isGoogleClicked ? "pb-0 mt-1.5" : "pb-1.5 mt-0"
          }`}
        >
          <div className="w-full bg-white flex flex-row px-4 py-3 rounded-2xl items-center justify-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Lanjutkan dengan Google
          </div>
        </button>
      </form>
    </div>
  );
};

export default Register;
