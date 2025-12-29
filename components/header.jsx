"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 w-full z-50
      bg-black/40 backdrop-blur-md border-b border-white/10
      animate-slideInDown"
    >
      <nav className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4">
        
        {/* Logo */}
        <Link href="/" className="text-3xl font-bold tracking-tight">
          <span className="text-yellow-400">FactiFy</span>
          <span className="text-blue-300">AI</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 font-semibold text-yellow-400">
          <Link href="/verify">VERIFY</Link>
          <Link href="/about">ABOUT</Link>
          <Link href="/resources">RESOURCES</Link>
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-yellow-400 text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-black/60 backdrop-blur-md border-t border-white/10 py-4 px-6 space-y-4 animate-slideInLeft">
          <Link href="/verify" className="block text-yellow-400">VERIFY</Link>
          <Link href="/about" className="block text-yellow-400">ABOUT</Link>
          <Link href="/resources" className="block text-yellow-400">RESOURCES</Link>
        </div>
      )}
    </header>
  );
}
