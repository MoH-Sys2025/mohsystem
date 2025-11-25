import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-500 p-2 rounded-lg">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="9 22 9 12 15 12 15 22"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-green-500" style={{ fontFamily: 'Changa One, cursive' }}>
                Anake Lodge
              </div>
            </div>
            <p className="text-white/70 mb-6">
              Experience the beauty of Lake Malawi with world-class accommodations
              and exceptional hospitality.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6" style={{ fontFamily: 'Changa One, cursive' }}>Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/70 hover:text-green-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-green-400 transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-green-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-green-400 transition-colors">
                  Booking
                </a>
              </li>
            </ul>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="mb-6" style={{ fontFamily: 'Changa One, cursive' }}>Amenities</h3>
            <ul className="space-y-3">
              <li className="text-white/70">Luxury Accommodations</li>
              <li className="text-white/70">Fine Dining</li>
              <li className="text-white/70">Water Sports</li>
              <li className="text-white/70">Spa & Wellness</li>
              <li className="text-white/70">Event Hosting</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6" style={{ fontFamily: 'Changa One, cursive' }}>Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <span className="text-white/70">
                  Lake Malawi, Mangochi District, Malawi
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                <a
                  href="tel:+265991234567"
                  className="text-white/70 hover:text-green-400 transition-colors"
                >
                  +265 991 234 567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-400 flex-shrink-0" />
                <a
                  href="mailto:info@anakelodge.com"
                  className="text-white/70 hover:text-green-400 transition-colors"
                >
                  info@anakelodge.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/60">
          <p>© 2025 Anake Lodge. All rights reserved. | Designed for unforgettable experiences.</p>
        </div>
      </div>
    </footer>
  );
}
