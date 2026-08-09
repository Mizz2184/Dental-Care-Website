import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { ClinicSetting, BusinessHour } from '../types';

interface ContactSectionProps {
  clinicSettings: ClinicSetting;
  businessHours: BusinessHour[];
  onBookClick: () => void;
}

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ContactSection: React.FC<ContactSectionProps> = ({
  clinicSettings,
  businessHours,
  onBookClick
}) => {
  return (
    <section className="py-16 bg-slate-900 text-white" id="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-300 bg-teal-950 px-3 py-1 rounded-full border border-teal-800">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal">Visit our San Francisco practice</h2>
          <p className="text-slate-300 text-sm">
            Conveniently located with accessible parking and modern amenities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Clinic Information Card */}
          <div className="bg-slate-800/90 p-8 rounded-3xl border border-slate-700/80 space-y-6">
            <h3 className="font-serif text-xl font-semibold text-white">Contact Info</h3>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Address</p>
                  <p className="text-xs text-slate-400 mt-0.5">{clinicSettings.clinic_address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Phone</p>
                  <a href={`tel:${clinicSettings.clinic_phone}`} className="text-xs text-teal-300 hover:underline mt-0.5 block">
                    {clinicSettings.clinic_phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <a href={`mailto:${clinicSettings.clinic_email}`} className="text-xs text-teal-300 hover:underline mt-0.5 block">
                    {clinicSettings.clinic_email}
                  </a>
                </div>
              </div>
            </div>

            <button
              onClick={onBookClick}
              className="w-full bg-teal-700 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-xl text-sm transition-colors cursor-pointer text-center block shadow-md"
            >
              Book Your Appointment
            </button>
          </div>

          {/* Business Hours Summary Table */}
          <div className="bg-slate-800/90 p-8 rounded-3xl border border-slate-700/80 space-y-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-teal-400" />
              <h3 className="font-serif text-xl font-semibold text-white">Clinic Hours</h3>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              {businessHours.map((bh) => (
                <div key={bh.weekday} className="flex items-center justify-between py-1.5 border-b border-slate-700/50">
                  <span className="font-medium text-slate-200">{WEEKDAY_NAMES[bh.weekday]}</span>
                  <span>
                    {bh.is_open ? (
                      <span className="font-semibold text-emerald-400">{bh.start_time} - {bh.end_time}</span>
                    ) : (
                      <span className="text-slate-500 italic">Closed</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Map Location Card */}
          <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 overflow-hidden relative min-h-[280px] flex flex-col justify-between p-6">
            <div className="space-y-2 relative z-10">
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Interactive Location</span>
              <h4 className="text-lg font-semibold text-white">San Francisco, Ocean Avenue</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Located near public transit and guest parking garage in Suite 400.
              </p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700 text-xs text-slate-300 space-y-2 mt-6">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Emergency Dental Care Available</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Call us immediately for severe tooth pain or emergency trauma appointments.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
