import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Award, Users, Heart, MapPin } from 'lucide-react';

const teamMembers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'General Manager',
    image: 'https://images.unsplash.com/photo-1581065178026-390bc4e78dad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc2MjMxNzgzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Head Chef',
    image: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMG1hbnxlbnwxfHx8fDE3NjIzMjQ0NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 3,
    name: 'Emma Williams',
    role: 'Guest Relations',
    image: 'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2MjM3OTA4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 4,
    name: 'David Banda',
    role: 'Activities Coordinator',
    image: 'https://images.unsplash.com/photo-1549614614-dfc31601c389?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVtYmVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYyMzUxODcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

export function AboutUs() {
  const stats = [
    { icon: Award, value: '15+', label: 'Years of Excellence' },
    { icon: Users, value: '10K+', label: 'Happy Guests' },
    { icon: Heart, value: '98%', label: 'Satisfaction Rate' },
    { icon: MapPin, value: '1', label: 'Premier Location' },
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-full mb-4">
            About Us
          </div>
          <h2 className="mb-4 text-slate-900" style={{ fontFamily: 'Changa One, cursive' }}>
            Welcome to Anake Lodge
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Your premier destination for luxury and comfort on the shores of Lake Malawi
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-slate-900" style={{ fontFamily: 'Changa One, cursive' }}>
              Our Story
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Nestled on the pristine shores of Lake Malawi, Anake Lodge has been a beacon of
              hospitality and luxury since 2009. Our vision was simple yet profound: to create a
              sanctuary where guests could immerse themselves in the natural beauty of Malawi while
              enjoying world-class accommodations and service.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Over the years, we've welcomed thousands of guests from around the world, each leaving
              with unforgettable memories and a desire to return. Our commitment to excellence,
              sustainability, and authentic Malawian hospitality sets us apart as the premier lodge
              destination in the region.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Whether you're seeking adventure on the crystal-clear waters, relaxation in our
              luxurious accommodations, or a taste of local culture and cuisine, Anake Lodge offers
              an experience that transcends the ordinary.
            </p>
          </div>

          <div className="relative">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1620118336728-5be2dd3193a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtlJTIwbG9kZ2UlMjBtYWxhd2l8ZW58MXx8fHwxNzYyNDEwMzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Anake Lodge"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1607712617949-8c993d290809?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2RnZSUyMGludGVyaW9yJTIwYWZyaWNhfGVufDF8fHx8MTc2MjQxMDk0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center p-6 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div
                  className="text-slate-900 mb-2"
                  style={{ fontFamily: 'Changa One, cursive', fontSize: '2rem' }}
                >
                  {stat.value}
                </div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-block bg-slate-900 text-white px-6 py-2 rounded-full mb-4">
              Our Team
            </div>
            <h2 className="mb-4 text-green-600" style={{ fontFamily: 'Changa One, cursive' }}>
              Our Awesome Team
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto">
              There are many variations of passages of Lorem Ipsum available but the majority have
              suffered alteration in some form.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group"
              >
                <div className="relative h-80 overflow-hidden">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Decorative dots */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="grid grid-cols-3 gap-1">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white border-t-4 border-green-500">
                  <div className="text-center mb-4">
                    <h4 className="text-slate-900 mb-1" style={{ fontFamily: 'Changa One, cursive' }}>
                      {member.name}
                    </h4>
                    <p className="text-slate-600">{member.role}</p>
                  </div>
                  <button className="w-full text-green-600 hover:text-green-700 transition-colors">
                    learn more
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 text-white p-8 rounded-2xl">
            <h3 className="mb-4" style={{ fontFamily: 'Changa One, cursive' }}>
              Our Mission
            </h3>
            <p className="text-white/90">
              To provide exceptional hospitality experiences that celebrate the natural beauty of
              Lake Malawi while promoting sustainable tourism and supporting local communities. We
              strive to create lasting memories for our guests through personalized service,
              authentic cultural experiences, and unwavering commitment to excellence.
            </p>
          </div>

          <div className="bg-green-500 text-white p-8 rounded-2xl">
            <h3 className="mb-4" style={{ fontFamily: 'Changa One, cursive' }}>
              Our Vision
            </h3>
            <p className="text-white/90">
              To be recognized as the leading luxury lodge in Malawi, setting the standard for
              sustainable tourism, cultural authenticity, and guest satisfaction. We envision a
              future where Anake Lodge serves as a model for responsible hospitality that benefits
              both our guests and the local community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
