import { Phone, ShoppingCart } from 'lucide-react';

type NavbarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'booking', label: 'Booking' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'About Us' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="bg-green-500 p-2 rounded-lg">
              <svg
                width="32"
                height="32"
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
            <div className="text-green-500 tracking-wide" style={{ fontFamily: 'Changa One, cursive' }}>
              Anake Lodge
            </div>
          </button>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`text-white hover:text-green-400 transition-colors relative pb-1 ${
                  currentPage === link.id ? 'text-green-400' : ''
                }`}
              >
                {link.label}
                {currentPage === link.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400" />
                )}
              </button>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button className="relative text-white hover:text-green-400 transition-colors bg-green-500 p-2.5 rounded-lg">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-slate-900 rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
            <a
              href="tel:+265991234567"
              className="flex items-center gap-2 text-white hover:text-green-400 transition-colors bg-green-500 px-4 py-2.5 rounded-lg"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button className="flex items-center gap-2 text-white hover:text-green-400 transition-colors bg-green-500 px-4 py-2.5 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
