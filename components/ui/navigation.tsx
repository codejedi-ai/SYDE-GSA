'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            SYDE GSA
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#about" className="text-gray-700 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="#events" className="text-gray-700 hover:text-gray-900 transition-colors">
              Events
            </Link>
            <Link href="#team" className="text-gray-700 hover:text-gray-900 transition-colors">
              Team
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col items-center space-y-4 py-4">
            <Link href="#about" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="#events" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-gray-900 transition-colors">
              Events
            </Link>
            <Link href="#team" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-gray-900 transition-colors">
              Team
            </Link>
            <Link href="#contact" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
