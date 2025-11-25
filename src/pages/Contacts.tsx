import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { useState } from 'react';

export function Contacts() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Location',
      details: ['Lake Malawi, Mangochi District', 'Malawi, Southern Africa'],
    },
    {
      icon: Phone,
      title: 'Phone',
      details: ['+265 991 234 567', '+265 888 765 432'],
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@anakelodge.com', 'reservations@anakelodge.com'],
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Monday - Sunday: 24/7', 'Office: 8:00 AM - 6:00 PM'],
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-full mb-4">
            Contact Us
          </div>
          <h2 className="mb-4 text-slate-900" style={{ fontFamily: 'Changa One, cursive' }}>
            Get In Touch
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Have questions or ready to book your stay? We're here to help make your Lake Malawi
            experience unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div>
            <h3 className="mb-6 text-slate-900" style={{ fontFamily: 'Changa One, cursive' }}>
              Send Us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors"
                  placeholder="+265 991 234 567"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors resize-none"
                  placeholder="Tell us about your inquiry..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="mb-6 text-slate-900" style={{ fontFamily: 'Changa One, cursive' }}>
              Contact Information
            </h3>
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-slate-900 mb-2" style={{ fontFamily: 'Changa One, cursive' }}>
                        {info.title}
                      </h4>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-slate-600">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Media */}
            <div className="bg-slate-900 p-6 rounded-2xl">
              <h4 className="text-white mb-4" style={{ fontFamily: 'Changa One, cursive' }}>
                Follow Us
              </h4>
              <p className="text-white/80 mb-6">
                Stay connected and follow us on social media for updates, special offers, and
                stunning views from the lodge.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-white/10 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-6 h-6 text-white" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-white/10 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-6 h-6 text-white" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-white/10 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-6 h-64 bg-slate-200 rounded-2xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <MapPin className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
