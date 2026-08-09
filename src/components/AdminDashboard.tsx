import React, { useState } from 'react';
import { 
  LayoutDashboard, Calendar, Layers, Clock, Ban, Settings, LogOut, ShieldCheck, 
  Sparkles, ExternalLink, RefreshCw
} from 'lucide-react';
import { Service, Appointment, BusinessHour, BlockedDate, ClinicSetting, AppointmentStatus } from '../types';
import { OverviewTab } from './admin/OverviewTab';
import { AppointmentsTab } from './admin/AppointmentsTab';
import { ServicesTab } from './admin/ServicesTab';
import { BusinessHoursTab } from './admin/BusinessHoursTab';
import { BlockedDatesTab } from './admin/BlockedDatesTab';
import { SettingsTab } from './admin/SettingsTab';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminDashboardProps {
  services: Service[];
  appointments: Appointment[];
  businessHours: BusinessHour[];
  blockedDates: BlockedDate[];
  clinicSettings: ClinicSetting;
  onRefreshData: () => Promise<void>;
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  onSaveService: (service: Partial<Service> & { id?: string }) => Promise<void>;
  onDeleteService: (id: string) => Promise<void>;
  onSaveBusinessHours: (hours: BusinessHour[]) => Promise<void>;
  onAddBlockedDate: (blocked_date: string, reason: string) => Promise<void>;
  onDeleteBlockedDate: (id: string) => Promise<void>;
  onSaveClinicSettings: (settings: Partial<ClinicSetting>) => Promise<void>;
  onSignOut: () => void;
  onViewPublicSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  services,
  appointments,
  businessHours,
  blockedDates,
  clinicSettings,
  onRefreshData,
  onUpdateAppointmentStatus,
  onSaveService,
  onDeleteService,
  onSaveBusinessHours,
  onAddBlockedDate,
  onDeleteBlockedDate,
  onSaveClinicSettings,
  onSignOut,
  onViewPublicSite
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'services' | 'hours' | 'blocked' | 'settings'>('overview');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleSignOut = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Signout error:', err);
    }
    localStorage.removeItem('hvd_admin_session');
    onSignOut();
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      
      {/* Top Navbar Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-teal-300" />
              </div>
              <div>
                <span className="font-serif text-base font-semibold tracking-wide text-white block leading-none">
                  HARBOR VIEW
                </span>
                <span className="text-[9px] uppercase tracking-widest text-teal-400 font-bold">
                  ADMIN DASHBOARD
                </span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-3 text-xs">
              
              <button
                onClick={handleManualRefresh}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer transition-colors"
                title="Refresh database records"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-400' : ''}`} />
              </button>

              <button
                onClick={onViewPublicSite}
                className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium cursor-pointer transition-colors border border-slate-700"
              >
                <span>View Website</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1 text-slate-400" />
              </button>

              <button
                onClick={handleSignOut}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-200 rounded-lg font-medium cursor-pointer transition-colors border border-rose-900/50"
                id="admin-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-4 shadow-2xs space-y-1 sticky top-24">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-teal-900 text-white shadow-md shadow-teal-950/10'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
            id="tab-overview-btn"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-teal-900 text-white shadow-md shadow-teal-950/10'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
            id="tab-appointments-btn"
          >
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4" />
              <span>Appointments</span>
            </div>
            {appointments.filter(a => a.status === 'pending').length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold">
                {appointments.filter(a => a.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'services'
                ? 'bg-teal-900 text-white shadow-md shadow-teal-950/10'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
            id="tab-services-btn"
          >
            <Layers className="w-4 h-4" />
            <span>Services & Pricing</span>
          </button>

          <button
            onClick={() => setActiveTab('hours')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'hours'
                ? 'bg-teal-900 text-white shadow-md shadow-teal-950/10'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
            id="tab-business-hours-btn"
          >
            <Clock className="w-4 h-4" />
            <span>Business Hours</span>
          </button>

          <button
            onClick={() => setActiveTab('blocked')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'blocked'
                ? 'bg-teal-900 text-white shadow-md shadow-teal-950/10'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
            id="tab-blocked-dates-btn"
          >
            <Ban className="w-4 h-4" />
            <span>Blocked Dates</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-teal-900 text-white shadow-md shadow-teal-950/10'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
            id="tab-settings-btn"
          >
            <Settings className="w-4 h-4" />
            <span>Clinic Settings</span>
          </button>

          {/* Connected Database Status Badge */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Database Engine</p>
            <div className="flex items-center space-x-1.5 text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isSupabaseConfigured ? 'Supabase Postgres Connected' : 'Local Persistence Active'}</span>
            </div>
          </div>

        </aside>

        {/* Tab Content Display Area */}
        <main className="lg:col-span-9">
          {activeTab === 'overview' && (
            <OverviewTab
              appointments={appointments}
              services={services}
              onNavigateToTab={(tab) => {
                if (tab === 'hours') setActiveTab('hours');
                else if (tab === 'blocked') setActiveTab('blocked');
                else setActiveTab(tab);
              }}
              onUpdateStatus={onUpdateAppointmentStatus}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsTab
              appointments={appointments}
              services={services}
              onUpdateStatus={onUpdateAppointmentStatus}
            />
          )}

          {activeTab === 'services' && (
            <ServicesTab
              services={services}
              onSaveService={onSaveService}
              onDeleteService={onDeleteService}
            />
          )}

          {activeTab === 'hours' && (
            <BusinessHoursTab
              businessHours={businessHours}
              onSaveHours={onSaveBusinessHours}
            />
          )}

          {activeTab === 'blocked' && (
            <BlockedDatesTab
              blockedDates={blockedDates}
              onAddBlockedDate={onAddBlockedDate}
              onDeleteBlockedDate={onDeleteBlockedDate}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              clinicSettings={clinicSettings}
              onSaveSettings={onSaveClinicSettings}
            />
          )}
        </main>

      </div>

    </div>
  );
};
