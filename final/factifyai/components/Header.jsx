"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-transparent backdrop-blur-md border-b border-white/10 z-50">
      <nav className="max-w-7xl mx-auto py-4 px-4 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold">
          <span className="text-yellow-400">FactiFy</span>
          <span className="text-blue-300">AI</span>
        </Link>

        <div className="hidden md:flex space-x-8 text-yellow-400 font-semibold">
          <Link href="/verify">VERIFY</Link>
          <Link href="/about">ABOUT</Link>
          <Link href="/resources">RESOURCES</Link>
        </div>

        <button
          className="md:hidden text-yellow-400 text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-black/60 backdrop-blur-md border-t border-white/10 py-4 px-6 space-y-4">
          <Link href="/verify" className="block text-yellow-400">VERIFY</Link>
          <Link href="/about" className="block text-yellow-400">ABOUT</Link>
          <Link href="/resources" className="block text-yellow-400">RESOURCES</Link>
        </div>
      )}
    </header>
  );
}
