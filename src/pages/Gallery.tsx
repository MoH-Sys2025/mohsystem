import { useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

type GalleryProps = {
  onRoomClick: (roomId: number) => void;
};

const galleryImages = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1616013093727-7130924f22c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGxvZGdlJTIwbWFsYXdpfGVufDF8fHx8MTc2MjQxMDk0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Beach Facing Room',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYyMzUwMDg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Standard Room',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1706347042234-896cb09ed1a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBob3RlbCUyMHN1aXRlfGVufDF8fHx8MTc2MjQwOTk2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Family Room',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1607712617949-8c993d290809?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2RnZSUyMGludGVyaW9yJTIwYWZyaWNhfGVufDF8fHx8MTc2MjQxMDk0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Beach Facing Room',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1665993585834-ec5c128ac85a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtlJTIwdmlldyUyMHJvb218ZW58MXx8fHwxNzYyNDEwOTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Family Room',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1648383228240-6ed939727ad6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFuZGFyZCUyMGhvdGVsJTIwcm9vbXxlbnwxfHx8fDE3NjI0MTA5NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Standard Room',
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1612807493760-2b5ec3b5af8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGZhY2luZyUyMHJvb218ZW58MXx8fHwxNzYyNDEwOTUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Beach Facing Room',
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1668089677938-b52086753f77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYyMjk0OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Standard Room',
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1559414059-34fe0a59e57a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHN1aXRlJTIwdmlld3xlbnwxfHx8fDE3NjIzMzY3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Family Room',
  },
];

const categories = ['All', 'Beach Facing Room', 'Family Room', 'Standard Room'];

export function Gallery({ onRoomClick }: GalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredImages =
    selectedCategory === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-full mb-4">
            Our Rooms
          </div>
          <h2 className="mb-4 text-slate-900" style={{ fontFamily: 'Changa One, cursive' }}>
            Discover Comfort & Style
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Explore our collection of beautifully designed lodge rooms, each offering a unique blend
            of comfort, elegance, and scenic views. From cozy standard rooms to spacious family
            suites, every space has been created with your relaxation in mind.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-center gap-4 mb-12 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-8 py-3 rounded-full transition-all ${
                selectedCategory === category
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((item) => (
            <button
              key={item.id}
              onClick={() => onRoomClick(item.id)}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 aspect-[4/3] text-left"
            >
              <ImageWithFallback
                src={item.image}
                alt={item.category}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="mb-2" style={{ fontFamily: 'Changa One, cursive' }}>
                  {item.category}
                </h3>
                <p className="text-sm text-white/80">
                  Experience comfort and luxury in our {item.category.toLowerCase()}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
