# iPhone Expo Go Setup

Physical-iPhone setup used for the Expo SDK 56 assessment.

## Install Expo Go for SDK 56

The App Store Expo Go build used during testing did not support SDK 56. The project was kept on its
agreed SDK instead of being downgraded.

1. Open [sign.expo.dev](https://sign.expo.dev/) in desktop Google Chrome.
2. Select **SDK 56** and sign in to Expo.
3. Register the iPhone:
   - **USB cable**: connect and unlock the iPhone, trust the Mac, then select **Connect over USB**.
   - **Manual**: copy the UDID from Finder and paste it into the Manual field.
4. Complete the Apple ID, re-sign, and installation steps on the Expo page.
5. Enable **Settings → Privacy & Security → Developer Mode**, restart, and confirm.
6. If required, trust the developer under **Settings → General → VPN & Device Management**.
7. Start the project and scan the Metro QR code:

   ```bash
   npx expo start --clear
   ```

If the Expo account has no Apple Team, Profile/QR device registration may be unavailable; use USB
or Manual instead. A temporary signature may expire and require reinstallation, but the project
does not need to be downgraded.

References: [Expo version mismatch](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/),
[Expo SDK 56](https://expo.dev/changelog/sdk-56), and
[Apple Developer Mode](https://developer.apple.com/documentation/xcode/enabling-developer-mode-on-a-device).
