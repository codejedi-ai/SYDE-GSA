import Link from 'next/link';
import { Mail, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-12 border-t border-yellow-400/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-yellow-400 font-semibold text-lg mb-4">InSYDErs</h3>
            <p className="text-sm">
              The Systems Design Engineering Graduate Student Association (InSYDErs) at the University of Waterloo.
            </p>
            <p className="text-xs text-gray-400 mt-2 italic">
              Systems is how we know the world. Design is how we change it.
            </p>
          </div>
          <div>
            <h4 className="text-yellow-400 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#about" className="hover:text-yellow-400 transition-colors">About Us</Link></li>
              <li><Link href="/events" className="hover:text-yellow-400 transition-colors">Events</Link></li>
              <li><Link href="#team" className="hover:text-yellow-400 transition-colors">Our Team</Link></li>
              <li><Link href="#contact" className="hover:text-yellow-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-yellow-400 font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="mailto:syde-gsa@uwaterloo.ca" className="hover:text-yellow-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm">
              Email: syde-gsa@uwaterloo.ca
            </p>
          </div>
        </div>
        <div className="border-t border-yellow-400/30 pt-8 text-sm text-center">
          <p>&copy; 2025 InSYDErs - SYDE Graduate Student Association. University of Waterloo.</p>
        </div>
      </div>
    </footer>
  );
}
