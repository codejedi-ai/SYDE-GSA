import Link from 'next/link';
import Image from 'next/image';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/footer';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

export default function EventsPage() {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Halloween Event',
      date: 'October 31, 2025',
      time: '6:00 PM - 10:00 PM',
      location: 'E7 Common Area',
      description: 'Join us for a spooky Halloween celebration! Costume contest, games, treats, and networking with fellow SYDE grad students.',
      attendees: '50+ expected',
      image: '/placeholder.jpg',
      featured: true
    }
  ];

  const pastEvents = [
    {
      id: 2,
      title: 'Welcome Back Social',
      date: 'September 15, 2025',
      location: 'Graduate House',
      description: 'Welcomed new and returning SYDE grad students for the Fall 2025 term.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
              SYDE GSA <span className="text-yellow-400">Events</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Connect, learn, and grow with your fellow Systems Design Engineering graduate students
            </p>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-8">Upcoming Events</h2>
            <div className="grid md:grid-cols-1 gap-8">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-gradient-to-br from-black via-gray-900 to-black rounded-xl overflow-hidden border-2 border-yellow-400 shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="md:flex">
                    <div className="md:w-1/3 relative h-64 md:h-auto">
                      <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center">
                        <Calendar className="w-24 h-24 text-yellow-400" />
                      </div>
                    </div>
                    <div className="md:w-2/3 p-8">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                          Featured Event
                        </span>
                      </div>
                      <h3 className="text-3xl font-bold text-yellow-400 mb-4">{event.title}</h3>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-300">
                          <Calendar className="w-5 h-5 text-yellow-400" />
                          <span className="text-lg">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                          <Clock className="w-5 h-5 text-yellow-400" />
                          <span className="text-lg">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                          <MapPin className="w-5 h-5 text-yellow-400" />
                          <span className="text-lg">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                          <Users className="w-5 h-5 text-yellow-400" />
                          <span className="text-lg">{event.attendees}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-6 text-lg leading-relaxed">{event.description}</p>
                      <div className="flex gap-4">
                        <a
                          href="mailto:syde-gsa@uwaterloo.ca?subject=Halloween Event RSVP"
                          className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition-all"
                        >
                          RSVP Now
                        </a>
                        <a
                          href="mailto:syde-gsa@uwaterloo.ca"
                          className="px-6 py-3 bg-transparent text-yellow-400 rounded-lg font-semibold border-2 border-yellow-400 hover:bg-yellow-400/10 transition-all"
                        >
                          Learn More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-8">Past Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-yellow-400 transition-all"
                >
                  <h3 className="text-xl font-bold text-black mb-3">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-yellow-400" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-yellow-400" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-600">{event.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-black via-gray-900 to-black rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Want to Host an Event?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Have an idea for a SYDE GSA event? We'd love to hear from you! Reach out to us with your suggestions.
            </p>
            <a
              href="mailto:syde-gsa@uwaterloo.ca?subject=Event Proposal"
              className="inline-block px-8 py-4 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition-all"
            >
              Submit Event Idea
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
