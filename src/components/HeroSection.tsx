import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback.tsx';

const rooms = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYyMzUwMDg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Deluxe Suite',
    description: 'Spacious luxury with stunning lake views',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1668089677938-b52086753f77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYyMjk0OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Premium Room',
    description: 'Modern comfort meets elegant design',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1559414059-34fe0a59e57a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHN1aXRlJTIwdmlld3xlbnwxfHx8fDE3NjIzMzY3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Executive Suite',
    description: 'Unparalleled luxury and breathtaking views',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1689075181952-1b0572db30bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNvcnQlMjByb29tJTIwYmFsY29ueXxlbnwxfHx8fDE3NjI0MTAzNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Lakeside Villa',
    description: 'Private paradise with panoramic views',
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % rooms.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % rooms.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + rooms.length) % rooms.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {rooms.map((room, index) => (
        <div
          key={room.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <ImageWithFallback
            src={room.image}
            alt={room.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
              <span className="text-white/90">Experience the Magic of Travel</span>
            </div>
            
            <h1 className="text-white mb-6" style={{ fontFamily: 'Changa One, cursive' }}>
              Embark on Your<br />Dream Adventure
            </h1>
            
            <p className="text-white/90 mb-12 max-w-xl">
              Discover the world's top destinations for an unforgettable vacation at Lake Malawi's
              premier lodge with exceptional comfort and scenic views.
            </p>

            <div className="flex items-center gap-4">
              <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg transition-colors">
                Find Your Destination
              </button>
              <button className="bg-transparent border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-lg backdrop-blur-sm transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Thumbnail Images - Bottom Right */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-3">
        {rooms.map((room, index) => (
          <button
            key={room.id}
            onClick={() => goToSlide(index)}
            className={`relative w-32 h-24 rounded-lg overflow-hidden transition-all ${
              index === currentSlide
                ? 'ring-4 ring-green-500 scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <ImageWithFallback
              src={room.image}
              alt={room.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            {index === currentSlide && (
              <div className="absolute inset-0 border-2 border-green-500" />
            )}
          </button>
        ))}
      </div>

      {/* Tour Info Card - Bottom Left */}
      <div className="absolute bottom-8 left-8 z-20 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl max-w-md border border-white/10">
        <h3 className="text-white mb-2" style={{ fontFamily: 'Changa One, cursive' }}>
          {rooms[currentSlide].title}
        </h3>
        <p className="text-sm text-white/70 mb-4">
          {rooms[currentSlide].description}
        </p>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-slate-900"
              />
            ))}
          </div>
          <span className="text-white/80">People Joined</span>
        </div>
        <p className="text-sm text-white/60 mb-4">
          Explore breathtaking destinations across the globe — from majestic mountains to crystal clear coastlines.
        </p>
      </div>
    </div>
  );
}
