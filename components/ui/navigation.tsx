'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-cyber-blue/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-cyber neon-text">
              GALATEA
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-cyber-light hover:text-cyber-blue px-3 py-2 rounded-md text-sm font-cyber transition-colors duration-300"
              >
                NEURAL INTERFACE
              </Link>
              <Link
                href="/about"
                className="text-cyber-light hover:text-cyber-blue px-3 py-2 rounded-md text-sm font-cyber transition-colors duration-300"
              >
                ABOUT
              </Link>
              <Link
                href="/chapters"
                className="text-cyber-light hover:text-cyber-blue px-3 py-2 rounded-md text-sm font-cyber transition-colors duration-300"
              >
                STORY
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-cyber-light hover:text-cyber-blue p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/90 backdrop-blur-md">
            <Link
              href="/"
              className="text-cyber-light hover:text-cyber-blue block px-3 py-2 rounded-md text-base font-cyber transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              NEURAL INTERFACE
            </Link>
            <Link
              href="/about"
              className="text-cyber-light hover:text-cyber-blue block px-3 py-2 rounded-md text-base font-cyber transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              ABOUT
            </Link>
            <Link
              href="/chapters"
              className="text-cyber-light hover:text-cyber-blue block px-3 py-2 rounded-md text-base font-cyber transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              STORY
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
