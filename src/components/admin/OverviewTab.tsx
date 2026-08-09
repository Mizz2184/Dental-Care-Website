import React from 'react';
import { Calendar, Clock, DollarSign, CheckCircle, AlertCircle, Layers, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Appointment, Service } from '../../types';

interface OverviewTabProps {
  appointments: Appointment[];
  services: Service[];
  onNavigateToTab: (tab: 'appointments' | 'services' | 'hours' | 'blocked' | 'settings') => void;
  onUpdateStatus: (id: string, status: 'confirmed' | 'cancelled' | 'completed') => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  appointments,
  services,
  onNavigateToTab,
  onUpdateStatus
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const totalAppointments = appointments.length;
  const todayApps = appointments.filter(a => a.appointment_date === todayStr && a.status !== 'cancelled');
  const pendingApps = appointments.filter(a => a.status === 'pending');
  const confirmedApps = appointments.filter(a => a.status === 'confirmed');

  // Estimate total booked revenue
  const estimatedRevenue = appointments
    .filter(a => a.status !== 'cancelled')
    .reduce((sum, app) => {
      const service = services.find(s => s.id === app.service_id);
      return sum + (service ? service.price : 0);
    }, 0);

  const activeServicesCount = services.filter(s => s.is_active).length;

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-teal-900 text-white p-6 rounded-3xl shadow-lg">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300">Practice Metrics</span>
          <h2 className="text-2xl font-serif font-normal text-white mt-1">Dashboard Overview</h2>
          <p className="text-xs text-teal-100/80 mt-1">
            Real-time appointment schedule, services catalog, and system operational stats.
          </p>
        </div>

        <button
          onClick={() => onNavigateToTab('appointments')}
          className="bg-teal-700 hover:bg-teal-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1.5 cursor-pointer shrink-0"
        >
          <span>View All Appointments</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-500">Total Bookings</span>
            <div className="p-2 bg-teal-50 rounded-lg text-teal-800">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalAppointments}</p>
          <p className="text-[11px] text-slate-400">{pendingApps.length} pending review</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-500">Today's Visits</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{todayApps.length}</p>
          <p className="text-[11px] text-slate-400">Scheduled for today</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-500">Active Services</span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-800">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{activeServicesCount}</p>
          <p className="text-[11px] text-slate-400">Published in booking flow</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-500">Est. Treatment Value</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-teal-900">${estimatedRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">Confirmed & pending value</p>
        </div>

      </div>

      {/* Recent Appointments Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-semibold text-slate-900">Recent Appointment Requests</h3>
            <p className="text-xs text-slate-500">Most recent bookings logged in the database</p>
          </div>
          <button
            onClick={() => onNavigateToTab('appointments')}
            className="text-xs font-semibold text-teal-800 hover:underline cursor-pointer"
          >
            Manage All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3 font-bold">Patient</th>
                <th className="py-3 px-3 font-bold">Service</th>
                <th className="py-3 px-3 font-bold">Date & Time</th>
                <th className="py-3 px-3 font-bold">Status</th>
                <th className="py-3 px-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.slice(0, 5).map((app) => {
                const srv = services.find(s => s.id === app.service_id);
                return (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-slate-900">{app.full_name}</p>
                      <p className="text-[11px] text-slate-400">{app.email} • {app.phone}</p>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-700">
                      {srv?.name || 'Treatment Visit'}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">
                      <p className="font-semibold">{app.appointment_date}</p>
                      <p className="text-[11px] text-slate-400">{app.start_time} - {app.end_time}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        app.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {app.status === 'pending' && (
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => onUpdateStatus(app.id, 'confirmed')}
                            className="px-2.5 py-1 bg-emerald-700 text-white hover:bg-emerald-800 rounded-lg text-[11px] font-medium cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => onUpdateStatus(app.id, 'cancelled')}
                            className="px-2.5 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-[11px] font-medium cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
