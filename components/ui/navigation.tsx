"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Bot } from 'lucide-react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <Bot className="h-8 w-8 text-cyber-pink neon-text-pink" />
          <span className="text-xl font-bold font-cyber text-cyber-light neon-text">VATHSALA</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href="#"
            className="text-cyber-light/80 transition-colors hover:text-cyber-light hover:neon-text-pink"
            prefetch={false}
          >
            Interface
          </Link>
          <Link
            href="#"
            className="text-cyber-light/80 transition-colors hover:text-cyber-light hover:neon-text-pink"
            prefetch={false}
          >
            Logs
          </Link>
          <Link
            href="#"
            className="text-cyber-light/80 transition-colors hover:text-cyber-light hover:neon-text-pink"
            prefetch={false}
          >
            Diagnostics
          </Link>
          <Link
            href="#"
            className="text-cyber-light/80 transition-colors hover:text-cyber-light hover:neon-text-pink"
            prefetch={false}
          >
            Settings
          </Link>
        </nav>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden bg-transparent border-cyber-light/50 text-cyber-light hover:bg-cyber-light/10 hover:text-cyber-light">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-cyber-dark border-l-cyber-blue/50">
            <div className="grid gap-4 p-6">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold text-cyber-light"
                prefetch={false}
                onClick={() => setIsOpen(false)}
              >
                <Bot className="h-6 w-6 text-cyber-pink" />
                <span>VATHSALA</span>
              </Link>
              <Link href="#" className="text-cyber-light/80 hover:text-cyber-light" prefetch={false} onClick={() => setIsOpen(false)}>
                Interface
              </Link>
              <Link href="#" className="text-cyber-light/80 hover:text-cyber-light" prefetch={false} onClick={() => setIsOpen(false)}>
                Logs
              </Link>
              <Link href="#" className="text-cyber-light/80 hover:text-cyber-light" prefetch={false} onClick={() => setIsOpen(false)}>
                Diagnostics
              </Link>
              <Link href="#" className="text-cyber-light/80 hover:text-cyber-light" prefetch={false} onClick={() => setIsOpen(false)}>
                Settings
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
