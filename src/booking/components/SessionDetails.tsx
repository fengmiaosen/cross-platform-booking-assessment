import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatTimeRangeForAccessibility } from '../booking.accessibility';
import { ACCESSIBILITY_LANGUAGE } from '../booking.constants';
import type { Session } from '../booking.types';

type SessionDetailsProps = {
  session: Session | null;
  presentation: 'modal' | 'pane';
  onClose: () => void;
};

function DetailsContent({ session, onClose }: Omit<SessionDetailsProps, 'presentation'>) {
  if (!session) return null;
  const timeAccessibilityLabel = formatTimeRangeForAccessibility(
    session.startTime,
    session.endTime,
  );

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Text
          accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
          accessibilityRole="header"
          style={styles.title}
        >
          Session details
        </Text>
        <Pressable
          accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
          accessibilityRole="button"
          accessibilityLabel="Close session details"
          onPress={onClose}
          style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
        >
          <Text importantForAccessibility="no" style={styles.closeText}>
            ×
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityLanguage={ACCESSIBILITY_LANGUAGE} style={styles.sessionTitle}>
          {session.title}
        </Text>

        <View style={styles.detailGroup}>
          <Text accessibilityLanguage={ACCESSIBILITY_LANGUAGE} style={styles.detailLabel}>
            Time
          </Text>
          <Text
            accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
            accessibilityLabel={timeAccessibilityLabel}
            style={styles.detailValue}
          >
            {session.startTime} – {session.endTime}
          </Text>
        </View>
        <View style={styles.detailGroup}>
          <Text accessibilityLanguage={ACCESSIBILITY_LANGUAGE} style={styles.detailLabel}>
            Coach
          </Text>
          <Text accessibilityLanguage={ACCESSIBILITY_LANGUAGE} style={styles.detailValue}>
            {session.coach}
          </Text>
        </View>
        <View style={styles.detailGroup}>
          <Text accessibilityLanguage={ACCESSIBILITY_LANGUAGE} style={styles.detailLabel}>
            Location
          </Text>
          <Text accessibilityLanguage={ACCESSIBILITY_LANGUAGE} style={styles.detailValue}>
            {session.location}
          </Text>
        </View>
        <View style={styles.detailGroup}>
          <Text accessibilityLanguage={ACCESSIBILITY_LANGUAGE} style={styles.detailLabel}>
            Availability
          </Text>
          <Text accessibilityLanguage={ACCESSIBILITY_LANGUAGE} style={styles.detailValue}>
            {session.openSpots > 0 ? `${session.openSpots} spots available` : 'Session full'}
          </Text>
        </View>
        <Text accessibilityLanguage={ACCESSIBILITY_LANGUAGE} style={styles.description}>
          {session.description}
        </Text>
      </ScrollView>
    </View>
  );
}

export function SessionDetails({ session, presentation, onClose }: SessionDetailsProps) {
  const insets = useSafeAreaInsets();

  if (!session) return null;

  if (presentation === 'pane') {
    return (
      <View
        accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
        accessibilityLabel="Session details panel"
        style={styles.pane}
      >
        <DetailsContent session={session} onClose={onClose} />
      </View>
    );
  }

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={session !== null}>
      <View
        style={[
          styles.overlay,
          {
            paddingTop: Math.max(insets.top, spacing.lg),
            paddingBottom: Math.max(insets.bottom, spacing.lg),
          },
        ]}
      >
        <View accessibilityViewIsModal style={styles.modalPanel}>
          <DetailsContent session={session} onClose={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.overlay,
    padding: spacing.lg,
  },
  modalPanel: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '85%',
    alignSelf: 'center',
  },
  pane: {
    width: 320,
  },
  panel: {
    flexShrink: 1,
    gap: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  closeText: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 32,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sessionTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },
  detailGroup: {
    gap: spacing.xs,
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  detailValue: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
  description: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  pressed: {
    opacity: 0.7,
  },
});
