import React, { useState } from 'react';
import { Calendar, Plus, Trash2, AlertCircle, Ban } from 'lucide-react';
import { BlockedDate } from '../../types';

interface BlockedDatesTabProps {
  blockedDates: BlockedDate[];
  onAddBlockedDate: (blocked_date: string, reason: string) => Promise<void>;
  onDeleteBlockedDate: (id: string) => Promise<void>;
}

export const BlockedDatesTab: React.FC<BlockedDatesTabProps> = ({
  blockedDates,
  onAddBlockedDate,
  onDeleteBlockedDate
}) => {
  const [newDate, setNewDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !reason.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddBlockedDate(newDate, reason.trim());
      setNewDate('');
      setReason('');
    } catch (err) {
      console.error('Error adding blocked date:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif text-slate-900 font-semibold">Blocked Practice Dates</h2>
        <p className="text-xs text-slate-500 mt-1">
          Block off holidays, clinic maintenance, or staff training days. Patients will not be able to book on these dates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Add Blocked Date Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2">
            <Ban className="w-4 h-4 text-rose-600" />
            <h3 className="font-serif text-base font-semibold text-slate-900">Block a New Date</h3>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-800 outline-none text-xs bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason / Holiday Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Staff Training Day / Thanksgiving"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-800 outline-none text-xs bg-slate-50/50"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rose-700 hover:bg-rose-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              id="btn-add-blocked-date"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Add Blocked Date'}</span>
            </button>
          </form>
        </div>

        {/* Existing Blocked Dates Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-serif text-base font-semibold text-slate-900">Currently Blocked Dates</h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              {blockedDates.length} blocked
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px] bg-slate-50/70">
                  <th className="py-3.5 px-4 font-bold">Blocked Date</th>
                  <th className="py-3.5 px-4 font-bold">Reason</th>
                  <th className="py-3.5 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {blockedDates.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400">
                      No blocked dates specified.
                    </td>
                  </tr>
                ) : (
                  blockedDates.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {item.blocked_date}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {item.reason}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onDeleteBlockedDate(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Unblock date"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
