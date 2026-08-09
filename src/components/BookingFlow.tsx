import React, { useState, useEffect } from 'react';
import { 
  Check, Calendar as CalendarIcon, Clock, User, Mail, Phone, FileText, 
  ChevronLeft, ChevronRight, ShieldCheck, Sparkles, AlertCircle, ArrowRight, CheckCircle2,
  MapPin, DollarSign
} from 'lucide-react';
import { Service, BusinessHour, BlockedDate, Appointment, ClinicSetting, TimeSlot } from '../types';
import { generateAvailableSlots, formatDateToYYYYMMDD, formatTimeLabel, parseDateTime } from '../lib/availability';
import { createAppointment } from '../lib/db';

interface BookingFlowProps {
  services: Service[];
  businessHours: BusinessHour[];
  blockedDates: BlockedDate[];
  existingAppointments: Appointment[];
  clinicSettings: ClinicSetting;
  preselectedServiceId?: string;
  onAppointmentCreated: () => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  services,
  businessHours,
  blockedDates,
  existingAppointments,
  clinicSettings,
  preselectedServiceId,
  onAppointmentCreated
}) => {
  // Step State: 1 = Service, 2 = Date & Time, 3 = Details, 4 = Confirmation
  const [step, setStep] = useState<number>(1);

  // Form selections
  const [selectedServiceId, setSelectedServiceId] = useState<string>(preselectedServiceId || (services[0]?.id || ''));
  
  // Default date = tomorrow or next open weekday
  const getInitialDate = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDateToYYYYMMDD(tomorrow);
  };

  const [selectedDateStr, setSelectedDateStr] = useState<string>(getInitialDate());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Patient Info
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // UI & Loading States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  // Month navigation for date picker
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(() => new Date());

  // Update selectedService if preselectedServiceId changes
  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
    }
  }, [preselectedServiceId]);

  const activeServices = services.filter(s => s.is_active);
  const selectedService = activeServices.find(s => s.id === selectedServiceId) || activeServices[0];

  // Calculate slots whenever selectedDateStr or selectedService changes
  const availableSlots = selectedService 
    ? generateAvailableSlots(selectedDateStr, selectedService, businessHours, blockedDates, existingAppointments, clinicSettings)
    : [];

  // Reset selected slot if date changes
  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDateStr, selectedServiceId]);

  // Handle Form Submit
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedSlot) return;

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setSubmitError('Please fill in all required contact details.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const app = await createAppointment({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        service_id: selectedService.id,
        appointment_date: selectedDateStr,
        start_time: selectedSlot.startTimeStr,
        end_time: selectedSlot.endTimeStr,
        status: 'confirmed',
        notes: notes.trim()
      });

      setCreatedAppointment(app);
      onAppointmentCreated();
      setStep(4);
    } catch (err) {
      console.error('Booking error:', err);
      setSubmitError('Failed to record appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calendar Helper Functions
  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (delta: number) => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const renderCalendarDays = () => {
    const totalDays = daysInMonth(currentMonthDate);
    const startDay = firstDayOfMonth(currentMonthDate);
    const days = [];

    // Today Date for disabling past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Padding empty cells
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), d);
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const dateString = `${yyyy}-${mm}-${dd}`;

      const isPast = dateObj < today;
      const isSelected = dateString === selectedDateStr;

      // Check if blocked or closed
      const weekday = dateObj.getDay();
      const bh = businessHours.find(b => Number(b.weekday) === weekday);
      const isClosed = !bh || !bh.is_open;
      const isBlocked = blockedDates.some(b => b.blocked_date === dateString);

      const isDisabled = isPast || isClosed || isBlocked;

      days.push(
        <button
          key={`day-${d}`}
          disabled={isDisabled}
          onClick={() => setSelectedDateStr(dateString)}
          className={`h-10 w-10 rounded-full text-xs font-semibold flex items-center justify-center transition-all cursor-pointer relative ${
            isSelected
              ? 'bg-teal-800 text-white shadow-md shadow-teal-900/20 scale-105 ring-2 ring-teal-800 ring-offset-2'
              : isDisabled
              ? 'text-slate-300 cursor-not-allowed bg-slate-50/50'
              : 'text-slate-700 hover:bg-teal-50 hover:text-teal-900'
          }`}
          id={`date-select-${dateString}`}
        >
          <span>{d}</span>
          {!isDisabled && !isSelected && (
            <span className="absolute bottom-1 w-1 h-1 rounded-full bg-teal-600/70" />
          )}
        </button>
      );
    }

    return days;
  };

  // Group slots into Morning and Afternoon
  const morningSlots = availableSlots.filter(s => s.start.getHours() < 12);
  const afternoonSlots = availableSlots.filter(s => s.start.getHours() >= 12);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden max-w-5xl mx-auto my-8">
      
      {/* Header Bar */}
      <div className="bg-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-800/80 text-teal-200 text-xs font-semibold tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Easy Online Reservation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight">
              Book your appointment
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Select a service and date that fits your schedule in just a few quick steps.
            </p>
          </div>
          
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-300 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure SSL Encrypted</span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 mt-8 pt-6 border-t border-slate-800">
          
          {/* Step 1 */}
          <div 
            onClick={() => step > 1 && setStep(1)}
            className={`flex items-center space-x-2 sm:space-x-3 cursor-pointer ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === 1 ? 'bg-teal-500 text-slate-900 shadow-md ring-2 ring-teal-400/50' : step > 1 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-white">Service</p>
              <p className="text-[11px] text-slate-400">Choose treatment</p>
            </div>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => step > 2 && setStep(2)}
            className={`flex items-center space-x-2 sm:space-x-3 cursor-pointer ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === 2 ? 'bg-teal-500 text-slate-900 shadow-md ring-2 ring-teal-400/50' : step > 2 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {step > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-white">Date & Time</p>
              <p className="text-[11px] text-slate-400">Select schedule</p>
            </div>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => step > 3 && setStep(3)}
            className={`flex items-center space-x-2 sm:space-x-3 cursor-pointer ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === 3 ? 'bg-teal-500 text-slate-900 shadow-md ring-2 ring-teal-400/50' : step > 3 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {step > 3 ? <Check className="w-4 h-4" /> : '3'}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-white">Your Details</p>
              <p className="text-[11px] text-slate-400">Contact info</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className={`flex items-center space-x-2 sm:space-x-3 ${step === 4 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === 4 ? 'bg-emerald-400 text-slate-900 shadow-md' : 'bg-slate-800 text-slate-400'
            }`}>
              4
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-white">Confirmation</p>
              <p className="text-[11px] text-slate-400">Summary</p>
            </div>
          </div>

        </div>

      </div>

      {/* Main Body Grid */}
      <div className="p-6 sm:p-8">
        
        {step < 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Interactive Selection Step */}
            <div className="lg:col-span-8">
              
              {/* STEP 1: SERVICE SELECTION */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-slate-900">Select a Service</h3>
                    <p className="text-sm text-slate-500 mt-1">Choose the primary dental care treatment you require.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeServices.map((srv) => {
                      const isSelected = srv.id === selectedServiceId;
                      return (
                        <div
                          key={srv.id}
                          onClick={() => setSelectedServiceId(srv.id)}
                          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between h-full ${
                            isSelected
                              ? 'border-teal-800 bg-teal-50/40 shadow-md ring-1 ring-teal-800'
                              : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                          }`}
                          id={`service-card-${srv.id}`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="w-10 h-10 rounded-xl bg-teal-100/70 text-teal-800 flex items-center justify-center font-bold text-sm">
                                {srv.name.charAt(0)}
                              </div>
                              {isSelected && (
                                <div className="w-6 h-6 rounded-full bg-teal-800 text-white flex items-center justify-center">
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>

                            <h4 className="font-semibold text-slate-900 text-base leading-snug">{srv.name}</h4>
                            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                              {srv.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200/60 text-xs">
                            <span className="flex items-center text-slate-600 font-medium">
                              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                              {srv.duration_minutes} min
                            </span>
                            <span className="font-bold text-teal-900 text-sm">
                              {srv.price === 0 ? 'Free Consultation' : `$${srv.price}`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!selectedServiceId}
                      className="inline-flex items-center space-x-2 bg-teal-800 hover:bg-teal-900 text-white px-6 py-3 rounded-xl font-medium shadow-md transition-all disabled:opacity-50 cursor-pointer"
                      id="booking-step1-continue-btn"
                    >
                      <span>Continue to Schedule</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: DATE & TIME SELECTION */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-slate-900">Select Date & Time</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Available slots for <span className="font-semibold text-teal-900">{selectedService?.name}</span> ({selectedService?.duration_minutes} min).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    
                    {/* Month Calendar Box */}
                    <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                      
                      {/* Calendar Month Header */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={() => changeMonth(-1)}
                          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-sm text-slate-800">
                          {currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                          onClick={() => changeMonth(1)}
                          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Day Name Header */}
                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <span key={day} className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {day}
                          </span>
                        ))}
                      </div>

                      {/* Calendar Day Grid */}
                      <div className="grid grid-cols-7 gap-1 justify-items-center">
                        {renderCalendarDays()}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-around text-[11px] text-slate-500">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-teal-800" />
                          <span>Selected</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-teal-600" />
                          <span>Available</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                          <span>Unavailable</span>
                        </div>
                      </div>

                    </div>

                    {/* Time Slots Area */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-900">
                          Available Times for{' '}
                          <span className="text-teal-800">
                            {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </h4>
                      </div>

                      {availableSlots.length === 0 ? (
                        <div className="p-6 bg-amber-50/60 rounded-2xl border border-amber-200 text-center">
                          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-amber-900">No Open Slots Available</p>
                          <p className="text-xs text-amber-700 mt-1">
                            The clinic is either closed or fully booked on this date. Please pick another date on the calendar.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                          
                          {/* Morning Slots */}
                          {morningSlots.length > 0 && (
                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Morning</p>
                              <div className="grid grid-cols-2 gap-2">
                                {morningSlots.map((slot) => {
                                  const isSelected = selectedSlot?.startTimeStr === slot.startTimeStr;
                                  return (
                                    <button
                                      key={slot.startTimeStr}
                                      onClick={() => setSelectedSlot(slot)}
                                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                                        isSelected
                                          ? 'bg-teal-800 text-white border-teal-800 shadow-md ring-2 ring-teal-800/50'
                                          : 'bg-white text-slate-700 border-slate-200 hover:border-teal-600 hover:bg-teal-50/50'
                                      }`}
                                      id={`slot-${slot.startTimeStr}`}
                                    >
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>{slot.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Afternoon Slots */}
                          {afternoonSlots.length > 0 && (
                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Afternoon</p>
                              <div className="grid grid-cols-2 gap-2">
                                {afternoonSlots.map((slot) => {
                                  const isSelected = selectedSlot?.startTimeStr === slot.startTimeStr;
                                  return (
                                    <button
                                      key={slot.startTimeStr}
                                      onClick={() => setSelectedSlot(slot)}
                                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                                        isSelected
                                          ? 'bg-teal-800 text-white border-teal-800 shadow-md ring-2 ring-teal-800/50'
                                          : 'bg-white text-slate-700 border-slate-200 hover:border-teal-600 hover:bg-teal-50/50'
                                      }`}
                                      id={`slot-${slot.startTimeStr}`}
                                    >
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>{slot.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                        </div>
                      )}

                    </div>

                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                    <button
                      onClick={() => setStep(1)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-medium cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!selectedSlot}
                      className="inline-flex items-center space-x-2 bg-teal-800 hover:bg-teal-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-md transition-all disabled:opacity-50 cursor-pointer"
                      id="booking-step2-continue-btn"
                    >
                      <span>Continue to Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PATIENT CONTACT DETAILS */}
              {step === 3 && (
                <form onSubmit={handleConfirmBooking} className="space-y-6">
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-slate-900">Your Contact Details</h3>
                    <p className="text-sm text-slate-500 mt-1">Please enter your contact details to reserve your visit.</p>
                  </div>

                  {submitError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Eleanor Vance"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-800 focus:ring-2 focus:ring-teal-800/20 outline-none text-sm bg-white"
                          id="input-full-name"
                        />
                      </div>
                    </div>

                    {/* Email & Phone Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Email */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="eleanor@example.com"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-800 focus:ring-2 focus:ring-teal-800/20 outline-none text-sm bg-white"
                            id="input-email"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="(415) 555-0199"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-800 focus:ring-2 focus:ring-teal-800/20 outline-none text-sm bg-white"
                            id="input-phone"
                          />
                        </div>
                      </div>

                    </div>

                    {/* Optional Notes */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Optional Notes or Health Concerns
                      </label>
                      <div className="relative">
                        <FileText className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                        <textarea
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="e.g. Sensitive teeth, anxiety, or specific questions..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-800 focus:ring-2 focus:ring-teal-800/20 outline-none text-sm bg-white"
                          id="input-notes"
                        />
                      </div>
                    </div>

                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-medium cursor-pointer"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center space-x-2 bg-teal-800 hover:bg-teal-900 text-white px-7 py-3 rounded-xl text-sm font-medium shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                      id="booking-confirm-submit-btn"
                    >
                      {isSubmitting ? (
                        <span>Processing...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-teal-200" />
                          <span>Confirm & Book Appointment</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* Right Persistent Appointment Summary Card */}
            <div className="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
              <div>
                <h4 className="font-serif font-semibold text-slate-900 text-base">Your appointment</h4>
                <p className="text-xs text-slate-500 mt-0.5">Real-time booking preview</p>
              </div>

              {/* Selected Service Box */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selected Service</span>
                  <button onClick={() => setStep(1)} className="text-[11px] font-semibold text-teal-800 hover:underline cursor-pointer">
                    Change
                  </button>
                </div>
                {selectedService ? (
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{selectedService.name}</p>
                    <div className="flex items-center justify-between mt-1 text-xs text-slate-600">
                      <span>{selectedService.duration_minutes} min duration</span>
                      <span className="font-bold text-teal-900">
                        {selectedService.price === 0 ? 'Free' : `$${selectedService.price}`}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No service selected yet</p>
                )}
              </div>

              {/* Selected Date & Time Box */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date & Time</span>
                  {step > 2 && (
                    <button onClick={() => setStep(2)} className="text-[11px] font-semibold text-teal-800 hover:underline cursor-pointer">
                      Change
                    </button>
                  )}
                </div>
                {selectedDateStr && selectedSlot ? (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800">
                      <CalendarIcon className="w-3.5 h-3.5 text-teal-700" />
                      <span>
                        {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-bold text-teal-900">
                      <Clock className="w-3.5 h-3.5 text-teal-700" />
                      <span>{selectedSlot.label} ({selectedSlot.startTimeStr} - {selectedSlot.endTimeStr})</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Select a date and time slot</p>
                )}
              </div>

              {/* Location Box */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1 text-xs text-slate-600">
                <div className="flex items-center space-x-2 font-semibold text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span>{clinicSettings.clinic_name}</span>
                </div>
                <p className="text-[11px] text-slate-500 pl-5.5">{clinicSettings.clinic_address}</p>
              </div>

              {/* Guarantees */}
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 space-y-1.5">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>No upfront payment required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant email notification</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION SCREEN */}
        {step === 4 && createdAppointment && (
          <div className="text-center py-8 px-4 max-w-2xl mx-auto space-y-6">
            
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Appointment Confirmed
              </span>
              <h3 className="text-3xl font-serif text-slate-900 mt-3 font-semibold">
                We look forward to seeing you, {createdAppointment.full_name}!
              </h3>
              <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
                A confirmation has been logged in our system. You will receive a reminder prior to your scheduled visit.
              </p>
            </div>

            {/* Confirmation Card */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs text-slate-500">Booking Reference</span>
                <span className="text-xs font-mono font-bold text-slate-900">{createdAppointment.id}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400 font-medium">Service</p>
                  <p className="font-semibold text-slate-900 text-sm mt-0.5">{selectedService?.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Date & Time</p>
                  <p className="font-semibold text-slate-900 text-sm mt-0.5">
                    {new Date(createdAppointment.appointment_date + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}{' '}
                    at {createdAppointment.start_time}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Patient Contact</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{createdAppointment.email}</p>
                  <p className="text-slate-600">{createdAppointment.phone}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Location</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{clinicSettings.clinic_name}</p>
                  <p className="text-slate-600">{clinicSettings.clinic_address}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  setStep(1);
                  setCreatedAppointment(null);
                  setFullName('');
                  setEmail('');
                  setPhone('');
                  setNotes('');
                }}
                className="px-6 py-3 rounded-xl bg-teal-800 text-white font-medium hover:bg-teal-900 shadow-md cursor-pointer text-sm"
                id="book-another-appointment-btn"
              >
                Book Another Visit
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
