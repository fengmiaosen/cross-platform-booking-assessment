import { initialBookingState } from './booking.constants';
import type { BookingDate, BookingFilters, BookingState, Session } from './booking.types';

export type BookingAction =
  | { type: 'loadStarted'; dateId?: string }
  | { type: 'initialLoadSucceeded'; dates: BookingDate[]; sessions: Session[] }
  | { type: 'sessionsLoadSucceeded'; sessions: Session[] }
  | { type: 'loadFailed'; message: string }
  | { type: 'filtersChanged'; filters: BookingFilters }
  | { type: 'sessionSelected'; sessionId: string }
  | { type: 'detailsOpened'; sessionId: string }
  | { type: 'detailsClosed' }
  | { type: 'filtersOpened' }
  | { type: 'filtersClosed' };

export function bookingReducer(
  state: BookingState = initialBookingState,
  action: BookingAction,
): BookingState {
  switch (action.type) {
    case 'loadStarted':
      return {
        ...state,
        status: 'loading',
        error: null,
        selectedDateId: action.dateId ?? state.selectedDateId,
        selectedSessionId: action.dateId ? null : state.selectedSessionId,
        detailsSessionId: action.dateId ? null : state.detailsSessionId,
      };
    case 'initialLoadSucceeded': {
      const selectedDateId = state.selectedDateId ?? action.dates[0]?.id ?? null;
      return {
        ...state,
        dates: action.dates,
        sessions: action.sessions,
        selectedDateId,
        status: 'success',
        error: null,
      };
    }
    case 'sessionsLoadSucceeded':
      return {
        ...state,
        sessions: action.sessions,
        status: 'success',
        error: null,
      };
    case 'loadFailed':
      return {
        ...state,
        status: 'error',
        error: action.message,
      };
    case 'filtersChanged':
      return { ...state, filters: action.filters };
    case 'sessionSelected':
      return { ...state, selectedSessionId: action.sessionId };
    case 'detailsOpened':
      return { ...state, detailsSessionId: action.sessionId };
    case 'detailsClosed':
      return { ...state, detailsSessionId: null };
    case 'filtersOpened':
      return { ...state, isFilterOpen: true };
    case 'filtersClosed':
      return { ...state, isFilterOpen: false };
    default:
      return state;
  }
}
