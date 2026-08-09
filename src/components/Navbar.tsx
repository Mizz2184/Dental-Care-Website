import React from 'react';
import { Calendar, Phone, ShieldCheck, User } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'services' | 'about' | 'contact' | 'booking' | 'admin';
  setCurrentTab: (tab: 'home' | 'services' | 'about' | 'contact' | 'booking' | 'admin') => void;
  clinicPhone: string;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  clinicPhone,
  isAdminLoggedIn
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fbfbfa]/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <button 
            onClick={() => setCurrentTab('home')}
            className="flex items-center space-x-3 text-left focus:outline-none group cursor-pointer"
            id="brand-logo-btn"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center shadow-md shadow-teal-900/10 group-hover:bg-teal-700 transition-colors">
              {/* Tooth / Clinic SVG Icon */}
              <svg className="w-6 h-6 fill-current text-teal-50" viewBox="0 0 24 24">
                <path d="M12 2C8.5 2 6 4.5 6 8c0 3 1.5 6.5 2.5 10 .5 1.7 1.3 4 3.5 4 1.2 0 1.8-.8 2-1.5.2.7.8 1.5 2 1.5 2.2 0 3-2.3 3.5-4C20.5 14.5 22 11 22 8c0-3.5-2.5-6-6-6h-4zm-3 6c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3z"/>
              </svg>
            </div>
            <div>
              <span className="block font-serif text-xl font-semibold tracking-wide text-teal-900 group-hover:text-teal-700 transition-colors">
                HARBOR VIEW
              </span>
              <span className="block text-[10px] tracking-[0.2em] font-medium uppercase text-slate-500">
                DENTAL & AESTHETICS
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <button
              onClick={() => setCurrentTab('home')}
              className={`transition-colors cursor-pointer py-1 border-b-2 ${
                currentTab === 'home'
                  ? 'border-teal-800 text-teal-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-teal-800'
              }`}
              id="nav-home-btn"
            >
              Home
            </button>
            <button
              onClick={() => setCurrentTab('services')}
              className={`transition-colors cursor-pointer py-1 border-b-2 ${
                currentTab === 'services'
                  ? 'border-teal-800 text-teal-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-teal-800'
              }`}
              id="nav-services-btn"
            >
              Services
            </button>
            <button
              onClick={() => setCurrentTab('about')}
              className={`transition-colors cursor-pointer py-1 border-b-2 ${
                currentTab === 'about'
                  ? 'border-teal-800 text-teal-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-teal-800'
              }`}
              id="nav-about-btn"
            >
              About Us
            </button>
            <button
              onClick={() => setCurrentTab('contact')}
              className={`transition-colors cursor-pointer py-1 border-b-2 ${
                currentTab === 'contact'
                  ? 'border-teal-800 text-teal-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-teal-800'
              }`}
              id="nav-contact-btn"
            >
              Contact
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-4">
            {/* Phone Link */}
            <a 
              href={`tel:${clinicPhone}`}
              className="hidden lg:flex items-center space-x-2 text-sm font-medium text-slate-700 hover:text-teal-800 transition-colors bg-slate-100/80 px-3 py-2 rounded-lg border border-slate-200/60"
            >
              <Phone className="w-4 h-4 text-teal-700" />
              <span>{clinicPhone}</span>
            </a>

            {/* Admin Toggle Button */}
            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                currentTab === 'admin'
                  ? 'bg-teal-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Admin Portal"
              id="nav-admin-portal-btn"
            >
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>{isAdminLoggedIn ? 'Admin Dashboard' : 'Admin Login'}</span>
            </button>

            {/* Book Appointment CTA */}
            <button
              onClick={() => setCurrentTab('booking')}
              className="flex items-center space-x-2 bg-teal-800 hover:bg-teal-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-md shadow-teal-900/10 hover:shadow-lg transition-all transform active:scale-95 cursor-pointer"
              id="nav-book-appointment-btn"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
