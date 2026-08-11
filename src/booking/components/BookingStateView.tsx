import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { ACCESSIBILITY_LANGUAGE } from '../booking.constants';

type BookingStateViewProps =
  | { type: 'loading' }
  | { type: 'empty'; message: string }
  | { type: 'error'; message: string; onRetry: () => void };

export function BookingStateView(props: BookingStateViewProps) {
  if (props.type === 'loading') {
    return (
      <View
        accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
        accessibilityLabel="Loading sessions"
        accessibilityRole="progressbar"
        style={styles.container}
      >
        <ActivityIndicator color={colors.primary} size="large" />
        <Text accessibilityLanguage={ACCESSIBILITY_LANGUAGE} style={styles.message}>
          Loading sessions…
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text
        accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
        accessibilityRole="header"
        style={styles.title}
      >
        {props.type === 'error' ? 'Unable to load sessions' : 'No sessions found'}
      </Text>
      <Text accessibilityLanguage={ACCESSIBILITY_LANGUAGE} style={styles.message}>
        {props.message}
      </Text>
      {props.type === 'error' ? (
        <Pressable
          accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
          accessibilityRole="button"
          accessibilityLabel="Retry loading sessions"
          onPress={props.onRetry}
          style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
        >
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  retryButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
  },
  retryButtonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  retryText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});
