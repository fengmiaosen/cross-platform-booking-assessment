import type { BookingFilters, BookingState, Session } from './booking.types';

export function filterSessions(sessions: Session[], filters: BookingFilters): Session[] {
  if (!filters.onlyAvailable) return sessions;
  return sessions.filter((session) => session.openSpots > 0);
}

export function selectVisibleSessions(state: BookingState): Session[] {
  return filterSessions(state.sessions, state.filters);
}

export function selectDetailsSession(state: BookingState): Session | null {
  if (!state.detailsSessionId) return null;
  return state.sessions.find((session) => session.id === state.detailsSessionId) ?? null;
}

export function getActiveFilterCount(filters: BookingFilters): number {
  return filters.onlyAvailable ? 1 : 0;
}
