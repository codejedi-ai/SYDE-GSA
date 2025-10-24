'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-yellow-400/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 text-2xl font-bold text-yellow-400">
            <Image
              src="/SYDEGSALogo.png"
              alt="SYDE GSA Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span>SYDE GSA</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#about" className="text-gray-300 hover:text-yellow-400 transition-colors">
              About
            </Link>
            <Link href="#events" className="text-gray-300 hover:text-yellow-400 transition-colors">
              Events
            </Link>
            <Link href="#team" className="text-gray-300 hover:text-yellow-400 transition-colors">
              Team
            </Link>
            <Link href="#contact" className="text-gray-300 hover:text-yellow-400 transition-colors">
              Contact
            </Link>
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-yellow-400">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-black border-t border-yellow-400/30">
          <nav className="flex flex-col items-center space-y-4 py-4">
            <Link href="#about" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-yellow-400 transition-colors">
              About
            </Link>
            <Link href="#events" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-yellow-400 transition-colors">
              Events
            </Link>
            <Link href="#team" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-yellow-400 transition-colors">
              Team
            </Link>
            <Link href="#contact" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-yellow-400 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
