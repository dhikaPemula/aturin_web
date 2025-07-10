"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "../services/authService";
import { AturinIcon } from "../../../assets/landing_page/icon.jsx";

// Heroicons components
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

const ArrowLeftIcon = ({ className }) => (
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
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);

const ForgotPassword = ({ onSwitchView }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isKirimClicked, setIsKirimClicked] = useState(false);

 const handleKirimClick = () => {
  setIsKirimClicked(true);
    setTimeout(() => setIsKirimClicked(false), 100);
 }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await sendPasswordResetEmail(email);
      console.log(response);
      setIsEmailSent(true);
    } catch (error) {
      console.error("Failed to send reset email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <img src={AturinIcon} />
          </div>
          <h1 className="text-2xl font-semibold text-blue-500 ml-2">Aturin</h1>
        </div>

        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <EnvelopeIcon className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Email Terkirim!
          </h2>
          <p className="text-sm text-gray-600">
            Kami telah mengirimkan link reset password ke email Anda. Silakan
            cek inbox atau folder spam.
          </p>
        </div>

        <button
          onClick={() => onSwitchView("login")}
          className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 bg-white"
        >
          Kembali ke Login
        </button>
      </div>
    );
  }

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
          Lupa Kata Sandi?
        </h2>
        <p className="text-sm text-gray-600">
          Masukkan email Anda, kami akan kirimkan link untuk reset kata sandi.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-700 hover:bg-blue-700 ${
            isKirimClicked ? "pb-0 mt-1" : "pb-1 mt-0"
          } text-white font-medium rounded-2xl`}
          onClick={handleKirimClick}
        >
          <div className="bg-blue-500 py-3 px-4 rounded-2xl">
            {isLoading ? "Mengirim..." : "Kirim Link Reset"}
          </div>
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Kami akan kirimkan notifikasi email! Kami siap.
          </p>

          <button
            type="button"
            onClick={() => onSwitchView("login")}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Kembali ke Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
