export type BookingDate = {
  id: string;
  isoDate: string;
  weekdayLabel: string;
  dayNumber: string;
  fullLabel: string;
};

export type Session = {
  id: string;
  dateId: string;
  title: string;
  startTime: string;
  endTime: string;
  coach: string;
  location: string;
  description: string;
  openSpots: number;
};

export type BookingFilters = {
  onlyAvailable: boolean;
};

export type BookingStatus = 'idle' | 'loading' | 'success' | 'error';

export type BookingState = {
  dates: BookingDate[];
  sessions: Session[];
  selectedDateId: string | null;
  selectedSessionId: string | null;
  detailsSessionId: string | null;
  filters: BookingFilters;
  status: BookingStatus;
  error: string | null;
  isFilterOpen: boolean;
};

export type SessionQuery = {
  dateId: string;
};

export type LayoutMode = 'compact' | 'medium' | 'expanded';
