import {
  Icon4,
  Icon5,
  Icon6,
  Icon7,
  Icon8,
  Icon9,
  Icon10,
  Icon11,
  Icon12,
  GplayIcon,
} from "../../../../public/assets/landing_page/icon.jsx";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
      navigate("/auth/login");
    }, 100);
  };

  return (
    <>
      <section
        id="beranda"
        className="font-family-poppins relative py-40 px-6 text-center max-w-[1400px] mx-auto overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl mb-8 font-[500]">
            Waktumu <span className="italic text-yellow-500">Diaturin</span>,
            <br />
            <span className="italic text-blue-500">Hidupmu</span> Dibalikin
          </h1>

          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Aturin hadir sebagai teman setia untuk bantu kamu mengelola tugas,
            menata jadwal, dan menjaga ritme hidup tetap seimbang.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className={`bg-blue-700 border border-blue-700 rounded-xl ${
                isClicked ? "pb-0 mt-1" : "pb-1 mt-0"
              }`}
              onClick={handleClick}
            >
              <div className="bg-blue-500 text-white rounded-xl px-6 py-2 hover:bg-blue-500">
                Coba Sekarang
              </div>
            </button>
            <div>
              <img src={GplayIcon} />
            </div>
          </div>
        </div>

        {/* Floating Icons - Positioned according to prototype */}
        <div className="absolute inset-0 pointer-events-none">
          {/* List Checklist Icon */}
          <img
            className="absolute top-20 left-15 w-8 h-8 animate-float"
            src={Icon4}
            style={{ animationDelay: "0s" }}
          />

          {/* Calendar Icon */}
          <img
            className="absolute md:top-40 top-25 left-25 w-12 h-12 animate-float opacity-60 md:opacity-100"
            src={Icon5}
            style={{ animationDelay: "0.5s" }}
          />

          {/* Grafik Icon */}
          <img
            className="absolute md:bottom-50 bottom-40 left-70 w-10 h-10 animate-float opacity-50 md:opacity-100"
            src={Icon6}
            style={{ animationDelay: "1s" }}
          />

          {/* Love Comment Icon */}
          <img
            className="absolute bottom-30  w-15 h-15 animate-float"
            src={Icon7}
            style={{ animationDelay: "1.5s" }}
          />

          {/* Circle Checklist Icon */}
          <img
            className="absolute bottom-25 left-130 w-9 h-11 animate-float opacity-90"
            src={Icon8}
            style={{ animationDelay: "2s" }}
          />

          {/* Alarm Icon */}
          <img
            className="absolute top-32 right-40 w-15 h-15 animate-float hidden md:block"
            src={Icon9}
            style={{ animationDelay: "2.5s" }}
          />

          {/* Piechart Icon */}
          <img
            className="absolute top-20 md:top-60 right-15 w-15 h-15 animate-float"
            src={Icon10}
            style={{ animationDelay: "3s" }}
          />

          {/* Scales Icon */}
          <img
            className="absolute bottom-45 right-60 w-12 h-12 animate-float transform opacity-50 md:opacity-100"
            src={Icon11}
            style={{ animationDelay: "3.5s" }}
          />

          {/* Baggage Icon */}
          <img
            className="absolute bottom-24 right-5 w-8 h-8 animate-float opacity-50 md:opacity-100"
            src={Icon12}
            style={{ animationDelay: "4s" }}
          />
        </div>
      </section>
    </>
  );
}

export default HeroSection;