import {
  formatTimeForAccessibility,
  formatTimeRangeForAccessibility,
} from '../booking.accessibility';

describe('booking accessibility formatting', () => {
  it.each([
    ['8:00 AM', "eight o'clock A M"],
    ['10:45 AM', 'ten forty-five A M'],
    ['1:30 PM', 'one thirty P M'],
    ['6:00 PM', "six o'clock P M"],
  ])('formats %s with an explicit spoken meridiem', (time, expected) => {
    expect(formatTimeForAccessibility(time)).toBe(expected);
  });

  it('formats a time range for an accessibility label', () => {
    expect(formatTimeRangeForAccessibility('1:30 PM', '2:30 PM')).toBe(
      'Session time, from one thirty P M to two thirty P M',
    );
  });

  it('preserves an unexpected API value rather than producing misleading speech', () => {
    expect(formatTimeForAccessibility('TBD')).toBe('TBD');
  });
});
