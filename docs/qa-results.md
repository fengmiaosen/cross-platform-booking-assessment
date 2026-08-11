# QA Results

This file distinguishes completed automation, completed manual validation, design compatibility, and work that remains untested.

## QA Validation Plan

| Area                    | Concise validation procedure                                                        | Current evidence                                      |
| ----------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Screen readers          | Navigate dates, filters, cards, states, and modals with VoiceOver and TalkBack      | VoiceOver passed; TalkBack pending                    |
| Keyboard and navigation | Follow native focus order, activate controls, dismiss modals, and restore focus     | Physical keyboard pending                             |
| iOS and Android         | Check safe areas, modal rotation, system back, edge-to-edge, and platform semantics | iPhone passed; Android pending                        |
| Small and large screens | Exercise compact, medium, expanded, grid, filter-rail, and details-pane layouts     | Layout logic automated; larger native devices pending |
| Orientation changes     | Rotate with selection, filters, and details open; verify layout and state retention | Physical iPhone passed                                |
| Accessibility states    | Verify selected, disabled, expanded, result-count, and unavailable communication    | Automated and VoiceOver passed                        |
| Interaction consistency | Run date → filter → select → details → close with touch and assistive navigation    | Automated and iPhone passed                           |

## Automated — Implemented

| Check                                    | Status |
| ---------------------------------------- | ------ |
| TypeScript strict type check             | Passed |
| ESLint with zero warnings                | Passed |
| Jest/RNTL: 6 suites, 25 tests            | Passed |
| Reducer and selector unit tests          | Passed |
| Responsive layout unit tests             | Passed |
| DateSelector navigation and boundaries   | Passed |
| SessionCard accessibility tests          | Passed |
| BookingScreen main-flow integration test | Passed |
| Loading/empty/error/retry integration    | Passed |
| Stale-response integration test          | Passed |
| Expo Doctor: 21 checks                   | Passed |
| iOS JavaScript bundle export             | Passed |
| Android JavaScript bundle export         | Passed |

## Manual Native QA

Manual native-runtime results must be updated only after the listed environment has actually been used.

| Environment                   | Status         | Notes                                                              |
| ----------------------------- | -------------- | ------------------------------------------------------------------ |
| iPhone small-screen simulator | Not tested     | CoreSimulator service was unavailable                              |
| Mainstream iPhone simulator   | Not tested     | CoreSimulator service was unavailable                              |
| iPad portrait/landscape       | Not tested     | CoreSimulator service was unavailable                              |
| Android phone emulator        | Not tested     | Android `adb` was unavailable                                      |
| Android tablet emulator       | Not tested     | Android `adb` was unavailable                                      |
| Physical iPhone / Expo SDK 56 | Passed         | Signed Expo Go installed; project opened successfully              |
| iPhone landscape              | Passed         | List, modals, safe areas, and state retention verified             |
| VoiceOver speech semantics    | Passed         | Date, time range, AM/PM, selected, and unavailable states verified |
| VoiceOver modal focus         | Passed         | Entry, containment, dismissal, and focus restoration verified      |
| TalkBack                      | Not yet tested | Requires native runtime                                            |
| iPhone Dynamic Type           | Passed         | Maximum size: wrapping, visibility, scrolling, and controls passed |
| Android font scale            | Not yet tested | Requires Android runtime                                           |
| Android system back           | Not yet tested | Requires Android runtime                                           |

## Compatibility by Design

| Area                            | Status                    | Boundary                                             |
| ------------------------------- | ------------------------- | ---------------------------------------------------- |
| Compact/medium/expanded windows | Automated layout logic    | Compact iPhone passed; larger native layouts pending |
| Foldable resizing               | Design compatibility only | No physical foldable device or hinge awareness       |
| Legacy Architecture             | Source portability only   | Requires a separate SDK 54 build                     |

See [VoiceOver QA Notes](voiceover-qa.md) for observed issues, fixes, and completed iPhone checks.

## Future Work

- P1: Maestro smoke E2E on iOS and Android development builds.
- P2: Detox only for a production project with stable native CI.
