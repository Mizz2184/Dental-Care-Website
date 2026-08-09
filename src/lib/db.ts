import { supabase, isSupabaseConfigured } from './supabase';
import { Service, Appointment, BusinessHour, BlockedDate, ClinicSetting, AppointmentStatus } from '../types';

// Default Seed Data
export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'Preventive Checkup & Cleaning',
    description: 'Routine oral exam, digital X-rays, gentle ultrasonic scaling, and personalized preventative care.',
    duration_minutes: 45,
    price: 149,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
    category: 'Preventive'
  },
  {
    id: 'srv-2',
    name: 'Teeth Whitening',
    description: 'Professional in-office laser whitening treatment to safely brighten teeth up to 8 shades in one session.',
    duration_minutes: 60,
    price: 299,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    category: 'Cosmetic'
  },
  {
    id: 'srv-3',
    name: 'Dental Implant Consultation',
    description: 'Comprehensive 3D CBCT scan, surgical evaluation, and custom implant restoration planning.',
    duration_minutes: 30,
    price: 0,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
    category: 'Restorative'
  },
  {
    id: 'srv-4',
    name: 'Orthodontic & Clear Aligner Consultation',
    description: 'Digital 3D intraoral scan and customized invisible aligner treatment plan for teens and adults.',
    duration_minutes: 30,
    price: 0,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800',
    category: 'Orthodontics'
  },
  {
    id: 'srv-5',
    name: 'Restorative Crown & Fitting',
    description: 'High-strength ceramic porcelain crowns designed to match your natural tooth shade perfectly.',
    duration_minutes: 60,
    price: 450,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    category: 'Restorative'
  },
  {
    id: 'srv-6',
    name: 'Periodontal Care & Deep Cleaning',
    description: 'Specialized gum treatment, scaling, and root planing to prevent and control periodontal disease.',
    duration_minutes: 60,
    price: 280,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    category: 'Periodontics'
  }
];

export const INITIAL_BUSINESS_HOURS: BusinessHour[] = [
  { id: 'bh-0', weekday: 0, is_open: false, start_time: '09:00', end_time: '17:00' },
  { id: 'bh-1', weekday: 1, is_open: true, start_time: '08:00', end_time: '18:00' },
  { id: 'bh-2', weekday: 2, is_open: true, start_time: '08:00', end_time: '18:00' },
  { id: 'bh-3', weekday: 3, is_open: true, start_time: '08:00', end_time: '18:00' },
  { id: 'bh-4', weekday: 4, is_open: true, start_time: '08:00', end_time: '18:00' },
  { id: 'bh-5', weekday: 5, is_open: true, start_time: '08:00', end_time: '17:00' },
  { id: 'bh-6', weekday: 6, is_open: true, start_time: '09:00', end_time: '15:00' }
];

export const INITIAL_CLINIC_SETTINGS: ClinicSetting = {
  id: 'setting-1',
  clinic_name: 'Harbor View Dental',
  clinic_email: 'care@harborviewdental.com',
  clinic_phone: '(415) 555-0123',
  clinic_address: '245 Ocean Avenue, Suite 400, San Francisco, CA 94112',
  slot_interval_minutes: 30,
  booking_notice_hours: 2,
  created_at: new Date().toISOString()
};

