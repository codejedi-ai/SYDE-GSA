import { Users, Calendar, BookOpen, Heart } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with fellow SYDE grad students and build lasting relationships.',
    },
    {
      icon: Calendar,
      title: 'Events',
      description: 'Regular social events, workshops, and networking opportunities throughout the year.',
    },
    {
      icon: BookOpen,
      title: 'Resources',
      description: 'Access academic support, career guidance, and professional development resources.',
    },
    {
      icon: Heart,
      title: 'Wellness',
      description: 'Mental health support and work-life balance initiatives for graduate students.',
    },
  ];

  return (
    <section id="events" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            What We Do
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Supporting SYDE graduate students through every step of their academic journey.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="p-6 rounded-xl bg-gray-50 border-2 border-gray-200 hover:border-yellow-400 transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
