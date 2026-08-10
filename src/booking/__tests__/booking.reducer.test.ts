import { initialBookingState } from '../booking.constants';
import { bookingReducer } from '../booking.reducer';
import type { BookingDate, Session } from '../booking.types';

const date: BookingDate = {
  id: '2026-08-10',
  isoDate: '2026-08-10',
  weekdayLabel: 'Mon',
  dayNumber: '10',
  fullLabel: 'Monday, August 10',
};

const session: Session = {
  id: 'session-1',
  dateId: date.id,
  title: 'Strength Foundations',
  startTime: '8:00 AM',
  endTime: '9:00 AM',
  coach: 'Alex Morgan',
  location: 'Studio A',
  description: 'Description',
  openSpots: 8,
};

describe('bookingReducer', () => {
  it('stores the initial dates and sessions', () => {
    const state = bookingReducer(initialBookingState, {
      type: 'initialLoadSucceeded',
      dates: [date],
      sessions: [session],
    });

    expect(state.status).toBe('success');
    expect(state.selectedDateId).toBe(date.id);
    expect(state.sessions).toEqual([session]);
  });

  it('clears session-specific state when the date changes', () => {
    const populatedState = {
      ...initialBookingState,
      selectedDateId: date.id,
      selectedSessionId: session.id,
      detailsSessionId: session.id,
      status: 'success' as const,
    };

    const state = bookingReducer(populatedState, {
      type: 'loadStarted',
      dateId: '2026-08-11',
    });

    expect(state.selectedDateId).toBe('2026-08-11');
    expect(state.selectedSessionId).toBeNull();
    expect(state.detailsSessionId).toBeNull();
    expect(state.status).toBe('loading');
  });

  it('keeps selection and details as separate actions', () => {
    const selected = bookingReducer(initialBookingState, {
      type: 'sessionSelected',
      sessionId: session.id,
    });
    const withDetails = bookingReducer(selected, {
      type: 'detailsOpened',
      sessionId: session.id,
    });

    expect(selected.detailsSessionId).toBeNull();
    expect(withDetails.selectedSessionId).toBe(session.id);
    expect(withDetails.detailsSessionId).toBe(session.id);
  });

  it('stores recoverable load errors', () => {
    const state = bookingReducer(initialBookingState, {
      type: 'loadFailed',
      message: 'Network unavailable',
    });

    expect(state.status).toBe('error');
    expect(state.error).toBe('Network unavailable');
  });
});
