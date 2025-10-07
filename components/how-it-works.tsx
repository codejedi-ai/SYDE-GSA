export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Join the Community',
      description: 'Connect with us through our social media channels or attend one of our events.',
    },
    {
      number: '02',
      title: 'Get Involved',
      description: 'Participate in events, workshops, and social gatherings. Your voice matters.',
    },
    {
      number: '03',
      title: 'Shape Your Experience',
      description: 'Help us plan events and initiatives that matter to you and your fellow students.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get Involved
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our community in three simple steps
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
