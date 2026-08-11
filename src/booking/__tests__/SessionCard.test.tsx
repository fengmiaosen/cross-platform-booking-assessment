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
      name: 'Select Strength Foundations',
    });

    expect(selectButton.props.accessibilityLabel).not.toContain('8:00 AM');
    expect(selectButton.props.accessibilityLabel).not.toContain('spots available');
    expect(selectButton.props.accessibilityState).toEqual({ selected: true, disabled: false });
    expect(selectButton.props.accessibilityLanguage).toBe('en-US');
    expect(screen.getByText('8:00 AM – 9:00 AM').props).toMatchObject({
      accessibilityLanguage: 'en-US',
      accessibilityLabel: "Session time, from eight o'clock A M to nine o'clock A M",
    });
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
      name: 'Unavailable for Strength Foundations',
      disabled: true,
    });
    expect(selectButton.props.accessibilityLabel).toBe('Unavailable for Strength Foundations');
    expect(selectButton.props.accessibilityState).toEqual({ selected: false, disabled: true });

    await fireEvent.press(
      screen.getByRole('button', { name: 'View details for Strength Foundations' }),
    );
    expect(onOpenDetails).toHaveBeenCalledWith(session.id);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
