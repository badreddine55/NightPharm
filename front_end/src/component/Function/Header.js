import React from "react";
import Logo from "../../assets/logo1-removebg-preview.png";

export default function Header({ toggleMenu }) {
  return (
    <header className=" fixed  top-0 z-40 w-full h-18 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button onClick={toggleMenu} className="text-gray-700 hover:text-teal-500">
            <span className="sr-only">Toggle navigation</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <img
              src={Logo}
              alt="NightPharm Logo"
              className="h-10 object-contain px-2"
            />
            <span className="font-semibold text-lg text-teal-600">NightPharm</span>
          </div>
        </div>
      </div>
    </header>
  );
}
