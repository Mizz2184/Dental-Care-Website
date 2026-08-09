import React from 'react';
import { ShieldCheck, UserCheck, Sparkles, Award, Heart, CheckCircle2, Star } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const teamMembers = [
    {
      name: 'Dr. Emily Chen, DDS',
      role: 'General & Preventative Dentist',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
      bio: 'Graduated top of her class at UCSF School of Dentistry. Passionate about gentle preventative care and restorative aesthetics.'
    },
    {
      name: 'Dr. Michael Rodriguez, DMD',
      role: 'Cosmetic & Implant Specialist',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
      bio: 'Over 12 years of experience in porcelain veneers, full mouth rehabilitations, and guided dental implant surgery.'
    },
    {
      name: 'Dr. Sarah Williams, DDS',
      role: 'Orthodontics & Clear Aligners',
      image: 'https://images.unsplash.com/photo-1594824813571-24a69c100d3a?auto=format&fit=crop&q=80&w=600',
      bio: 'Invisalign Gold Provider specializing in adult orthodontic alignment and pediatric interceptive orthodontics.'
    },
    {
      name: 'Jessica Lee, RDH',
      role: 'Lead Dental Hygienist',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
      bio: 'Dedicated to thorough ultrasonic scaling, gum health maintenance, and patient comfort.'
    }
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-100" id="about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Top Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              About Harbor View Dental
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-slate-900 font-normal leading-tight">
              Care you can trust. <br />
              <span className="italic text-teal-800 font-serif">Smiles that last.</span>
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              At Harbor View Dental, we combine state-of-the-art diagnostic technology with genuine human warmth. We believe dental visits should be calm, informative, and completely tailored to your individual comfort.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <Heart className="w-5 h-5 text-teal-800" />
                <h4 className="font-semibold text-slate-900 text-sm">Patient First</h4>
                <p className="text-xs text-slate-500">Your comfort and well-being come first.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <ShieldCheck className="w-5 h-5 text-teal-800" />
                <h4 className="font-semibold text-slate-900 text-sm">Advanced Care</h4>
                <p className="text-xs text-slate-500">3D imaging & low-impact tools.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <Award className="w-5 h-5 text-teal-800" />
                <h4 className="font-semibold text-slate-900 text-sm">Trusted Team</h4>
                <p className="text-xs text-slate-500">Experienced clinicians you can count on.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-slate-100 bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=1000"
                alt="Clinic Lounge and Reception"
                className="w-full h-[400px] object-cover object-center"
              />
            </div>
          </div>

        </div>

        {/* Team Section */}
        <div className="space-y-8 pt-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">Meet Our Doctors & Staff</span>
            <h3 className="text-3xl font-serif text-slate-900 font-normal">
              Experienced, compassionate, dedicated to you.
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all">
                <div className="h-56 bg-slate-200 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 space-y-1">
                  <h4 className="font-semibold text-slate-900 text-base">{member.name}</h4>
                  <p className="text-xs font-medium text-teal-800">{member.role}</p>
                  <p className="text-xs text-slate-500 pt-2 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Banner */}
        <div className="bg-teal-900 text-white rounded-3xl p-8 lg:p-12 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-teal-800">
          <div className="space-y-1 pt-4 md:pt-0">
            <p className="text-4xl lg:text-5xl font-serif font-bold text-teal-200">5,000+</p>
            <p className="text-sm font-medium text-teal-100">Happy Local Patients</p>
          </div>
          <div className="space-y-1 pt-4 md:pt-0">
            <p className="text-4xl lg:text-5xl font-serif font-bold text-teal-200">15+ Years</p>
            <p className="text-sm font-medium text-teal-100">In San Francisco Community</p>
          </div>
          <div className="space-y-1 pt-4 md:pt-0">
            <div className="flex items-center justify-center space-x-1 text-amber-400">
              <Star className="w-6 h-6 fill-amber-400" />
              <span className="text-4xl lg:text-5xl font-serif font-bold text-white">4.9</span>
            </div>
            <p className="text-sm font-medium text-teal-100">Average Patient Rating</p>
          </div>
        </div>

      </div>
    </section>
  );
};
