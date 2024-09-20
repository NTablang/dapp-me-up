import Image from "next/image";
import React from "react";

function Navbar() {
  return (
    <header className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <Image
          unoptimized
          priority
          src="/DAppLogo.png"
          alt="dApp Me Up Logo"
          className="mr-2"
          width={120}
          height={120}
        />
      </div>
      <div>
        <button className="bg-yellow-400 text-black px-4 py-2 rounded mr-2">
          Sign In
        </button>
        <button className="bg-yellow-400 text-black px-4 py-2 rounded">
          Sign Up
        </button>
      </div>
    </header>
  );
}

export default Navbar;
