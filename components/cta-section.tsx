import Link from 'next/link';

export function CTASection() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Questions or Suggestions?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          We'd love to hear from you. Reach out to us through any of our channels.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="mailto:syde-gsa@uwaterloo.ca"
            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg"
          >
            Email Us
          </a>
          <Link
            href="#events"
            className="px-8 py-4 bg-transparent text-white rounded-lg font-semibold hover:bg-white/10 transition-all border-2 border-white"
          >
            View Events
          </Link>
        </div>
      </div>
    </section>
  );
}
