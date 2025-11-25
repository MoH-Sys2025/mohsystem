import { useEffect, useRef } from 'react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback.tsx';

const rooms = [
  {
    id: 1,
    name: 'Beach Facing Room',
    image: 'https://images.unsplash.com/photo-1612807493760-2b5ec3b5af8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGZhY2luZyUyMHJvb218ZW58MXx8fHwxNzYyNDEwOTUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Cozy and elegant room with a stunning lake view. Includes a private bathroom, comfortable queen-size bed, and complimentary Wi-Fi.',
    price: 100,
    guests: 6,
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Family Suite',
    image: 'https://images.unsplash.com/photo-1706347042234-896cb09ed1a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBob3RlbCUyMHN1aXRlfGVufDF8fHx8MTc2MjQwOTk2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Spacious family accommodation with separate bedrooms, living area, and premium amenities for the perfect family getaway.',
    price: 180,
    guests: 4,
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Standard Room',
    image: 'https://images.unsplash.com/photo-1648383228240-6ed939727ad6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFuZGFyZCUyMGhvdGVsJTIwcm9vbXxlbnwxfHx8fDE3NjI0MTA5NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Comfortable and affordable room featuring modern amenities, perfect for couples or solo travelers seeking quality accommodation.',
    price: 75,
    guests: 2,
    rating: 4.3,
  },
  {
    id: 4,
    name: 'Deluxe Suite',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYyMzUwMDg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Luxury accommodation with premium furnishings, private balcony, and breathtaking panoramic views of Lake Malawi.',
    price: 220,
    guests: 3,
    rating: 4.9,
  },
];

export function ParallaxRooms() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;

      // Check if section is in view
      if (scrollPos + windowHeight > sectionTop && scrollPos < sectionTop + sectionHeight) {
        cardRefs.current.forEach((card, index) => {
          if (!card) return;

          const cardTop = card.offsetTop;
          const cardHeight = card.offsetHeight;
          const cardCenter = sectionTop + cardTop + cardHeight / 2;
          const scrollCenter = scrollPos + windowHeight / 2;
          const distance = Math.abs(cardCenter - scrollCenter);
          const maxDistance = windowHeight;

          // Parallax effect
          const parallaxSpeed = index % 2 === 0 ? 0.5 : -0.5;
          const translateY = (scrollPos - sectionTop) * parallaxSpeed * 0.3;

          // Scale and opacity based on distance from center
          const scale = Math.max(0.85, 1 - distance / maxDistance * 0.15);
          const opacity = Math.max(0.6, 1 - distance / maxDistance * 0.4);

          // Apply transforms with CSS
          card.style.transform = `translateY(${translateY}px) scale(${scale})`;
          card.style.opacity = opacity.toString();
          card.style.transition = 'transform 0.1s linear, opacity 0.1s linear';
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={sectionRef} className="py-24 bg-gradient-to-b from-white via-green-50/30 to-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-full mb-6">
            Our Rooms
          </div>
          <h2 className="mb-6 text-slate-900" style={{ fontFamily: 'Changa One, cursive' }}>
            Experience Comfort & Luxury
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Discover our carefully curated selection of rooms, each designed to provide the perfect
            blend of comfort, style, and unforgettable views of Lake Malawi.
          </p>
        </div>

        {/* Parallax Room Cards */}
        <div className="space-y-32">
          {rooms.map((room, index) => (
            <div
              key={room.id}
              ref={(el) => {
                  cardRefs.current[index] = el;
              }}

              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 lg:gap-12 items-center`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative group overflow-hidden rounded-3xl shadow-2xl">
                  <ImageWithFallback
                    src={room.image}
                    alt={room.name}
                    className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full">
                    ${room.price}/night
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
                  <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full mb-4">
                    Room {room.id}
                  </div>
                  <h3 className="mb-4 text-slate-900" style={{ fontFamily: 'Changa One, cursive' }}>
                    {room.name}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{room.description}</p>

                  {/* Features */}
                  <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="text-slate-700">Max {room.guests} guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(room.rating) ? 'text-yellow-400' : 'text-slate-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-slate-600">({room.rating})</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors">
                      Book this Room
                    </button>
                    <button className="px-6 border-2 border-green-500 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
