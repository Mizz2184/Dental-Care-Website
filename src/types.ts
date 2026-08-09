export interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  created_at?: string;
  // Optional client visual field for rich card representation
  image_url?: string;
  category?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service_id: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  status: AppointmentStatus;
  notes: string;
  created_at?: string;
  // Join helper for UI
  service_name?: string;
}

export interface BusinessHour {
  id: string;
  weekday: number; // 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
  is_open: boolean;
  start_time: string; // e.g. "08:30"
  end_time: string; // e.g. "17:00"
}

export interface BlockedDate {
  id: string;
  blocked_date: string; // YYYY-MM-DD
  reason: string;
  created_at?: string;
}

export interface ClinicSetting {
  id: string;
  clinic_name: string;
  clinic_email: string;
  clinic_phone: string;
  clinic_address: string;
  slot_interval_minutes: number;
  booking_notice_hours: number;
  created_at?: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  label: string; // e.g. "10:30 AM"
  startTimeStr: string; // e.g. "10:30"
  endTimeStr: string; // e.g. "11:15"
  isAvailable: boolean;
}
