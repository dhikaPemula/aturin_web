import { AturinIcon } from "../../../assets/landing_page/icon.jsx";
import { useState } from "react";

function Footer() {
  return (
    <>
      <footer className=" bg-blue-100 text-white py-4 md:px-6 font-family-poppins md:max-w-[1400px] md:mx-auto mb-6 mx-6 rounded-4xl">
        <div className="flex flex-col md:flex-row md:justify-between mx-10">
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10">
                <img src={AturinIcon} />
              </div>
              <span className="text-2xl text-blue-500 font-semibold">
                Aturin
              </span>
            </div>
            <div className="text-blue-500 border-l-1 border-blue-500 pl-4 font-medium">
              Waktumu diaturin, <p>hidupmu dibalikin</p>
            </div>
          </div>

          <div className="text-blue-500 flex text-center md:items-center">
            © Copyright 2025 Aturin. All rights reserved.
          </div>

          <div className="text-blue-500 flex text-center md:items-center font-medium">
            Contact for support @emailaturin
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
