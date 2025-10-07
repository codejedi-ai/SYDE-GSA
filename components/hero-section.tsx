import Link from 'next/link';
import { Navigation } from './ui/navigation';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      <Navigation />
      <div className="container mx-auto px-4 py-20 relative z-10 text-center">
        <div className="mb-4">
          <span className="text-lg md:text-xl text-yellow-400 font-semibold tracking-wide">University of Waterloo</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
          SYDE Graduate Student
          <br />
          <span className="text-yellow-400">Association</span>
        </h1>
        <div className="mb-8 max-w-3xl mx-auto">
          <p className="text-2xl md:text-3xl text-yellow-400 font-semibold italic mb-2">
            Systems is how we know the world.
          </p>
          <p className="text-2xl md:text-3xl text-yellow-400 font-semibold italic">
            Design is how we change it.
          </p>
        </div>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Supporting Systems Design Engineering graduate students through community, events, and resources
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="#events"
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
