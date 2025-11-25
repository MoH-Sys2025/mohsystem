import { ImageWithFallback } from '@/components/figma/ImageWithFallback.tsx';
import { Users, Maximize } from 'lucide-react';

const featuredRooms = [
  {
    id: 1,
    name: 'Lakeside Villa',
    image: 'https://images.unsplash.com/photo-1620118336728-5be2dd3193a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtlJTIwbG9kZ2UlMjBtYWxhd2l8ZW58MXx8fHwxNzYyNDEwMzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: '$250',
    guests: 4,
    size: '65m²',
    features: ['Lake View', 'King Bed', 'Private Balcony'],
  },
  {
    id: 2,
    name: 'Executive Suite',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYyMzUwMDg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: '$180',
    guests: 2,
    size: '45m²',
    features: ['Garden View', 'Queen Bed', 'Work Desk'],
  },
  {
    id: 3,
    name: 'Premium Room',
    image: 'https://images.unsplash.com/photo-1729708475274-3b84bf98da62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsJTIwbG91bmdlfGVufDF8fHx8MTc2MjMzNjc0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: '$220',
    guests: 3,
    size: '55m²',
    features: ['Pool View', 'Twin Beds', 'Living Area'],
  },
];

export function FeaturedRooms() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-4">
            Our Rooms
          </div>
          <h2 className="mb-4">Featured Accommodations</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Choose from our carefully curated selection of rooms and suites, each designed
            to provide the ultimate comfort and relaxation during your stay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
            >
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-md">
                  <span className="text-blue-600">{room.price}/night</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="mb-4">{room.name}</h3>

                <div className="flex items-center gap-6 mb-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{room.guests} Guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize className="w-4 h-4" />
                    <span>{room.size}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {room.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
