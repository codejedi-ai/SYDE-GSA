import Link from 'next/link';
import { Navigation } from './ui/navigation';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800">
      <Navigation />
      <div className="container mx-auto px-4 py-20 relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          SYDE Graduate Student
          <br />
          <span className="text-blue-200">Association</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto">
          Supporting Systems Design Engineering graduate students at the University of Waterloo
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="#events"
            className="px-8 py-4 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg"
          >
            Upcoming Events
          </Link>
          <Link
            href="#contact"
            className="px-8 py-4 bg-transparent text-white rounded-lg font-semibold hover:bg-white/10 transition-all border-2 border-white"
          >
            Get Involved
          </Link>
        </div>
      </div>
    </section>
  );
}
