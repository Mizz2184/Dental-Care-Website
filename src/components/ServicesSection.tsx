import React, { useState } from 'react';
import { Clock, DollarSign, ArrowRight, Sparkles, Check, Info } from 'lucide-react';
import { Service } from '../types';

interface ServicesSectionProps {
  services: Service[];
  onSelectServiceToBook: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceToBook
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [detailModalService, setDetailModalService] = useState<Service | null>(null);

  const activeServices = services.filter(s => s.is_active);

  const categories = ['All', 'Preventive', 'Cosmetic', 'Restorative', 'Orthodontics', 'Periodontics'];

  const filteredServices = selectedCategory === 'All'
    ? activeServices
    : activeServices.filter(s => s.category === selectedCategory || (selectedCategory === 'Preventive' && s.name.toLowerCase().includes('checkup')));

  return (
    <section className="py-16 bg-[#fbfbfa]" id="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-100/70 text-teal-800 text-xs font-semibold tracking-wider uppercase border border-teal-200/80">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Comprehensive Dental Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-slate-900 font-normal">
            Specialized dental care tailored to your smile.
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            From routine preventive checkups to advanced cosmetic restorations, our modern treatments are designed for comfort, longevity, and natural aesthetics.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-teal-800 text-white shadow-md shadow-teal-900/15'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
                id={`cat-filter-${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Visual Image Header */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={service.image_url || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800'}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Category badge */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-teal-900 text-[11px] font-semibold px-3 py-1 rounded-full shadow-xs">
                    {service.category || 'General Care'}
                  </span>

                  {/* Price badge */}
                  <span className="absolute bottom-3 right-3 bg-teal-900 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-md">
                    {service.price === 0 ? 'Free Consultation' : `$${service.price}`}
                  </span>
                </div>

                {/* Content Padding */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-teal-700" />
                    <span>{service.duration_minutes} Minutes</span>
                  </div>

                  <h3 className="text-xl font-serif font-semibold text-slate-900 group-hover:text-teal-800 transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                <button
                  onClick={() => setDetailModalService(service)}
                  className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 mr-1" />
                  <span>Learn details</span>
                </button>

                <button
                  onClick={() => onSelectServiceToBook(service.id)}
                  className="inline-flex items-center space-x-1.5 bg-teal-50 hover:bg-teal-800 hover:text-white text-teal-800 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-teal-100"
                  id={`book-service-btn-${service.id}`}
                >
                  <span>Book Visit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Modal for Service Details */}
        {detailModalService && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              
              <div className="relative h-48 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-4 overflow-hidden rounded-t-3xl">
                <img
                  src={detailModalService.image_url || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800'}
                  alt={detailModalService.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md">
                  {detailModalService.category || 'Treatment'}
                </span>
                <h3 className="text-2xl font-serif font-semibold text-slate-900 mt-2">
                  {detailModalService.name}
                </h3>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {detailModalService.description}
              </p>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Estimated Duration</span>
                  <p className="font-bold text-slate-800 mt-0.5">{detailModalService.duration_minutes} Minutes</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Treatment Fee</span>
                  <p className="font-bold text-teal-900 mt-0.5">
                    {detailModalService.price === 0 ? 'Free Consultation' : `$${detailModalService.price}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setDetailModalService(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const id = detailModalService.id;
                    setDetailModalService(null);
                    onSelectServiceToBook(id);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-teal-800 text-white hover:bg-teal-900 text-xs font-semibold shadow-md cursor-pointer"
                >
                  Proceed to Booking
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
