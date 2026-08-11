# QA Results

This file distinguishes completed automation, completed manual validation, design compatibility, and work that remains untested.

## Automated — Implemented

| Check                                    | Status |
| ---------------------------------------- | ------ |
| TypeScript strict type check             | Passed |
| ESLint with zero warnings                | Passed |
| Jest/RNTL: 5 suites, 21 tests            | Passed |
| Reducer and selector unit tests          | Passed |
| Responsive layout unit tests             | Passed |
| SessionCard accessibility tests          | Passed |
| BookingScreen main-flow integration test | Passed |
| Error-state integration test             | Passed |
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

| Area                            | Status                    | Boundary                                       |
| ------------------------------- | ------------------------- | ---------------------------------------------- |
| Compact/medium/expanded windows | Automated layout logic    | Native rendering still needs manual QA         |
| Foldable resizing               | Design compatibility only | No physical foldable device or hinge awareness |
| Legacy Architecture             | Source portability only   | Requires a separate SDK 54 build               |

See [iPhone Expo Go Setup](ios-expo-go-setup.md) for the physical-device installation path and
[VoiceOver QA Notes](voiceover-qa.md) for observed issues, fixes, and remaining manual checks.

## Future Work

- P1: Maestro smoke E2E on iOS and Android development builds.
- P2: Detox only for a production project with stable native CI.
