import React from 'react';
import { ShieldCheck, HeartHandshake, Sparkles, ArrowRight, UserCheck } from 'lucide-react';

interface HeroProps {
  onBookClick: () => void;
  onAboutClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookClick, onAboutClick }) => {
  return (
    <section className="relative pt-6 pb-12 lg:pt-10 lg:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-100/70 text-teal-800 text-xs font-semibold tracking-wider uppercase border border-teal-200/80">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>Modern Care. Personal Touch.</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-slate-900 leading-[1.12] tracking-tight font-normal">
              Thoughtful dental care for a <span className="italic text-teal-800 font-serif">healthier, brighter</span> you.
            </h1>

            {/* Paragraph */}
            <p className="text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
              We combine advanced digital imaging with gentle, patient-centered techniques to deliver painless treatments, restored confidence, and lifelong healthy smiles.
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-white/80 border border-slate-200/60 shadow-xs">
                <div className="p-2 bg-teal-50 rounded-lg text-teal-800 shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Patient Focused</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Care that puts you first</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-white/80 border border-slate-200/60 shadow-xs">
                <div className="p-2 bg-teal-50 rounded-lg text-teal-800 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Advanced Tech</h4>
                  <p className="text-xs text-slate-500 mt-0.5">3D scans & low radiation</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-white/80 border border-slate-200/60 shadow-xs">
                <div className="p-2 bg-teal-50 rounded-lg text-teal-800 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Secure & Private</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Protected health records</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onBookClick}
                className="inline-flex items-center space-x-2 bg-teal-800 hover:bg-teal-900 text-white font-medium px-6 py-3.5 rounded-xl shadow-md shadow-teal-900/15 hover:shadow-lg transition-all transform active:scale-95 cursor-pointer text-base"
                id="hero-book-visit-btn"
              >
                <span>Book your visit</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onAboutClick}
                className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 text-slate-700 font-medium px-5 py-3.5 rounded-xl border border-slate-200 shadow-xs transition-colors cursor-pointer text-base"
                id="hero-meet-team-btn"
              >
                <HeartHandshake className="w-4 h-4 text-teal-700" />
                <span>Meet our team</span>
              </button>
            </div>

          </div>

          {/* Right Media Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Background decorative blob */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-teal-100 rounded-full blur-2xl opacity-50 -z-10" />
              
              {/* Main Image Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000"
                  alt="Modern Dental Clinic Operatory"
                  className="w-full h-[420px] lg:h-[480px] object-cover object-center"
                />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">Accepting New Patients</p>
                      <p className="text-[11px] text-slate-500">Same-day emergency slots available</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                    4.9 ★ Rating
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
