import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createMockBookingRepository, type BookingRepository } from '../booking.repository';
import type { BookingDate, Session } from '../booking.types';
import { BookingScreen } from '../BookingScreen';

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

async function renderScreen(repository: BookingRepository = createMockBookingRepository(0)) {
  return await render(
    <SafeAreaProvider initialMetrics={initialMetrics}>
      <BookingScreen repository={repository} />
    </SafeAreaProvider>,
  );
}

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolver) => {
    resolve = resolver;
  });
  return { promise, resolve };
}

describe('BookingScreen', () => {
  it('completes the accessible booking flow', async () => {
    await renderScreen();

    const monday = await screen.findByRole('button', { name: 'Monday, August 10' });
    expect(monday.props.accessibilityState).toEqual({ selected: true });

    await fireEvent.press(screen.getByRole('button', { name: 'Tuesday, August 11' }));
    await screen.findByText('5 spots available');

    await fireEvent.press(screen.getByRole('button', { name: 'Filters' }));
    const availabilitySwitch = screen.getByRole('switch', {
      name: 'Available sessions only',
    });
    await fireEvent(availabilitySwitch, 'valueChange', true);
    await fireEvent.press(screen.getByRole('button', { name: 'Apply filters' }));

    await waitFor(() => {
      expect(screen.queryByText('Session full')).toBeNull();
      expect(screen.getByText('3 sessions')).toBeTruthy();
    });

    const selectButton = screen.getByRole('button', {
      name: /Select Mobility Flow, 10:00 AM to 10:45 AM, 7 spots available/,
    });
    await fireEvent.press(selectButton);
    expect(selectButton.props.accessibilityState).toEqual({ selected: true, disabled: false });

    await fireEvent.press(screen.getByRole('button', { name: 'View details for Mobility Flow' }));
    expect(screen.getByRole('header', { name: 'Session details' })).toBeTruthy();
    expect(
      screen.getByText('A low-impact mobility session for range of motion and recovery.'),
    ).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: 'Close session details' }));
    expect(screen.queryByRole('header', { name: 'Session details' })).toBeNull();
    expect(selectButton.props.accessibilityState).toEqual({ selected: true, disabled: false });
  });

  it('shows a recoverable error state', async () => {
    const repository: BookingRepository = {
      getDates: jest.fn().mockRejectedValue(new Error('Service unavailable')),
      getSessions: jest.fn(),
    };

    await renderScreen(repository);

    expect(await screen.findByText('Service unavailable')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Retry loading sessions' })).toBeTruthy();
  });

  it('ignores stale session responses after rapid date changes', async () => {
    const dates: BookingDate[] = [
      {
        id: 'monday',
        isoDate: '2026-08-10',
        weekdayLabel: 'Mon',
        dayNumber: '10',
        fullLabel: 'Monday, August 10',
      },
      {
        id: 'tuesday',
        isoDate: '2026-08-11',
        weekdayLabel: 'Tue',
        dayNumber: '11',
        fullLabel: 'Tuesday, August 11',
      },
      {
        id: 'wednesday',
        isoDate: '2026-08-12',
        weekdayLabel: 'Wed',
        dayNumber: '12',
        fullLabel: 'Wednesday, August 12',
      },
    ];
    const makeSession = (dateId: string, title: string): Session => ({
      id: `${dateId}-session`,
      dateId,
      title,
      startTime: '8:00 AM',
      endTime: '9:00 AM',
      coach: 'Coach',
      location: 'Studio',
      description: 'Description',
      openSpots: 4,
    });
    const tuesday = createDeferred<Session[]>();
    const wednesday = createDeferred<Session[]>();
    const repository: BookingRepository = {
      getDates: jest.fn().mockResolvedValue(dates),
      getSessions: jest.fn(({ dateId }) => {
        if (dateId === 'monday') {
          return Promise.resolve([makeSession('monday', 'Monday Session')]);
        }
        if (dateId === 'tuesday') return tuesday.promise;
        return wednesday.promise;
      }),
    };

    await renderScreen(repository);
    await screen.findByText('Monday Session');

    await fireEvent.press(screen.getByRole('button', { name: 'Tuesday, August 11' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Wednesday, August 12' }));

    await act(async () => {
      wednesday.resolve([makeSession('wednesday', 'Wednesday Session')]);
      await wednesday.promise;
    });
    expect(await screen.findByText('Wednesday Session')).toBeTruthy();

    await act(async () => {
      tuesday.resolve([makeSession('tuesday', 'Tuesday Session')]);
      await tuesday.promise;
    });
    await waitFor(() => {
      expect(screen.queryByText('Tuesday Session')).toBeNull();
      expect(screen.getByText('Wednesday Session')).toBeTruthy();
    });
  });
});
