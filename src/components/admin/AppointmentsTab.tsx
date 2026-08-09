import React, { useState } from 'react';
import { Search, Calendar, Filter, CheckCircle2, XCircle, Clock, FileText, Phone, Mail, User } from 'lucide-react';
import { Appointment, Service, AppointmentStatus } from '../../types';

interface AppointmentsTabProps {
  appointments: Appointment[];
  services: Service[];
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
}

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({
  appointments,
  services,
  onUpdateStatus
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedAppModal, setSelectedAppModal] = useState<Appointment | null>(null);

  const filteredAppointments = appointments.filter(app => {
    // Status filter
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    
    // Date filter
    if (dateFilter && app.appointment_date !== dateFilter) return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = app.full_name.toLowerCase().includes(q);
      const matchEmail = app.email.toLowerCase().includes(q);
      const matchPhone = app.phone.toLowerCase().includes(q);
      const srv = services.find(s => s.id === app.service_id);
      const matchSrv = srv?.name.toLowerCase().includes(q) || false;
      if (!matchName && !matchEmail && !matchPhone && !matchSrv) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif text-slate-900 font-semibold">Manage Appointments</h2>
          <p className="text-xs text-slate-500 mt-1">
            Review patient bookings, approve requests, and update visit statuses.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
          {filteredAppointments.length} matching appointment{filteredAppointments.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient name, email, phone..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-800 outline-none bg-slate-50/50"
          />
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-800 outline-none bg-slate-50/50 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="sm:col-span-3">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-800 outline-none bg-slate-50/50"
          />
        </div>

      </div>

      {/* Appointments List / Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px] bg-slate-50/70">
                <th className="py-3.5 px-4 font-bold">Patient Details</th>
                <th className="py-3.5 px-4 font-bold">Service & Price</th>
                <th className="py-3.5 px-4 font-bold">Scheduled Date & Time</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No appointments match the current search filters.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((app) => {
                  const srv = services.find(s => s.id === app.service_id);
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-900 text-sm">{app.full_name}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{app.email} • {app.phone}</p>
                        {app.notes && (
                          <p className="text-[11px] text-teal-800 italic mt-1 line-clamp-1">
                            Note: "{app.notes}"
                          </p>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-800">{srv?.name || 'Treatment Visit'}</p>
                        <p className="text-xs text-slate-500 font-medium">
                          {srv ? (srv.price === 0 ? 'Free' : `$${srv.price}`) : '-'} ({srv?.duration_minutes || 30} min)
                        </p>
                      </td>

                      <td className="py-4 px-4 text-slate-700">
                        <p className="font-bold">{app.appointment_date}</p>
                        <p className="text-xs text-slate-500">{app.start_time} - {app.end_time}</p>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          app.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          app.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          
                          {/* Quick details button */}
                          <button
                            onClick={() => setSelectedAppModal(app)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg cursor-pointer"
                            title="View details"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          {/* Status Actions */}
                          {app.status !== 'confirmed' && (
                            <button
                              onClick={() => onUpdateStatus(app.id, 'confirmed')}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium cursor-pointer"
                            >
                              Confirm
                            </button>
                          )}

                          {app.status === 'confirmed' && (
                            <button
                              onClick={() => onUpdateStatus(app.id, 'completed')}
                              className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium cursor-pointer"
                            >
                              Complete
                            </button>
                          )}

                          {app.status !== 'cancelled' && (
                            <button
                              onClick={() => onUpdateStatus(app.id, 'cancelled')}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-rose-100 hover:text-rose-800 text-slate-600 rounded-lg font-medium cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400">Ref ID: {selectedAppModal.id}</span>
                <h3 className="text-xl font-serif font-semibold text-slate-900">Appointment Details</h3>
              </div>
              <button
                onClick={() => setSelectedAppModal(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <p className="text-slate-400 font-medium">Patient</p>
                <p className="text-sm font-bold text-slate-900">{selectedAppModal.full_name}</p>
                <p className="text-slate-600">{selectedAppModal.email} • {selectedAppModal.phone}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <p className="text-slate-400 font-medium">Service</p>
                  <p className="font-bold text-slate-900">
                    {services.find(s => s.id === selectedAppModal.service_id)?.name || 'Treatment'}
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <p className="text-slate-400 font-medium">Schedule</p>
                  <p className="font-bold text-slate-900">{selectedAppModal.appointment_date}</p>
                  <p className="text-slate-600">{selectedAppModal.start_time} - {selectedAppModal.end_time}</p>
                </div>
              </div>

              {selectedAppModal.notes && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1 text-amber-900">
                  <p className="font-semibold">Patient Notes</p>
                  <p>{selectedAppModal.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedAppModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
