import React from 'react';
import { ShieldCheck, Calendar, Phone, Heart } from 'lucide-react';
import { ClinicSetting } from '../types';

interface FooterProps {
  clinicSettings: ClinicSetting;
  setCurrentTab: (tab: 'home' | 'services' | 'about' | 'contact' | 'booking' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ clinicSettings, setCurrentTab }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-serif text-lg font-semibold">
              <div className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center">
                <svg className="w-5 h-5 fill-current text-teal-100" viewBox="0 0 24 24">
                  <path d="M12 2C8.5 2 6 4.5 6 8c0 3 1.5 6.5 2.5 10 .5 1.7 1.3 4 3.5 4 1.2 0 1.8-.8 2-1.5.2.7.8 1.5 2 1.5 2.2 0 3-2.3 3.5-4C20.5 14.5 22 11 22 8c0-3.5-2.5-6-6-6h-4zm-3 6c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3z"/>
                </svg>
              </div>
              <span>HARBOR VIEW DENTAL</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Premium modern dental care & cosmetic aesthetics in San Francisco. Dedicated to gentle, lifelong smile health.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Quick Navigation</h4>
            <ul className="space-y-1.5">
              <li><button onClick={() => setCurrentTab('home')} className="hover:text-white transition-colors cursor-pointer">Home</button></li>
              <li><button onClick={() => setCurrentTab('services')} className="hover:text-white transition-colors cursor-pointer">Treatments & Services</button></li>
              <li><button onClick={() => setCurrentTab('about')} className="hover:text-white transition-colors cursor-pointer">Our Dental Team</button></li>
              <li><button onClick={() => setCurrentTab('booking')} className="hover:text-white transition-colors cursor-pointer">Online Booking</button></li>
              <li><button onClick={() => setCurrentTab('admin')} className="hover:text-teal-400 transition-colors cursor-pointer text-teal-500 font-semibold">Admin Portal</button></li>
            </ul>
          </div>

          {/* Legal / Hours */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Patient Guarantees</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              All personal health information is handled with strict confidentiality in compliance with HIPAA best practices.
            </p>
            <div className="flex items-center space-x-1.5 text-teal-400 font-medium pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Supabase Backend Security</span>
            </div>
          </div>

          {/* Contact Summary */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Contact Practice</h4>
            <p className="text-slate-300 font-semibold">{clinicSettings.clinic_name}</p>
            <p className="text-slate-400">{clinicSettings.clinic_address}</p>
            <p className="text-teal-300 font-medium">{clinicSettings.clinic_phone}</p>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Harbor View Dental. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for healthcare excellence</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
