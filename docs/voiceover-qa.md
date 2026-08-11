# VoiceOver QA Notes

Concise findings from physical-iPhone VoiceOver testing. A fix remains unchecked until it has been
re-tested on the device.

## Test Gestures

VoiceOver is named **旁白** on a Chinese iPhone. It is different from Speak Screen.

- Single tap: focus and announce an element.
- Double tap: activate the focused control.
- One-finger left/right swipe: move through the focus order.

## Findings and Fixes

| Observed problem                             | Resolution                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------------ |
| The page was reported as unreadable          | Use VoiceOver navigation, not the Speak Screen gesture                               |
| Date `10` or `11` was read as a year         | Use a complete date such as `Monday, August 10, 2026` and `en-US`                    |
| English content used Chinese pronunciation   | Set `accessibilityLanguage="en-US"` on the accessible elements                       |
| AM/PM was omitted                            | Keep the visual time and provide a spoken label using `A M` or `P M`                 |
| A time range was unclear                     | Announce `Session time, from eight o'clock A M to nine o'clock A M`                  |
| The Select button repeated the card          | Use a concise label such as `Select Mobility Flow`; expose card facts separately     |
| A full-session button still announced Select | Use `Unavailable for [session]` together with the disabled state                     |
| Selection was announced more than once       | Use the selected state and hide decorative selected text from the accessibility tree |

## Reusable Rules

1. Separate visual and spoken strings when punctuation or abbreviations carry meaning.
2. Set the language on the accessible element instead of relying on the device locale.
3. Keep action labels concise; expose card details as separate elements.
4. Combine business meaning such as “Unavailable” with native selected/disabled states.
5. Use unit tests for props and formatting, then verify pronunciation on a physical device.

## Remaining Device Checks

- [x] VoiceOver enabled and producing speech
- [ ] Complete date pronunciation
- [ ] AM and PM across morning, afternoon, and evening sessions
- [ ] Time-range context and direction
- [ ] Selected and unavailable button announcements
- [ ] Filter and details modal focus order
- [ ] Large Dynamic Type layout
