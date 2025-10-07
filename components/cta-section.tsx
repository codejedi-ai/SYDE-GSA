import Link from 'next/link';

export function CTASection() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Questions or Suggestions?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          We'd love to hear from you. Reach out to us through any of our channels.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="mailto:syde-gsa@uwaterloo.ca"
            className="px-8 py-4 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition-all shadow-lg"
          >
            Email Us
          </a>
          <Link
            href="#events"
            className="px-8 py-4 bg-transparent text-yellow-400 rounded-lg font-semibold hover:bg-yellow-400/10 transition-all border-2 border-yellow-400"
          >
            View Events
          </Link>
        </div>
      </div>
    </section>
  );
}
