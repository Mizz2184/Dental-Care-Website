import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BookingFlow } from './components/BookingFlow';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

import {
  Service,
  Appointment,
  BusinessHour,
  BlockedDate,
  ClinicSetting,
  AppointmentStatus
} from './types';

import {
  fetchServices,
  fetchAppointments,
  fetchBusinessHours,
  fetchBlockedDates,
  fetchClinicSettings,
  saveService,
  deleteService,
  updateAppointmentStatus,
  saveBusinessHours,
  addBlockedDate,
  deleteBlockedDate,
  saveClinicSettings,
  INITIAL_SERVICES,
  INITIAL_BUSINESS_HOURS,
  INITIAL_CLINIC_SETTINGS,
  INITIAL_BLOCKED_DATES,
  INITIAL_APPOINTMENTS
} from './lib/db';

export default function App() {
  // Navigation View State
  const [currentTab, setCurrentTab] = useState<'home' | 'services' | 'about' | 'contact' | 'booking' | 'admin'>('home');
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('hvd_admin_session') === 'true';
  });

  // DB State
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>(INITIAL_BUSINESS_HOURS);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(INITIAL_BLOCKED_DATES);
  const [clinicSettings, setClinicSettings] = useState<ClinicSetting>(INITIAL_CLINIC_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch all records from database
  const loadDatabaseData = useCallback(async () => {
    try {
      const [sData, aData, hData, bData, cData] = await Promise.all([
        fetchServices(),
        fetchAppointments(),
        fetchBusinessHours(),
        fetchBlockedDates(),
        fetchClinicSettings()
      ]);

      if (sData) setServices(sData);
      if (aData) setAppointments(aData);
      if (hData) setBusinessHours(hData);
      if (bData) setBlockedDates(bData);
      if (cData) setClinicSettings(cData);
    } catch (err) {
      console.error('Error loading clinic database records:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDatabaseData();
  }, [loadDatabaseData]);

  // Handler to trigger booking flow with preselected service
  const handleSelectServiceToBook = (serviceId: string) => {
    setPreselectedServiceId(serviceId);
    setCurrentTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mutation Handlers
  const handleAppointmentCreated = async () => {
    const updatedApps = await fetchAppointments();
    setAppointments(updatedApps);
  };

  const handleUpdateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    await updateAppointmentStatus(id, status);
    const updatedApps = await fetchAppointments();
    setAppointments(updatedApps);
  };

  const handleSaveService = async (service: Partial<Service> & { id?: string }) => {
    await saveService(service);
    const updated = await fetchServices();
    setServices(updated);
  };

  const handleDeleteService = async (id: string) => {
    await deleteService(id);
    const updated = await fetchServices();
    setServices(updated);
  };

  const handleSaveBusinessHours = async (hours: BusinessHour[]) => {
    await saveBusinessHours(hours);
    const updated = await fetchBusinessHours();
    setBusinessHours(updated);
  };

  const handleAddBlockedDate = async (blocked_date: string, reason: string) => {
    await addBlockedDate(blocked_date, reason);
    const updated = await fetchBlockedDates();
    setBlockedDates(updated);
  };

  const handleDeleteBlockedDate = async (id: string) => {
    await deleteBlockedDate(id);
    const updated = await fetchBlockedDates();
    setBlockedDates(updated);
  };

  const handleSaveClinicSettings = async (settings: Partial<ClinicSetting>) => {
    const updated = await saveClinicSettings(settings);
    setClinicSettings(updated);
  };

  // Render Admin View
  if (currentTab === 'admin') {
    if (!isAdminLoggedIn) {
      return (
        <AdminLogin
          onLoginSuccess={() => setIsAdminLoggedIn(true)}
          onBackToPublic={() => setCurrentTab('home')}
        />
      );
    }

    return (
      <AdminDashboard
        services={services}
        appointments={appointments}
        businessHours={businessHours}
        blockedDates={blockedDates}
        clinicSettings={clinicSettings}
        onRefreshData={loadDatabaseData}
        onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
        onSaveService={handleSaveService}
        onDeleteService={handleDeleteService}
        onSaveBusinessHours={handleSaveBusinessHours}
        onAddBlockedDate={handleAddBlockedDate}
        onDeleteBlockedDate={handleDeleteBlockedDate}
        onSaveClinicSettings={handleSaveClinicSettings}
        onSignOut={() => setIsAdminLoggedIn(false)}
        onViewPublicSite={() => setCurrentTab('home')}
      />
    );
  }

  // Render Public Website View
  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-800 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* Sticky Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        clinicPhone={clinicSettings.clinic_phone}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Page Contents */}
      <main className="flex-1">
        
        {/* HOME VIEW */}
        {currentTab === 'home' && (
          <div>
            <Hero
              onBookClick={() => {
                setCurrentTab('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onAboutClick={() => {
                setCurrentTab('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Embedded Booking Section on Home Page */}
            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <BookingFlow
                services={services}
                businessHours={businessHours}
                blockedDates={blockedDates}
                existingAppointments={appointments}
                clinicSettings={clinicSettings}
                preselectedServiceId={preselectedServiceId}
                onAppointmentCreated={handleAppointmentCreated}
              />
            </div>

            <ServicesSection
              services={services}
              onSelectServiceToBook={handleSelectServiceToBook}
            />

            <AboutSection />

            <ContactSection
              clinicSettings={clinicSettings}
              businessHours={businessHours}
              onBookClick={() => {
                setCurrentTab('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* SERVICES VIEW */}
        {currentTab === 'services' && (
          <div className="py-8">
            <ServicesSection
              services={services}
              onSelectServiceToBook={handleSelectServiceToBook}
            />
          </div>
        )}

        {/* ABOUT VIEW */}
        {currentTab === 'about' && (
          <div className="py-8">
            <AboutSection />
          </div>
        )}

        {/* CONTACT VIEW */}
        {currentTab === 'contact' && (
          <div className="py-8">
            <ContactSection
              clinicSettings={clinicSettings}
              businessHours={businessHours}
              onBookClick={() => {
                setCurrentTab('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* BOOKING DEDICATED VIEW */}
        {currentTab === 'booking' && (
          <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <BookingFlow
              services={services}
              businessHours={businessHours}
              blockedDates={blockedDates}
              existingAppointments={appointments}
              clinicSettings={clinicSettings}
              preselectedServiceId={preselectedServiceId}
              onAppointmentCreated={handleAppointmentCreated}
            />
          </div>
        )}

      </main>

      {/* Global Footer */}
      <Footer
        clinicSettings={clinicSettings}
        setCurrentTab={setCurrentTab}
      />

    </div>
  );
}
