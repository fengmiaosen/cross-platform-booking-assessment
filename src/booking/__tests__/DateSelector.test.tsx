import { fireEvent, render, screen } from '@testing-library/react-native';

import type { BookingDate } from '../booking.types';
import { DateSelector } from '../components/DateSelector';

const dates: BookingDate[] = [
  {
    id: 'monday',
    isoDate: '2026-08-10',
    weekdayLabel: 'Mon',
    dayNumber: '10',
    fullLabel: 'Monday, August 10, 2026',
  },
  {
    id: 'tuesday',
    isoDate: '2026-08-11',
    weekdayLabel: 'Tue',
    dayNumber: '11',
    fullLabel: 'Tuesday, August 11, 2026',
  },
  {
    id: 'wednesday',
    isoDate: '2026-08-12',
    weekdayLabel: 'Wed',
    dayNumber: '12',
    fullLabel: 'Wednesday, August 12, 2026',
  },
];

describe('DateSelector', () => {
  it('moves to the previous and next available dates', async () => {
    const onSelectDate = jest.fn();
    await render(
      <DateSelector dates={dates} selectedDateId="tuesday" onSelectDate={onSelectDate} />,
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Select previous date' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Select next date' }));

    expect(onSelectDate).toHaveBeenNthCalledWith(1, 'monday');
    expect(onSelectDate).toHaveBeenNthCalledWith(2, 'wednesday');
  });

  it('disables relative navigation at the date boundaries', async () => {
    const onSelectDate = jest.fn();
    const { rerender } = await render(
      <DateSelector dates={dates} selectedDateId="monday" onSelectDate={onSelectDate} />,
    );

    const previousButton = screen.getByRole('button', { name: 'Select previous date' });
    expect(previousButton.props.accessibilityState).toEqual({ disabled: true });
    await fireEvent.press(previousButton);
    expect(onSelectDate).not.toHaveBeenCalled();

    await rerender(
      <DateSelector dates={dates} selectedDateId="wednesday" onSelectDate={onSelectDate} />,
    );

    const nextButton = screen.getByRole('button', { name: 'Select next date' });
    expect(nextButton.props.accessibilityState).toEqual({ disabled: true });
    await fireEvent.press(nextButton);
    expect(onSelectDate).not.toHaveBeenCalled();
  });
});
