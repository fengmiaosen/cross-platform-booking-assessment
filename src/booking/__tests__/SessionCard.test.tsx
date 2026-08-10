import { fireEvent, render, screen } from '@testing-library/react-native';

import type { Session } from '../booking.types';
import { SessionCard } from '../components/SessionCard';

const session: Session = {
  id: 'session-1',
  dateId: '2026-08-10',
  title: 'Strength Foundations',
  startTime: '8:00 AM',
  endTime: '9:00 AM',
  coach: 'Alex Morgan',
  location: 'Studio A',
  description: 'Description',
  openSpots: 8,
};

describe('SessionCard', () => {
  it('exposes a meaningful selection name and state', async () => {
    const onSelect = jest.fn();
    await render(
      <SessionCard session={session} selected onSelect={onSelect} onOpenDetails={jest.fn()} />,
    );

    const selectButton = screen.getByRole('button', {
      name: /Select Strength Foundations, 8:00 AM to 9:00 AM, 8 spots available/,
    });

    expect(selectButton.props.accessibilityState).toEqual({ selected: true, disabled: false });
    await fireEvent.press(selectButton);
    expect(onSelect).toHaveBeenCalledWith(session.id);
  });

  it('disables selection for a full session but keeps details available', async () => {
    const onSelect = jest.fn();
    const onOpenDetails = jest.fn();
    const fullSession = { ...session, openSpots: 0 };

    await render(
      <SessionCard
        session={fullSession}
        selected={false}
        onSelect={onSelect}
        onOpenDetails={onOpenDetails}
      />,
    );

    const selectButton = screen.getByRole('button', {
      name: /Select Strength Foundations.+Session full/,
      disabled: true,
    });
    expect(selectButton.props.accessibilityState).toEqual({ selected: false, disabled: true });

    await fireEvent.press(
      screen.getByRole('button', { name: 'View details for Strength Foundations' }),
    );
    expect(onOpenDetails).toHaveBeenCalledWith(session.id);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
