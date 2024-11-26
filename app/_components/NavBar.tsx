"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Import Lucide icons

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Tracks if the navbar is open

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Hamburger Button */}
      <button
        className="fixed top-5 right-5 z-50 text-main_blue p-3 rounded-md"
        onClick={toggleNavbar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}{" "}
        {/* Icon changes based on state */}
      </button>

      {/* Slidable Navbar */}
      <div
        className={`fixed top-0 right-0 h-full w-[250px] text-main_blue bg-white transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-40`}
      >
        {/* Navbar Content */}
        <nav className="items-center flex h-full">
          <ul className="flex flex-col space-y-8 px-6">
            <li>
              <Link
                href="/"
                className="text-lg font-semibold"
                onClick={toggleNavbar}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/articles"
                className="text-lg font-semibold"
                onClick={toggleNavbar}
              >
                Articles
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-30"
          onClick={toggleNavbar}
        ></div>
      )}
    </div>
  );
}
