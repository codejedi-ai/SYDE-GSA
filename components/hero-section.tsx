import Link from 'next/link';
import Image from 'next/image';
import { Navigation } from './ui/navigation';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      <Navigation />
      <div className="container mx-auto px-4 py-20 relative z-10 text-center">
        <div className="mb-6">
          <span className="text-lg md:text-xl text-yellow-400 font-semibold tracking-wide">University of Waterloo</span>
        </div>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-12 leading-tight tracking-tight">
          <span className="text-yellow-400">InSYDErs</span>
        </h1>
        <div className="mb-12 max-w-4xl mx-auto space-y-4">
          <p className="text-3xl md:text-4xl lg:text-5xl text-white font-light italic leading-relaxed">
            Systems is how we know the world.
          </p>
          <p className="text-3xl md:text-4xl lg:text-5xl text-white font-light italic leading-relaxed">
            Design is how we change it.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/events"
            className="px-8 py-4 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition-all shadow-lg"
          >
            Upcoming Events
          </Link>
          <Link
            href="#contact"
            className="px-8 py-4 bg-transparent text-yellow-400 rounded-lg font-semibold hover:bg-yellow-400/10 transition-all border-2 border-yellow-400"
          >
            Get Involved
          </Link>
        </div>
      </div>
    </section>
  );
}
