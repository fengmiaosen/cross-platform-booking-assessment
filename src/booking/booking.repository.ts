import type { BookingDate, Session, SessionQuery } from './booking.types';

export interface BookingRepository {
  getDates(): Promise<BookingDate[]>;
  getSessions(query: SessionQuery): Promise<Session[]>;
}

const dates: BookingDate[] = [
  {
    id: '2026-08-10',
    isoDate: '2026-08-10',
    weekdayLabel: 'Mon',
    dayNumber: '10',
    fullLabel: 'Monday, August 10',
  },
  {
    id: '2026-08-11',
    isoDate: '2026-08-11',
    weekdayLabel: 'Tue',
    dayNumber: '11',
    fullLabel: 'Tuesday, August 11',
  },
  {
    id: '2026-08-12',
    isoDate: '2026-08-12',
    weekdayLabel: 'Wed',
    dayNumber: '12',
    fullLabel: 'Wednesday, August 12',
  },
  {
    id: '2026-08-13',
    isoDate: '2026-08-13',
    weekdayLabel: 'Thu',
    dayNumber: '13',
    fullLabel: 'Thursday, August 13',
  },
  {
    id: '2026-08-14',
    isoDate: '2026-08-14',
    weekdayLabel: 'Fri',
    dayNumber: '14',
    fullLabel: 'Friday, August 14',
  },
];

const sessionTemplates = [
  {
    title: 'Strength Foundations',
    startTime: '8:00 AM',
    endTime: '9:00 AM',
    coach: 'Alex Morgan',
    location: 'Studio A',
    description: 'A coached strength session focused on safe, repeatable movement patterns.',
  },
  {
    title: 'Mobility Flow',
    startTime: '10:00 AM',
    endTime: '10:45 AM',
    coach: 'Jordan Lee',
    location: 'Studio B',
    description: 'A low-impact mobility session for range of motion and recovery.',
  },
  {
    title: 'Power Circuit',
    startTime: '1:30 PM',
    endTime: '2:30 PM',
    coach: 'Sam Rivera',
    location: 'Training Floor',
    description: 'A progressive circuit combining strength, balance, and conditioning.',
  },
  {
    title: 'Evening Reset',
    startTime: '6:00 PM',
    endTime: '6:45 PM',
    coach: 'Taylor Chen',
    location: 'Studio B',
    description: 'A guided end-of-day session with stretching and controlled breathing.',
  },
] as const;

const openSpotsByDate = [
  [8, 0, 4, 12],
  [5, 7, 0, 3],
  [0, 9, 2, 6],
  [11, 4, 1, 0],
  [6, 0, 8, 10],
];

const sessions: Session[] = dates.flatMap((date, dateIndex) =>
  sessionTemplates.map((template, sessionIndex) => ({
    id: `${date.id}-${sessionIndex}`,
    dateId: date.id,
    ...template,
    openSpots: openSpotsByDate[dateIndex][sessionIndex],
  })),
);

function wait(delayMs: number): Promise<void> {
  if (delayMs <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

export function createMockBookingRepository(delayMs = 120): BookingRepository {
  return {
    async getDates() {
      await wait(delayMs);
      return dates.map((date) => ({ ...date }));
    },
    async getSessions({ dateId }) {
      await wait(delayMs);
      return sessions
        .filter((session) => session.dateId === dateId)
        .map((session) => ({ ...session }));
    },
  };
}

export const mockBookingRepository = createMockBookingRepository();
