import { useState } from "react";
import React from "react";
import "../App.css";
import Header from "../application/Header.jsx";
import HeroSection from "../application/HeroSection.jsx";
import FeatureSection from "../application/FeatureSection.jsx";
import SpecialFeatureSection from "../application/SpecialFeatureSection.jsx";
import TestimonialSection from "../application/TestimonialSection.jsx";
import Footer from "../application/Footer.jsx";

function LandingPage() {
  return (
    <>
      <div className="min-h-screen bg-white ">
        <Header />
        <HeroSection />
        <FeatureSection />
        <SpecialFeatureSection />
        <TestimonialSection />
        <Footer />
      </div>
    </>
  );
}

export default LandingPage;