import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BookingScreen } from './src/booking/BookingScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <BookingScreen />
    </SafeAreaProvider>
  );
}