export const INITIAL_BLOCKED_DATES: BlockedDate[] = [
  {
    id: 'blk-1',
    blocked_date: '2026-11-26',
    reason: 'Thanksgiving Holiday',
    created_at: new Date().toISOString()
  },
  {
    id: 'blk-2',
    blocked_date: '2026-12-25',
    reason: 'Christmas Holiday',
    created_at: new Date().toISOString()
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-101',
    full_name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '(415) 892-1204',
    service_id: 'srv-1',
    appointment_date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '09:45',
    status: 'confirmed',
    notes: 'Prefers morning appointments. Mild sensitive teeth.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'app-102',
    full_name: 'Marcus Vance',
    email: 'marcus.v@example.com',
    phone: '(415) 341-9921',
    service_id: 'srv-2',
    appointment_date: new Date().toISOString().split('T')[0],
    start_time: '11:00',
    end_time: '12:00',
    status: 'pending',
    notes: 'First time teeth whitening.',
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

// Helper to interact with Local Storage fallback
const getItem = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(`hvd_${key}`);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(`hvd_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
};

// ==========================================
// SERVICES API
// ==========================================
export async function fetchServices(): Promise<Service[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
    if (!error && data && data.length > 0) {
      return data as Service[];
    }
  }
  return getItem('services', INITIAL_SERVICES);
}

export async function saveService(service: Partial<Service> & { id?: string }): Promise<Service> {
  const isNew = !service.id;
  const newId = service.id || `srv-${Date.now()}`;
  const payload: Service = {
    id: newId,
    name: service.name || 'Untitled Service',
    description: service.description || '',
    duration_minutes: Number(service.duration_minutes) || 30,
    price: Number(service.price) || 0,
    is_active: service.is_active !== undefined ? service.is_active : true,
    created_at: service.created_at || new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    if (isNew) {
      const { data, error } = await supabase.from('services').insert([payload]).select().single();
      if (!error && data) return data as Service;
    } else {
      const { data, error } = await supabase.from('services').update(payload).eq('id', service.id).select().single();
      if (!error && data) return data as Service;
    }
  }

  // Fallback local persistence
  const services = getItem('services', INITIAL_SERVICES);
  const existingIdx = services.findIndex(s => s.id === payload.id);
  if (existingIdx >= 0) {
    services[existingIdx] = payload;
  } else {
    services.push(payload);
  }
  setItem('services', services);
  return payload;
}

export async function deleteService(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (!error) return true;
  }

  const services = getItem('services', INITIAL_SERVICES);
  const filtered = services.filter(s => s.id !== id);
  setItem('services', filtered);
  return true;
}

// ==========================================
// APPOINTMENTS API
// ==========================================
export async function fetchAppointments(): Promise<Appointment[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('appointments').select('*').order('appointment_date', { ascending: true });
    if (!error && data) {
      return data as Appointment[];
    }
  }
  return getItem('appointments', INITIAL_APPOINTMENTS);
}

export async function createAppointment(app: Omit<Appointment, 'id' | 'created_at' | 'status'> & { status?: AppointmentStatus }): Promise<Appointment> {
  const newApp: Appointment = {
    id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    full_name: app.full_name,
    email: app.email,
    phone: app.phone,
    service_id: app.service_id,
    appointment_date: app.appointment_date,
    start_time: app.start_time,
    end_time: app.end_time,
    status: app.status || 'pending',
    notes: app.notes || '',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('appointments').insert([{
      full_name: newApp.full_name,
      email: newApp.email,
      phone: newApp.phone,
      service_id: newApp.service_id,
      appointment_date: newApp.appointment_date,
      start_time: newApp.start_time,
      end_time: newApp.end_time,
      status: newApp.status,
      notes: newApp.notes
    }]).select().single();

    if (!error && data) return data as Appointment;
  }

  const list = getItem('appointments', INITIAL_APPOINTMENTS);
  list.push(newApp);
  setItem('appointments', list);
  return newApp;
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<boolean> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (!error) return true;
  }

  const list = getItem('appointments', INITIAL_APPOINTMENTS);
  const idx = list.findIndex(a => a.id === id);
  if (idx >= 0) {
    list[idx].status = status;
    setItem('appointments', list);
  }
  return true;
}

// ==========================================
// BUSINESS HOURS API
// ==========================================
export async function fetchBusinessHours(): Promise<BusinessHour[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('business_hours').select('*').order('weekday', { ascending: true });
    if (!error && data && data.length > 0) {
      return data as BusinessHour[];
    }
  }
  return getItem('business_hours', INITIAL_BUSINESS_HOURS);
}

export async function saveBusinessHours(hours: BusinessHour[]): Promise<BusinessHour[]> {
  if (isSupabaseConfigured) {
    for (const h of hours) {
      await supabase.from('business_hours').upsert({
        id: h.id.startsWith('bh-') ? undefined : h.id,
        weekday: h.weekday,
        is_open: h.is_open,
        start_time: h.start_time,
        end_time: h.end_time
      }, { onConflict: 'weekday' });
    }
  }

  setItem('business_hours', hours);
  return hours;
}

// ==========================================
// BLOCKED DATES API
// ==========================================
export async function fetchBlockedDates(): Promise<BlockedDate[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('blocked_dates').select('*').order('blocked_date', { ascending: true });
    if (!error && data) {
      return data as BlockedDate[];
    }
  }
  return getItem('blocked_dates', INITIAL_BLOCKED_DATES);
}

export async function addBlockedDate(blocked_date: string, reason: string): Promise<BlockedDate> {
  const newItem: BlockedDate = {
    id: `blk-${Date.now()}`,
    blocked_date,
    reason,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('blocked_dates').insert([{
      blocked_date,
      reason
    }]).select().single();
    if (!error && data) return data as BlockedDate;
  }

  const list = getItem('blocked_dates', INITIAL_BLOCKED_DATES);
  list.push(newItem);
  setItem('blocked_dates', list);
  return newItem;
}

export async function deleteBlockedDate(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('blocked_dates').delete().eq('id', id);
    if (!error) return true;
  }

  const list = getItem('blocked_dates', INITIAL_BLOCKED_DATES);
  const filtered = list.filter(b => b.id !== id);
  setItem('blocked_dates', filtered);
  return true;
}

// ==========================================
// CLINIC SETTINGS API
// ==========================================
export async function fetchClinicSettings(): Promise<ClinicSetting> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('clinic_settings').select('*').limit(1).single();
    if (!error && data) {
      return data as ClinicSetting;
    }
  }
  return getItem('clinic_settings', INITIAL_CLINIC_SETTINGS);
}

export async function saveClinicSettings(settings: Partial<ClinicSetting>): Promise<ClinicSetting> {
  const current = await fetchClinicSettings();
  const updated: ClinicSetting = {
    ...current,
    ...settings
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('clinic_settings').upsert({
      id: current.id,
      clinic_name: updated.clinic_name,
      clinic_email: updated.clinic_email,
      clinic_phone: updated.clinic_phone,
      clinic_address: updated.clinic_address,
      slot_interval_minutes: updated.slot_interval_minutes,
      booking_notice_hours: updated.booking_notice_hours
    }).select().single();

    if (!error && data) return data as ClinicSetting;
  }

  setItem('clinic_settings', updated);
  return updated;
}

export const SUPABASE_SQL_SCHEMA = `-- COPY AND RUN THIS IN YOUR SUPABASE SQL EDITOR TO CREATE TABLES EXACTLY PER CONTRACT

-- 1. Services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  price NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Business Hours table
CREATE TABLE IF NOT EXISTS public.business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weekday INTEGER NOT NULL UNIQUE, -- 0=Sun, 1=Mon, ..., 6=Sat
  is_open BOOLEAN NOT NULL DEFAULT true,
  start_time TIME NOT NULL DEFAULT '08:00',
  end_time TIME NOT NULL DEFAULT '18:00'
);

-- 4. Blocked Dates table
CREATE TABLE IF NOT EXISTS public.blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocked_date DATE NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Clinic Settings table
CREATE TABLE IF NOT EXISTS public.clinic_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_name TEXT NOT NULL,
  clinic_email TEXT NOT NULL,
  clinic_phone TEXT NOT NULL,
  clinic_address TEXT NOT NULL,
  slot_interval_minutes INTEGER NOT NULL DEFAULT 30,
  booking_notice_hours INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) policies
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active services, business hours, blocked dates & clinic settings
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public read business_hours" ON public.business_hours FOR SELECT USING (true);
CREATE POLICY "Public read blocked_dates" ON public.blocked_dates FOR SELECT USING (true);
CREATE POLICY "Public read clinic_settings" ON public.clinic_settings FOR SELECT USING (true);

-- Allow public to insert appointments
CREATE POLICY "Public insert appointments" ON public.appointments FOR INSERT WITH CHECK (true);

-- Allow authenticated admins full access
CREATE POLICY "Admin full services" ON public.services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full appointments" ON public.appointments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full business_hours" ON public.business_hours FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full blocked_dates" ON public.blocked_dates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full clinic_settings" ON public.clinic_settings FOR ALL USING (auth.role() = 'authenticated');
`;
