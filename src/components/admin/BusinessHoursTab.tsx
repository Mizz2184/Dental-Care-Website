import React, { useState } from 'react';
import { Clock, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { BusinessHour } from '../../types';

interface BusinessHoursTabProps {
  businessHours: BusinessHour[];
  onSaveHours: (hours: BusinessHour[]) => Promise<void>;
}

const WEEKDAYS = [
  { id: 0, label: 'Sunday' },
  { id: 1, label: 'Monday' },
  { id: 2, label: 'Tuesday' },
  { id: 3, label: 'Wednesday' },
  { id: 4, label: 'Thursday' },
  { id: 5, label: 'Friday' },
  { id: 6, label: 'Saturday' },
];

export const BusinessHoursTab: React.FC<BusinessHoursTabProps> = ({
  businessHours,
  onSaveHours
}) => {
  const [hoursState, setHoursState] = useState<BusinessHour[]>(businessHours);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleToggleOpen = (weekday: number) => {
    setHoursState(prev => prev.map(bh => {
      if (Number(bh.weekday) === weekday) {
        return { ...bh, is_open: !bh.is_open };
      }
      return bh;
    }));
  };

  const handleTimeChange = (weekday: number, field: 'start_time' | 'end_time', value: string) => {
    setHoursState(prev => prev.map(bh => {
      if (Number(bh.weekday) === weekday) {
        return { ...bh, [field]: value };
      }
      return bh;
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMsg(null);
    try {
      await onSaveHours(hoursState);
      setSuccessMsg('Business hours successfully updated!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Error saving hours:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif text-slate-900 font-semibold">Business Working Hours</h2>
          <p className="text-xs text-slate-500 mt-1">
            Define daily clinic opening and closing times. Slot availability will adjust automatically.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center space-x-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 self-start sm:self-auto"
          id="btn-save-business-hours"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Schedule'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Weekday Hours Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden p-6 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {WEEKDAYS.map((day) => {
            const bh = hoursState.find(b => Number(b.weekday) === day.id) || {
              id: `bh-${day.id}`,
              weekday: day.id,
              is_open: true,
              start_time: '08:00',
              end_time: '17:00'
            };

            return (
              <div
                key={day.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  bh.is_open ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200/60 opacity-60'
                }`}
              >
                
                {/* Weekday name & toggle */}
                <div className="flex items-center space-x-4 min-w-[180px]">
                  <input
                    type="checkbox"
                    id={`toggle-weekday-${day.id}`}
                    checked={bh.is_open}
                    onChange={() => handleToggleOpen(day.id)}
                    className="w-5 h-5 text-teal-800 border-slate-300 rounded focus:ring-teal-800 cursor-pointer"
                  />
                  <label htmlFor={`toggle-weekday-${day.id}`} className="font-semibold text-sm text-slate-900 cursor-pointer">
                    {day.label}
                  </label>
                </div>

                {/* Status Indicator */}
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  bh.is_open ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {bh.is_open ? 'Open' : 'Closed'}
                </span>

                {/* Time Picker Controls */}
                {bh.is_open ? (
                  <div className="flex items-center space-x-3 text-xs">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-500 font-medium">Opens:</span>
                      <input
                        type="time"
                        value={bh.start_time}
                        onChange={(e) => handleTimeChange(day.id, 'start_time', e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 focus:border-teal-800 outline-none text-xs bg-white font-medium"
                      />
                    </div>

                    <span className="text-slate-300">—</span>

                    <div className="flex items-center space-x-1.5">
                      <span className="text-slate-500 font-medium">Closes:</span>
                      <input
                        type="time"
                        value={bh.end_time}
                        onChange={(e) => handleTimeChange(day.id, 'end_time', e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 focus:border-teal-800 outline-none text-xs bg-white font-medium"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">No appointments generated on this day</span>
                )}

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
