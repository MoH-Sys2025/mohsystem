import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Users, Star, Wifi, Coffee, Tv, Wind } from 'lucide-react';

type RoomDetailProps = {
  roomId: number;
  onBack: () => void;
};

const roomDetails = {
  1: {
    name: 'Beach Facing Room',
    category: 'Beach Facing Room',
    price: 100,
    maxGuests: 6,
    rating: 4.5,
    description: 'Experience the ultimate lakeside retreat in our Beach Facing Room. Wake up to breathtaking views of Lake Malawi, with direct access to our private beach. This spacious room combines comfort and elegance, featuring premium bedding, modern amenities, and a private balcony perfect for watching stunning sunsets.',
    images: [
      'https://images.unsplash.com/photo-1612807493760-2b5ec3b5af8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGZhY2luZyUyMHJvb218ZW58MXx8fHwxNzYyNDEwOTUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1616013093727-7130924f22c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGxvZGdlJTIwbWFsYXdpfGVufDF8fHx8MTc2MjQxMDk0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1665993585834-ec5c128ac85a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtlJTIwdmlldyUyMHJvb218ZW58MXx8fHwxNzYyNDEwOTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    amenities: [
      { icon: Wifi, name: 'Free Wi-Fi' },
      { icon: Coffee, name: 'Coffee Maker' },
      { icon: Tv, name: 'Smart TV' },
      { icon: Wind, name: 'Air Conditioning' },
    ],
  },
  2: {
    name: 'Family Suite',
    category: 'Family Room',
    price: 180,
    maxGuests: 4,
    rating: 4.8,
    description: 'Our spacious Family Suite is designed for comfort and togetherness. With separate sleeping areas, a cozy living room, and ample space for the whole family, this suite offers the perfect home away from home. Enjoy modern amenities and stunning lake views.',
    images: [
      'https://images.unsplash.com/photo-1706347042234-896cb09ed1a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBob3RlbCUyMHN1aXRlfGVufDF8fHx8MTc2MjQwOTk2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1607712617949-8c993d290809?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2RnZSUyMGludGVyaW9yJTIwYWZyaWNhfGVufDF8fHx8MTc2MjQxMDk0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1559414059-34fe0a59e57a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHN1aXRlJTIwdmlld3xlbnwxfHx8fDE3NjIzMzY3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    amenities: [
      { icon: Wifi, name: 'Free Wi-Fi' },
      { icon: Coffee, name: 'Coffee Maker' },
      { icon: Tv, name: 'Smart TV' },
      { icon: Wind, name: 'Air Conditioning' },
    ],
  },
  3: {
    name: 'Standard Room',
    category: 'Standard Room',
    price: 75,
    maxGuests: 2,
    rating: 4.3,
    description: 'Our Standard Room offers excellent value without compromising on comfort. Perfect for couples or solo travelers, this well-appointed room features a comfortable bed, modern bathroom, and all the essential amenities for a pleasant stay.',
    images: [
      'https://images.unsplash.com/photo-1648383228240-6ed939727ad6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFuZGFyZCUyMGhvdGVsJTIwcm9vbXxlbnwxfHx8fDE3NjI0MTA5NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1668089677938-b52086753f77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYyMjk0OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYyMzUwMDg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    amenities: [
      { icon: Wifi, name: 'Free Wi-Fi' },
      { icon: Coffee, name: 'Coffee Maker' },
      { icon: Tv, name: 'Smart TV' },
      { icon: Wind, name: 'Air Conditioning' },
    ],
  },
};

export function RoomDetail({ roomId, onBack }: RoomDetailProps) {
  const room = roomDetails[roomId as keyof typeof roomDetails];

  if (!room) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-4">Room not found</h2>
          <button onClick={onBack} className="text-green-600 hover:text-green-700">
            ← Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-8 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Gallery
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-block bg-green-500 text-white px-4 py-2 rounded-full mb-4">
            {room.category}
          </div>
          <h2 className="mb-4 text-slate-900" style={{ fontFamily: 'Changa One, cursive' }}>
            {room.name}
          </h2>
          <div className="flex items-center gap-6 text-slate-600">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              <span>Max {room.maxGuests} guests</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(room.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-slate-300'
                  }`}
                />
              ))}
              <span className="ml-2">({room.rating})</span>
            </div>
            <div>
              <span className="text-green-600" style={{ fontFamily: 'Changa One, cursive', fontSize: '1.5rem' }}>
                ${room.price}
              </span>
              <span>/night</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-12">
          <div className="lg:row-span-2">
            <div className="relative h-96 lg:h-full rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src={room.images[0]}
                alt={room.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {room.images.slice(1).map((image, index) => (
            <div key={index} className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src={image}
                alt={`${room.name} ${index + 2}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Description & Amenities */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="mb-4 text-slate-900" style={{ fontFamily: 'Changa One, cursive' }}>
                Room Description
              </h3>
              <p className="text-slate-600 leading-relaxed">{room.description}</p>
            </div>

            <div>
              <h3 className="mb-6 text-slate-900" style={{ fontFamily: 'Changa One, cursive' }}>
                Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {room.amenities.map((amenity, index) => {
                  const Icon = amenity.icon;
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                    >
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-slate-700 text-center">{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-slate-900" style={{ fontFamily: 'Changa One, cursive' }}>
                Room Features
              </h3>
              <ul className="space-y-3">
                {[
                  'Premium bedding and linens',
                  'Private bathroom with shower',
                  'Complimentary toiletries',
                  'Daily housekeeping',
                  'In-room safe',
                  '24-hour room service',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-slate-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-slate-50 rounded-2xl p-6 border-2 border-slate-200">
              <h3 className="mb-6 text-slate-900" style={{ fontFamily: 'Changa One, cursive' }}>
                Book This Room
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-slate-700 mb-2">Check-in Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">Check-out Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">Number of Guests</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none">
                    {[...Array(room.maxGuests)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-slate-300">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Price per night</span>
                  <span className="text-slate-900">${room.price}</span>
                </div>
              </div>

              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg transition-colors mb-4">
                Book Now
              </button>

              <p className="text-sm text-slate-500 text-center">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
