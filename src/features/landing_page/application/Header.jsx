import { AturinIcon, Icon17 } from "../../../../public/assets/landing_page/icon.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const [isDaftarClicked, setIsDaftarClicked] = useState(false);
  const [isMasukClicked, setIsMasukClicked] = useState(false);
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleDaftarClick = () => {
    setIsDaftarClicked(true);
    setTimeout(() => {
      setIsDaftarClicked(false);
      navigate("/auth/register");
    }, 100);
  };

  const handleMasukClick = () => {
    setIsMasukClicked(true);
    setTimeout(() => {
      setIsMasukClicked(false);
      navigate("/auth/login");
    }, 100);
  };

  return (
    <header
      className={`relative font-poppins md:flex items-center justify-between px-6 py-4 lg:max-w-[1400px]  my-4 mx-4 lg:mx-auto border border-blue-500 rounded-4xl`}
    >
      <div className={`flex items-center justify-between space-x-2 `}>
        <span className="flex justify-between items-center font-family-poppins text-3xl font-semibold text-blue-500">
          <img className="mr-2" src={AturinIcon} />
          Aturin
        </span>

        {/* Mobile Navbar Button*/}
        <button
          className="md:hidden px-2"
          onClick={() => {
            setIsMobileMenu(!isMobileMenu);
          }}
        >
          <img src={Icon17} />
        </button>
      </div>
      <nav className="hidden md:flex items-center space-x-8">
        <a href="#beranda" className="font-family-poppins hover:text-gray-600">
          Beranda
        </a>
        <a href="#tentang" className="font-family-poppins hover:text-gray-600">
          Tentang
        </a>
        <a href="#fitur" className="font-family-poppins hover:text-gray-600">
          Fitur
        </a>
        <a href="#ulasan" className="font-family-poppins hover:text-gray-600">
          Ulasan
        </a>
        <div className="hidden md:flex items-center space-x-4">
          <button
            className={`bg-gray-300 border border-gray-300 rounded-xl ${
              isDaftarClicked ? "pb-0" : "pb-1"
            }`}
            onClick={handleDaftarClick}
          >
            <div className="font-family-poppins bg-white rounded-xl px-4 py-1">
              Daftar
            </div>
          </button>
          <button
            className={`bg-blue-700 border border-blue-700 rounded-xl ${
              isMasukClicked ? "pb-0" : "pb-1"
            }`}
            onClick={handleMasukClick}
          >
            <div className="font-family-poppins bg-blue-500 text-white border border-blue-500 rounded-xl px-4 py-1">
              Masuk
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenu && (
        <div className=" left-0 top-full w-full flex flex-col z-50 py-4 text-center space-y-2 md:hidden">
          <a
            href="#beranda"
            className="px-6 py-2 font-family-poppins hover:text-gray-600"
          >
            Beranda
          </a>
          <a
            href="#tentang"
            className="px-6 py-2 font-family-poppins hover:text-gray-600"
          >
            Tentang
          </a>
          <a
            href="#fitur"
            className="px-6 py-2 font-family-poppins hover:text-gray-600"
          >
            Fitur
          </a>
          <a
            href="#ulasan"
            className="px-6 py-2 font-family-poppins hover:text-gray-600"
          >
            Ulasan
          </a>

          <button
            className={`bg-gray-300 border border-gray-300 rounded-xl ${
              isDaftarClicked ? "pb-0 mt-1" : "mt-0 pb-1"
            }`}
            onClick={handleDaftarClick}
          >
            <div
              className={`font-family-poppins bg-white rounded-xl  px-4 py-1`}
            >
              Daftar
            </div>
          </button>

          <button
            className={`bg-blue-700 border border-blue-700 rounded-xl ${
              isMasukClicked ? "pb-0 mt-1" : "pb-1 mt-0"
            }`}
            onClick={handleMasukClick}
          >
            <div className="font-family-poppins bg-blue-500 text-white border border-blue-500 rounded-xl px-4 py-1">
              Masuk
            </div>
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;