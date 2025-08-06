'use client'

import { useState } from 'react'
import { Menu, X, Zap, Brain, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-cyber-blue/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-cyber-blue/20 rounded border border-cyber-blue neon-border flex items-center justify-center">
              <Brain className="w-5 h-5 text-cyber-blue" />
            </div>
            <span className="font-cyber text-xl text-cyber-blue neon-text">GALATEA</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#" className="text-cyber-light hover:text-cyber-blue font-mono text-sm transition-colors">
                NEURAL INTERFACE
              </a>
              <a href="#" className="text-cyber-light hover:text-cyber-blue font-mono text-sm transition-colors">
                CONSCIOUSNESS
              </a>
              <a href="#" className="text-cyber-light hover:text-cyber-blue font-mono text-sm transition-colors">
                PROTOCOLS
              </a>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyber-blue animate-pulse" />
              <span className="text-xs font-mono text-cyber-light">ONLINE</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-cyber-light hover:text-cyber-blue hover:bg-cyber-blue/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-cyber-light hover:text-cyber-blue"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-black/40 backdrop-blur-md border-t border-cyber-blue/30">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#" className="block px-3 py-2 text-cyber-light hover:text-cyber-blue font-mono text-sm">
              NEURAL INTERFACE
            </a>
            <a href="#" className="block px-3 py-2 text-cyber-light hover:text-cyber-blue font-mono text-sm">
              CONSCIOUSNESS
            </a>
            <a href="#" className="block px-3 py-2 text-cyber-light hover:text-cyber-blue font-mono text-sm">
              PROTOCOLS
            </a>
            <div className="flex items-center px-3 py-2 space-x-2">
              <Zap className="w-4 h-4 text-cyber-blue animate-pulse" />
              <span className="text-xs font-mono text-cyber-light">SYSTEM ONLINE</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
