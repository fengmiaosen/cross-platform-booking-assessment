import type { ModalProps } from 'react-native';

import type { BookingFilters, BookingState, LayoutMode } from './booking.types';

export const ACCESSIBILITY_LANGUAGE = 'en-US';

// The Expo app supports rotation, so native iOS modals must explicitly mirror
// the phone orientations instead of falling back to Modal's portrait-only behavior.
export const SUPPORTED_MODAL_ORIENTATIONS: NonNullable<ModalProps['supportedOrientations']> = [
  'portrait',
  'landscape-left',
  'landscape-right',
];

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

// Assumption: Persistent side panels need tablet-like height as well as width.
// A phone in landscape can exceed the expanded width breakpoint while remaining
// too short for a usable filter rail, so it should keep the modal presentation.
export function getPersistentPanelVisibility(width: number, height: number) {
  const hasPanelHeight = height >= 600;

  return {
    showInlineFilters: getLayoutMode(width) === 'expanded' && hasPanelHeight,
    showDetailsPane: width >= 1180 && hasPanelHeight,
  };
}

export function getColumnCount(width: number): number {
  return width >= 720 ? 2 : 1;
}
