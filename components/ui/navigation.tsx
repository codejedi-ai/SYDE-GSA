'use client'

import { useState } from 'react'
import { Menu, X, Home, Info, MessageSquare, Settings } from 'lucide-react'
import Link from 'next/link'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-cyber-blue/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-cyber-blue font-cyber text-xl neon-text">
              GALATEA
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-cyber-light hover:text-cyber-blue px-3 py-2 rounded-md text-sm font-mono transition-colors duration-300"
              >
                <Home className="w-4 h-4 inline mr-2" />
                Home
              </Link>
              <Link
                href="/about"
                className="text-cyber-light hover:text-cyber-blue px-3 py-2 rounded-md text-sm font-mono transition-colors duration-300"
              >
                <Info className="w-4 h-4 inline mr-2" />
                About
              </Link>
              <Link
                href="/chat"
                className="text-cyber-light hover:text-cyber-blue px-3 py-2 rounded-md text-sm font-mono transition-colors duration-300"
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Chat
              </Link>
              <Link
                href="/settings"
                className="text-cyber-light hover:text-cyber-blue px-3 py-2 rounded-md text-sm font-mono transition-colors duration-300"
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Settings
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-cyber-light hover:text-cyber-blue p-2 rounded-md transition-colors duration-300"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-sm border-t border-cyber-blue/30">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="text-cyber-light hover:text-cyber-blue block px-3 py-2 rounded-md text-base font-mono transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              <Home className="w-4 h-4 inline mr-2" />
              Home
            </Link>
            <Link
              href="/about"
              className="text-cyber-light hover:text-cyber-blue block px-3 py-2 rounded-md text-base font-mono transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              <Info className="w-4 h-4 inline mr-2" />
              About
            </Link>
            <Link
              href="/chat"
              className="text-cyber-light hover:text-cyber-blue block px-3 py-2 rounded-md text-base font-mono transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Chat
            </Link>
            <Link
              href="/settings"
              className="text-cyber-light hover:text-cyber-blue block px-3 py-2 rounded-md text-base font-mono transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Settings
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
