# Cross-Platform Booking Assessment

An accessible, adaptive Session Booking screen built with Expo and React Native. The project audits the supplied single-screen implementation and replaces it with typed data boundaries, explicit state transitions, reusable booking components, practical accessibility semantics, and phone/tablet layouts.

## Selected Task

**Cross-Platform Feature Architecture & Accessibility Refactor**

The implemented flow lets a user:

- browse and navigate available dates;
- filter out full sessions;
- select an available session;
- inspect session details;
- recover from loading, empty, and error states;
- use the feature across compact, medium, and expanded windows.

## Technical Baseline

| Dependency   | Version             |
| ------------ | ------------------- |
| Expo         | SDK 56 (`~56.0.19`) |
| React Native | `0.85.3`            |
| React        | `19.2.3`            |
| TypeScript   | `~6.0.3`            |
| Node.js      | `>=20.19`           |
| Architecture | New Architecture    |

The task did not specify an Expo or React Native version. Expo SDK 56 was selected as a stable Node 20-compatible baseline. SDK 56 runs only on React Native's New Architecture.

## Setup

Prerequisites:

- Node.js 20.19 or later;
- npm;
- Xcode with an iOS simulator and/or Android Studio with an Android emulator.

Install and validate:

```bash
npm ci
npm run typecheck
npm run lint
npm test
npx expo-doctor
```

Start Metro:

```bash
npm start
```

Then use the Expo CLI prompts, or run:

```bash
npm run ios
npm run android
```

Expo Go availability varies during SDK transitions. If the installed Expo Go client does not support SDK 56, use a simulator-compatible client or create a local development build with `npx expo run:ios` / `npx expo run:android`.

## Accessibility QA Notes

[VoiceOver QA Notes](docs/voiceover-qa.md) covers screen-reader findings, fixes, and remaining
physical-device checks.

## Architecture

```text
src/
├── booking/
│   ├── BookingScreen.tsx
│   ├── booking.accessibility.ts
│   ├── booking.constants.ts
│   ├── booking.reducer.ts
│   ├── booking.repository.ts
│   ├── booking.selectors.ts
│   ├── booking.types.ts
│   ├── useBookingController.ts
│   ├── components/
│   └── __tests__/
└── theme/
```

The repository intentionally uses `src/booking` instead of adding a `features` directory for one domain. A `features` layer becomes useful only when several independent product domains exist.

Responsibilities are separated as follows:

- `BookingScreen` composes the adaptive layout.
- `useBookingController` coordinates asynchronous work and user events.
- `booking.reducer` owns explicit business state transitions.
- `booking.repository` isolates the data source from the UI.
- `booking.selectors` computes filtered and selected data.
- controlled components expose behavior through typed props.

Local `useReducer` state is sufficient because booking state is not shared with another route. Zustand or Redux would add cost without solving a current requirement. A shared store becomes reasonable when filters or selection must persist across screens.

## Audit Findings

### Highest priority

- Icon-only menu and arrow controls had no accessible names.
- Selection was communicated only through font weight or border width.
- Menu and arrow controls had no behavior, while filtering and details were missing.
- Selecting a session and opening details were not modeled as separate actions.
- Disabled, selected, and expanded states were not exposed to assistive technology.

### Additional findings

- Weekday abbreviations lacked full date context.
- Data, state, styles, and rendering were coupled in one screen.
- Random mock values made tests and screenshots non-deterministic.
- The fixed layout did not account for safe areas, tablets, rotation, or split-screen.
- Loading, empty, error, retry, and full-session states were absent.
- Hardware-keyboard order and screen-reader output were not defined.

## Structural Decisions

- Deterministic mock data replaces `Math.random()`.
- A typed `BookingRepository` can be replaced by a real API implementation without changing presentation components.
- Request identifiers prevent stale responses from replacing a newer date selection.
- Selection and details remain separate state transitions and separate buttons.
- Derived data, such as filtered sessions and layout mode, is not duplicated in state.
- `FlatList` preserves virtualization and changes its key when the column count changes.
- `SessionCard` is memoized, while callbacks and item keys remain stable.

## Accessibility Decisions

- Every interactive icon has a meaningful accessible name.
- The English interface declares `en-US` accessibility language across headings, dates, times,
  status text, and controls. Dates expose complete names such as “Monday, August 10, 2026,” while
  keeping compact visual labels.
- Visual ranges such as `8:00 AM – 9:00 AM` use explicit spoken labels such as “Session time, from
  eight o'clock A M to nine o'clock A M,” so VoiceOver conveys the context, direction, and
  meridiem.
- Session action labels stay concise (for example, “Select Mobility Flow”); the card's title, time,
  availability, and action are exposed separately to avoid repeated announcements.
- Full-session controls announce “Unavailable for [session]” in addition to their native disabled
  state, rather than describing an action that cannot be performed.
- Date and session controls expose selected and disabled states.
- Session facts and actions are exposed separately to avoid repetitive card announcements.
- Full sessions cannot be selected, but their details remain available.
- “Select session” and “View details” are sibling controls, not nested pressables.
- Filter controls expose expanded state and the number of active filters.
- Session result counts use a polite live region where supported.
- Touch targets are at least 48 by 48 logical pixels.
- Text can wrap and continues to use the platform font-scaling behavior.
- Android modals implement `onRequestClose` for system back navigation.

