import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/footer';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import eventsData from '@/data/events.json';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function EventsPage() {
  const upcomingEvents = eventsData.filter(event => !event.is_past);
  const pastEvents = eventsData.filter(event => event.is_past);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
              <span className="text-yellow-400">InSYDErs</span> Events
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Connect, learn, and grow with fellow InSYDErs
            </p>
          </div>

          {upcomingEvents.length > 0 ? (
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-black mb-8">Upcoming Events</h2>
              <div className="grid md:grid-cols-1 gap-8">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`rounded-xl overflow-hidden border-2 shadow-lg hover:shadow-2xl transition-all ${
                      event.is_featured
                        ? 'bg-gradient-to-br from-black via-gray-900 to-black border-yellow-400'
                        : 'bg-gray-50 border-gray-200 hover:border-yellow-400'
                    }`}
                  >
                    <div className="md:flex">
                      {event.image_url ? (
                        <div className="md:w-1/3 relative h-64 md:h-auto">
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="md:w-1/3 relative h-64 md:h-auto">
                          <div className={`absolute inset-0 flex items-center justify-center ${
                            event.is_featured ? 'bg-yellow-400/20' : 'bg-gray-200'
                          }`}>
                            <Calendar className={`w-24 h-24 ${
                              event.is_featured ? 'text-yellow-400' : 'text-gray-400'
                            }`} />
                          </div>
                        </div>
                      )}
                      <div className="md:w-2/3 p-8">
                        {event.is_featured && (
                          <div className="flex items-center gap-2 mb-4">
                            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                              Featured Event
                            </span>
                          </div>
                        )}
                        <h3 className={`text-3xl font-bold mb-4 ${
                          event.is_featured ? 'text-yellow-400' : 'text-black'
                        }`}>
                          {event.title}
                        </h3>
                        <div className="space-y-3 mb-6">
                          <div className={`flex items-center gap-3 ${
                            event.is_featured ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            <Calendar className={`w-5 h-5 ${
                              event.is_featured ? 'text-yellow-400' : 'text-black'
                            }`} />
                            <span className="text-lg">{formatDate(event.event_date)}</span>
                          </div>
                          <div className={`flex items-center gap-3 ${
                            event.is_featured ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            <Clock className={`w-5 h-5 ${
                              event.is_featured ? 'text-yellow-400' : 'text-black'
                            }`} />
                            <span className="text-lg">{event.event_time}</span>
                          </div>
                          <div className={`flex items-center gap-3 ${
                            event.is_featured ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            <MapPin className={`w-5 h-5 ${
                              event.is_featured ? 'text-yellow-400' : 'text-black'
                            }`} />
                            <span className="text-lg">{event.location}</span>
                          </div>
                          <div className={`flex items-center gap-3 ${
                            event.is_featured ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            <Users className={`w-5 h-5 ${
                              event.is_featured ? 'text-yellow-400' : 'text-black'
                            }`} />
                            <span className="text-lg">{event.attendees_expected}</span>
                          </div>
                        </div>
                        <p className={`mb-6 text-lg leading-relaxed ${
                          event.is_featured ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {event.description}
                        </p>
                        <div className="flex gap-4">
                          <a
                            href={`mailto:syde-gsa@uwaterloo.ca?subject=${encodeURIComponent(event.title)} RSVP`}
                            className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition-all"
                          >
                            RSVP Now
                          </a>
                          <a
                            href="mailto:syde-gsa@uwaterloo.ca"
                            className={`px-6 py-3 rounded-lg font-semibold border-2 transition-all ${
                              event.is_featured
                                ? 'bg-transparent text-yellow-400 border-yellow-400 hover:bg-yellow-400/10'
                                : 'bg-transparent text-black border-black hover:bg-black/5'
                            }`}
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
          ) : (
            <section className="mb-16 text-center">
              <div className="bg-gray-50 rounded-xl p-12 border-2 border-gray-200">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-black mb-4">No Upcoming Events</h2>
                <p className="text-gray-600">
                  Check back soon for new events! Follow us to stay updated.
                </p>
              </div>
            </section>
          )}

          {pastEvents.length > 0 && (
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
                        <span>{formatDate(event.event_date)}</span>
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
          )}

          <section className="bg-gradient-to-br from-black via-gray-900 to-black rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Want to Host an Event?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Have an idea for an InSYDErs event? We'd love to hear from you! Reach out to us with your suggestions.
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
