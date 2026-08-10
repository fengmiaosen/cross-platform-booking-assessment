import type { BookingFilters, BookingState, LayoutMode } from './booking.types';

export const DEFAULT_FILTERS: BookingFilters = {
  onlyAvailable: false,
};

export const initialBookingState: BookingState = {
  dates: [],
  sessions: [],
  selectedDateId: null,
  selectedSessionId: null,
  detailsSessionId: null,
  filters: DEFAULT_FILTERS,
  status: 'idle',
  error: null,
  isFilterOpen: false,
};

// Assumption: The task does not provide responsive breakpoints. Window-width
// breakpoints keep phones, tablets, split-screen, and foldable windows adaptive
// without relying on the physical device model.
export function getLayoutMode(width: number): LayoutMode {
  if (width < 600) return 'compact';
  if (width < 900) return 'medium';
  return 'expanded';
}

export function getColumnCount(width: number): number {
  return width >= 720 ? 2 : 1;
}
