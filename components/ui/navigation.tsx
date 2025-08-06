'use client'

import { useState } from 'react'
import { Menu, X, Home, Settings, Info } from 'lucide-react'
import { Button } from './button'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-cyber-blue/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-cyber-blue font-cyber text-xl font-bold">
              GALATEA
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="#"
                className="text-cyber-light hover:text-cyber-blue px-3 py-2 rounded-md text-sm font-mono transition-colors"
              >
                <Home className="w-4 h-4 inline mr-2" />
                Interface
              </a>
              <a
                href="#"
                className="text-cyber-light hover:text-cyber-blue px-3 py-2 rounded-md text-sm font-mono transition-colors"
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Neural Config
              </a>
              <a
                href="#"
                className="text-cyber-light hover:text-cyber-blue px-3 py-2 rounded-md text-sm font-mono transition-colors"
              >
                <Info className="w-4 h-4 inline mr-2" />
                System Info
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-transparent border-cyber-blue text-cyber-blue hover:bg-cyber-blue/20"
              size="sm"
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/90 backdrop-blur-sm border-t border-cyber-blue/30">
            <a
              href="#"
              className="text-cyber-light hover:text-cyber-blue block px-3 py-2 rounded-md text-base font-mono transition-colors"
            >
              <Home className="w-4 h-4 inline mr-2" />
              Interface
            </a>
            <a
              href="#"
              className="text-cyber-light hover:text-cyber-blue block px-3 py-2 rounded-md text-base font-mono transition-colors"
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Neural Config
            </a>
            <a
              href="#"
              className="text-cyber-light hover:text-cyber-blue block px-3 py-2 rounded-md text-base font-mono transition-colors"
            >
              <Info className="w-4 h-4 inline mr-2" />
              System Info
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