Automated tests verify accessible names, speech formatting, and selected/disabled states. Physical
iPhone VoiceOver validation is in progress and has already identified locale, time-abbreviation,
range-context, verbosity, and unavailable-state issues. The latest fixes still require a final
device regression pass. TalkBack, focus restoration, and physical-keyboard behavior remain
unverified.

## Responsive and Cross-Platform Decisions

Layout is based on the current window width rather than a physical device label:

| Mode          |     Width | Behavior                                             |
| ------------- | --------: | ---------------------------------------------------- |
| Compact       |    `<600` | One-column list, modal filters and details           |
| Medium        | `600-899` | One or two result columns, modal filters and details |
| Expanded      |   `>=900` | Inline filter rail and adaptive result grid          |
| Wide expanded |  `>=1180` | Optional details pane alongside results              |

The implementation uses safe-area insets, supports orientation changes, and preserves booking state while the window resizes. Expo SDK 56 targets Android API 36, so Android 16 edge-to-edge and resizable large-screen behavior are treated as core platform concerns.

### System baseline

- iOS/iPadOS 16.4 or later;
- Android 7/API 24 or later;
- Android target and compile API 36.

### Foldables

No foldable test device was available. The screen provides baseline functional compatibility by reacting to window-width changes and keeping business state independent from the device posture. Hinge-aware placement, half-folded postures, and vendor-specific foldable behavior are outside this assessment's scope and have not been presented as tested capabilities.

## Assumptions

The following assumptions are also documented next to the relevant implementation code:

- The supplied arrows move to the previous or next available date.
- Filtering is limited to availability because no other filter data was provided.
- Selecting a session and opening its details are distinct actions.
- Mobile details use a modal; sufficiently wide windows can use a side pane.
- Responsive behavior is based on available window width because no breakpoints were supplied.
- Keyboard scope means iOS/Android physical-keyboard and assistive navigation, not React Native Web.
- A typed mock repository stands in for an unspecified backend.

## Testing

Implemented P0 automation:

- reducer unit tests;
- selector and responsive-layout unit tests;
- SessionCard accessibility component tests;
- date and spoken-time accessibility formatting tests;
- BookingScreen integration flow;
- loading failure and retry presentation;
- stale asynchronous response protection.

The main integration test covers:

```text
load -> choose date -> apply filter -> select session
-> open details -> close details -> retain accessible selected state
```

Run all P0 checks:

```bash
npm run typecheck
npm run lint
npm test
npx expo-doctor
```

Current automated validation:

| Check                            | Result                    |
| -------------------------------- | ------------------------- |
| TypeScript                       | Passed                    |
| ESLint                           | Passed with zero warnings |
| Jest/RNTL                        | 5 suites, 21 tests passed |
| Expo Doctor                      | 21/21 checks passed       |
| iOS JavaScript bundle export     | Passed                    |
| Android JavaScript bundle export | Passed                    |

See [docs/qa-results.md](docs/qa-results.md) for the exact automated and manual validation status.

## Future E2E Strategy

P1 — planned, not implemented:

- add a Maestro smoke flow for the booking journey;
- run it against iOS and Android development builds;
- cover Android system back and orientation changes;
- move the stable flow into CI or EAS Workflows.

P2 — future production option, not implemented:

- consider Detox only when the product has stable native development builds, long-lived native interaction coverage, simulator CI, and a team willing to maintain the additional build configuration.

Neither P1 nor P2 is reported as completed testing in this submission.

## Legacy Architecture Portability

The submitted SDK 56 application cannot run the Legacy Architecture. The booking domain, repository, reducer, selectors, and component contracts avoid New-Architecture-specific APIs and are designed to be portable to an SDK 54/RN 0.81 application.

An actual Legacy integration would still require:

- a separate SDK 54 dependency installation;
- iOS and Android native builds;
- third-party dependency validation;
- an expanded minimum-OS test matrix, including iOS 15.1 if required.

Source portability is not presented as a verified Legacy build.

## Trade-offs and Production Evolution

- The repository is mocked; a production implementation would add cancellation, authentication, API error mapping, caching, and telemetry.
- Filter edits apply immediately. A larger filter set would use draft/apply state.
- Exact focus restoration after closing a modal needs native VoiceOver/TalkBack validation.
- Scroll-position restoration across a phone-to-tablet column change is not guaranteed.
- No hinge-aware foldable integration is included.
- No real-device matrix, Maestro, Detox, EAS Build, Fastlane, or store-release workflow is included in the P0 scope.
- A server-backed product may move remote state to TanStack Query and cross-route client state to Zustand.

### Dependency audit note

`npm audit --omit=dev` reports transitive advisories through the Expo/React Native Metro and Xcode toolchain (`image-size` and `uuid`). npm's proposed forced resolution would make a breaking downgrade to Expo SDK 53, so it was not applied. Expo Doctor passes all 21 compatibility checks. A production team should track the upstream Expo/Metro fixes and upgrade through an Expo-supported SDK patch rather than override the locked toolchain blindly.

## Time Log

The work-session log is maintained in [TIMELOG.md](TIMELOG.md) and should also be pasted into the submission email.
