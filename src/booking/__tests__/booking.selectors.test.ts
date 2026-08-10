import { getColumnCount, getLayoutMode, initialBookingState } from '../booking.constants';
import { filterSessions, getActiveFilterCount, selectDetailsSession } from '../booking.selectors';
import type { Session } from '../booking.types';

const sessions: Session[] = [
  {
    id: 'open',
    dateId: 'date',
    title: 'Open Session',
    startTime: '8:00 AM',
    endTime: '9:00 AM',
    coach: 'Coach',
    location: 'Studio',
    description: 'Open',
    openSpots: 3,
  },
  {
    id: 'full',
    dateId: 'date',
    title: 'Full Session',
    startTime: '9:00 AM',
    endTime: '10:00 AM',
    coach: 'Coach',
    location: 'Studio',
    description: 'Full',
    openSpots: 0,
  },
];

describe('booking selectors', () => {
  it('filters out full sessions when availability is enabled', () => {
    expect(filterSessions(sessions, { onlyAvailable: true })).toEqual([sessions[0]]);
    expect(getActiveFilterCount({ onlyAvailable: true })).toBe(1);
  });

  it('returns the details session from the current result set', () => {
    const state = {
      ...initialBookingState,
      sessions,
      detailsSessionId: 'full',
    };

    expect(selectDetailsSession(state)).toEqual(sessions[1]);
  });
});

describe('responsive layout', () => {
  it.each([
    [375, 'compact'],
    [768, 'medium'],
    [1024, 'expanded'],
  ] as const)('maps width %s to %s layout', (width, expected) => {
    expect(getLayoutMode(width)).toBe(expected);
  });

  it('uses two columns only when enough result width is available', () => {
    expect(getColumnCount(719)).toBe(1);
    expect(getColumnCount(720)).toBe(2);
  });
});
