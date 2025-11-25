import { Wifi, Coffee, Car, Waves, Utensils, Dumbbell } from 'lucide-react';

const services = [
  {
    icon: Wifi,
    title: 'High-Speed WiFi',
    description: 'Stay connected with complimentary high-speed internet throughout the property',
  },
  {
    icon: Utensils,
    title: 'Fine Dining',
    description: 'Experience exquisite cuisine at our lakeside restaurant with local and international dishes',
  },
  {
    icon: Waves,
    title: 'Water Activities',
    description: 'Enjoy kayaking, snorkeling, and boat tours on the beautiful Lake Malawi',
  },
  {
    icon: Car,
    title: 'Airport Shuttle',
    description: 'Convenient transportation service to and from the airport for our guests',
  },
  {
    icon: Coffee,
    title: 'Room Service',
    description: '24/7 room service to cater to all your needs at any time',
  },
  {
    icon: Dumbbell,
    title: 'Fitness Center',
    description: 'Modern gym facilities to maintain your fitness routine during your stay',
  },
];

export function Services() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-4">
            What We Offer
          </div>
          <h2 className="mb-4">Premium Services & Amenities</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            We provide a comprehensive range of services and facilities to ensure
            your stay is comfortable, convenient, and memorable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-colors group"
              >
                <div className="w-14 h-14 bg-blue-100 group-hover:bg-blue-600 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="mb-3">{service.title}</h3>
                <p className="text-slate-600">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
