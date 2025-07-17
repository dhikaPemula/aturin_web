import Assets from "../../../core/lib/Assets.jsx";
import ScrollingTestimonials from "./ScrollingTestimonials.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TestimonialSection() {
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
      {/* Testimonials Section */}
      <section id="ulasan" className="font-family-poppins py-20 px-6 bg-white">
        <div className="max-w-[1400px] mx-auto bg-blue-100 rounded-3xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="flex flex-col justify-center items-center lg:items-start h-full">
              <h2 className="mt-8 lg:mt-0 text-5xl md:text-5xl px-5 text-gray-800 mb-6 text-center lg:text-left">
                Apa kata mereka?
              </h2>
              <p className="text-gray-600 mb-8 px-5 md:pr-20 text-center lg:text-left">
                Cerita nyata dari para pengguna yang merasakan manfaat Aturin
                dalam aktivitas harian mereka.
              </p>
              <button
                className={` bg-blue-700 border border-blue-700 rounded-xl ${
                  isClicked ? "pb-0 mt-1" : "pb-1 mt-0"
                } mx-auto lg:ml-4 `}
                onClick={handleClick}
              >
                <div className="bg-blue-500 text-white rounded-xl px-6 py-2">
                  Coba Sekarang
                </div>
              </button>
            </div>

            <div>
              <ScrollingTestimonials />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default TestimonialSection;
