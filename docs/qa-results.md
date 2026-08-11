# QA Results

This file distinguishes completed automation, completed manual validation, design compatibility, and work that remains untested.

## QA Validation Plan

| Area                    | Concise validation procedure                                                        | Current evidence                                 |
| ----------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------ |
| Screen readers          | Navigate dates, filters, cards, states, and modals with VoiceOver and TalkBack      | VoiceOver passed; TalkBack emulator smoke passed |
| Keyboard and navigation | Follow native focus order, activate controls, dismiss modals, and restore focus     | Physical keyboard pending                        |
| iOS and Android         | Check safe areas, modal rotation, system back, edge-to-edge, and platform semantics | iPhone and Android emulators passed              |
| Small and large screens | Exercise compact, medium, expanded, grid, filter-rail, and details-pane layouts     | Android phone and tablet passed                  |
| Orientation changes     | Rotate with selection, filters, and details open; verify layout and state retention | iPhone and Android emulators passed              |
| Accessibility states    | Verify selected, disabled, expanded, result-count, and unavailable communication    | Automated, VoiceOver, and TalkBack smoke passed  |
| Visual contrast         | Check text tokens at 4.5:1 and interactive boundaries at 3:1                        | Automated token checks passed                    |
| Interaction consistency | Run date → filter → select → details → close with touch and assistive navigation    | Automated, iPhone, and Android emulators passed  |

## Automated — Implemented

| Check                                    | Status |
| ---------------------------------------- | ------ |
| TypeScript strict type check             | Passed |
| ESLint with zero warnings                | Passed |
| Jest/RNTL: 7 suites, 29 tests            | Passed |
| Reducer and selector unit tests          | Passed |
| Responsive layout unit tests             | Passed |
| DateSelector navigation and boundaries   | Passed |
| SessionCard accessibility tests          | Passed |
| Theme text and control contrast tests    | Passed |
| BookingScreen main-flow integration test | Passed |
| Loading/empty/error/retry integration    | Passed |
| Stale-response integration test          | Passed |
| Expo Doctor: 21 checks                   | Passed |
| iOS JavaScript bundle export             | Passed |
| Android JavaScript bundle export         | Passed |

## Manual Native QA

Manual native-runtime results must be updated only after the listed environment has actually been used.

| Environment                   | Status       | Notes                                                                |
| ----------------------------- | ------------ | -------------------------------------------------------------------- |
| iPhone small-screen simulator | Not tested   | Not included in this responsive-layout regression pass               |
| Mainstream iPhone simulator   | Passed       | iPhone 16 Pro Max/iOS 18.6: portrait and landscape modal filters     |
| iPad portrait/landscape       | Passed       | iPad Pro 13/iOS 18.6: filter rail, details pane, and rotation        |
| Android 16/API 36 phone       | Passed       | Pixel 8 Pro: core flow, short-landscape modal filters, safe areas    |
| Android 13/API 33 phone       | Passed       | Pixel 6: core flow, filters, details, system back, and landscape     |
| Android 16/API 36 tablet      | Passed       | Pixel Tablet: filter rail, details pane, portrait modal, and state   |
| Physical iPhone / Expo SDK 56 | Passed       | Signed Expo Go installed; project opened successfully                |
| iPhone landscape              | Passed       | List, modals, safe areas, and state retention verified               |
| VoiceOver speech semantics    | Passed       | Date, time range, AM/PM, selected, and unavailable states verified   |
| VoiceOver modal focus         | Passed       | Entry, containment, dismissal, and focus restoration verified        |
| TalkBack                      | Smoke passed | Labels, states, modal containment/entry, activation, and back tested |
| iPhone Dynamic Type           | Passed       | Maximum size: wrapping, visibility, scrolling, and controls passed   |
| Android font scale            | Passed       | 200%: wrapping, stacked actions, filters, details, and scrolling     |
| Android system back           | Passed       | Details and filter modals dismiss without losing booking state       |

## Compatibility by Design

| Area                            | Status                    | Boundary                                        |
| ------------------------------- | ------------------------- | ----------------------------------------------- |
| Compact/medium/expanded windows | Native and automated      | iPhone plus Android phone/tablet layouts passed |
| Foldable resizing               | Design compatibility only | No physical foldable device or hinge awareness  |
| Legacy Architecture             | Source portability only   | Requires a separate SDK 54 build                |

See [VoiceOver QA Notes](voiceover-qa.md) for observed issues, fixes, and completed iPhone checks.

TalkBack was validated as an emulator smoke test. Modal close returns accessibility focus to the
page heading rather than the invoking control; exact trigger restoration remains a P1 native-layer
enhancement. Spoken audio was not independently recorded.

## Future Work

- P1: Maestro smoke E2E on iOS and Android development builds.
- P1: Dark mode and platform increased-contrast preference support.
- P2: Detox only for a production project with stable native CI.
