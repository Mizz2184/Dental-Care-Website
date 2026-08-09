import { Service, BusinessHour, BlockedDate, Appointment, ClinicSetting, TimeSlot } from '../types';

/**
 * Helper to safely construct a valid Date object from a date string (YYYY-MM-DD) and a time string (HH:mm or HH:mm:ss).
 */
export function parseDateTime(dateStr: string, timeStr: string): Date | null {
  if (!dateStr || !timeStr) return null;
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes)) {
      return null;
    }
    
    return new Date(year, month - 1, day, hours, minutes, 0, 0);
  } catch {
    return null;
  }
}

/**
 * Format a Date object into 12-hour label (e.g., "10:30 AM")
 */
export function formatTimeLabel(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Formats a Date object as YYYY-MM-DD cleanly in local time zone
 */
export function formatDateToYYYYMMDD(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Generate normalized time slots for a given date and service.
 */
export function generateAvailableSlots(
  dateStr: string, // 'YYYY-MM-DD'
  service: Service,
  businessHours: BusinessHour[],
  blockedDates: BlockedDate[],
  existingAppointments: Appointment[],
  settings: ClinicSetting
): TimeSlot[] {
  if (!dateStr || !service) return [];

  // 1. Check if the date is explicitly blocked
  const isBlocked = blockedDates.some(b => b.blocked_date === dateStr);
  if (isBlocked) return [];

  // 2. Parse selected date to find weekday (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const [year, month, day] = dateStr.split('-').map(Number);
  const selectedDateObj = new Date(year, month - 1, day);
  if (isNaN(selectedDateObj.getTime())) return [];

  const weekday = selectedDateObj.getDay();

  // 3. Get business hours for this weekday
  const bh = businessHours.find(b => Number(b.weekday) === weekday);
  if (!bh || !bh.is_open) return [];

  // 4. Construct day opening and closing Date objects
  const dayStart = parseDateTime(dateStr, bh.start_time);
  const dayEnd = parseDateTime(dateStr, bh.end_time);

  if (!dayStart || !dayEnd || dayStart >= dayEnd) return [];

  // 5. Enforce booking notice hours
  const now = new Date();
  const noticeMs = (settings.booking_notice_hours || 0) * 60 * 60 * 1000;
  const minAllowedTime = new Date(now.getTime() + noticeMs);

  // 6. Filter existing appointments for this date that are active
  const activeAppsOnDate = existingAppointments.filter(app => {
    return app.appointment_date === dateStr && app.status !== 'cancelled';
  });

  const slots: TimeSlot[] = [];
  const intervalMs = (settings.slot_interval_minutes || 30) * 60 * 1000;
  const serviceDurationMs = (service.duration_minutes || 30) * 60 * 1000;

  let currentStart = new Date(dayStart.getTime());

  while (currentStart.getTime() + serviceDurationMs <= dayEnd.getTime()) {
    const currentEnd = new Date(currentStart.getTime() + serviceDurationMs);

    // Check notice window
    const meetsNoticeWindow = currentStart.getTime() >= minAllowedTime.getTime();

    // Check overlap with existing appointments
    // Overlap rule: new_start < existing_end AND new_end > existing_start
    let hasOverlap = false;

    if (meetsNoticeWindow) {
      for (const app of activeAppsOnDate) {
        const appStart = parseDateTime(app.appointment_date, app.start_time);
        const appEnd = parseDateTime(app.appointment_date, app.end_time);

        if (appStart && appEnd) {
          if (currentStart.getTime() < appEnd.getTime() && currentEnd.getTime() > appStart.getTime()) {
            hasOverlap = true;
            break;
          }
        }
      }
    }

    const isAvailable = meetsNoticeWindow && !hasOverlap;

    const startH = String(currentStart.getHours()).padStart(2, '0');
    const startM = String(currentStart.getMinutes()).padStart(2, '0');
    const endH = String(currentEnd.getHours()).padStart(2, '0');
    const endM = String(currentEnd.getMinutes()).padStart(2, '0');

    if (isAvailable) {
      slots.push({
        start: currentStart,
        end: currentEnd,
        label: formatTimeLabel(currentStart),
        startTimeStr: `${startH}:${startM}`,
        endTimeStr: `${endH}:${endM}`,
        isAvailable: true
      });
    }

    // Step forward by slot_interval_minutes
    currentStart = new Date(currentStart.getTime() + intervalMs);
  }

  return slots;
}
