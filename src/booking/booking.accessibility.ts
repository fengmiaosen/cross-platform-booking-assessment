const SMALL_NUMBER_WORDS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
] as const;

const TENS_WORDS = ['', '', 'twenty', 'thirty', 'forty', 'fifty'] as const;
const CLOCK_TIME_PATTERN = /^(\d{1,2}):(\d{2})\s*([AP])M$/i;

function numberToWords(value: number): string {
  if (value < 20) return SMALL_NUMBER_WORDS[value];

  const tens = Math.floor(value / 10);
  const ones = value % 10;
  return ones === 0 ? TENS_WORDS[tens] : `${TENS_WORDS[tens]}-${SMALL_NUMBER_WORDS[ones]}`;
}

export function formatTimeForAccessibility(time: string): string {
  const match = CLOCK_TIME_PATTERN.exec(time.trim());
  if (!match) return time;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3].toUpperCase() === 'A' ? 'A M' : 'P M';
  const spokenMinute = minute === 0 ? "o'clock" : numberToWords(minute);

  return `${numberToWords(hour)} ${spokenMinute} ${meridiem}`;
}

export function formatTimeRangeForAccessibility(startTime: string, endTime: string): string {
  return `Session time, from ${formatTimeForAccessibility(startTime)} to ${formatTimeForAccessibility(endTime)}`;
}
