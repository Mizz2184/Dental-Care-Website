import React, { useState } from 'react';
import { Save, CheckCircle2, Copy, Code, Database, ShieldCheck } from 'lucide-react';
import { ClinicSetting } from '../../types';
import { SUPABASE_SQL_SCHEMA } from '../../lib/db';

interface SettingsTabProps {
  clinicSettings: ClinicSetting;
  onSaveSettings: (settings: Partial<ClinicSetting>) => Promise<void>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  clinicSettings,
  onSaveSettings
}) => {
  const [name, setName] = useState<string>(clinicSettings.clinic_name);
  const [email, setEmail] = useState<string>(clinicSettings.clinic_email);
  const [phone, setPhone] = useState<string>(clinicSettings.clinic_phone);
  const [address, setAddress] = useState<string>(clinicSettings.clinic_address);
  const [slotInterval, setSlotInterval] = useState<number>(clinicSettings.slot_interval_minutes || 30);
  const [noticeHours, setNoticeHours] = useState<number>(clinicSettings.booking_notice_hours || 2);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [showSql, setShowSql] = useState<boolean>(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);

    try {
      await onSaveSettings({
        clinic_name: name.trim(),
        clinic_email: email.trim(),
        clinic_phone: phone.trim(),
        clinic_address: address.trim(),
        slot_interval_minutes: Number(slotInterval),
        booking_notice_hours: Number(noticeHours)
      });
      setSuccessMsg('Clinic settings updated successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif text-slate-900 font-semibold">Clinic Practice Settings</h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage practice contact information, booking interval logic, and database parameters.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Clinic Practice Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-800 outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Clinic Contact Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-800 outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-800 outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Physical Practice Address
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-800 outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Time Slot Step Interval (Minutes)
            </label>
            <select
              value={slotInterval}
              onChange={(e) => setSlotInterval(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-800 outline-none text-xs bg-white cursor-pointer"
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>60 Minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Advance Booking Notice Window (Hours)
            </label>
            <select
              value={noticeHours}
              onChange={(e) => setNoticeHours(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-800 outline-none text-xs bg-white cursor-pointer"
            >
              <option value={1}>1 Hour in advance</option>
              <option value={2}>2 Hours in advance</option>
              <option value={4}>4 Hours in advance</option>
              <option value={12}>12 Hours in advance</option>
              <option value={24}>24 Hours in advance</option>
            </select>
          </div>

        </div>

        <div className="pt-4 flex justify-end border-t border-slate-100">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center space-x-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            id="btn-save-clinic-settings"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>

      {/* Supabase Schema Helper Drawer */}
      <div className="bg-slate-900 text-slate-200 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-teal-400" />
            <h3 className="font-serif text-lg font-semibold text-white">Supabase SQL Database Setup</h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSql(!showSql)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer border border-slate-700"
            >
              {showSql ? 'Hide SQL Script' : 'View SQL Script'}
            </button>

            <button
              onClick={handleCopySql}
              className="px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs flex items-center space-x-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedSql ? 'Copied!' : 'Copy Schema SQL'}</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Need to initialize your Supabase Postgres database? Copy this exact SQL schema definition and run it in your Supabase SQL Editor. It creates all required tables and sets up strict RLS policies.
        </p>

        {showSql && (
          <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-[300px]">
            {SUPABASE_SQL_SCHEMA}
          </pre>
        )}
      </div>

    </div>
  );
};
