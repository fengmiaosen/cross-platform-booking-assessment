import { memo } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatTimeRangeForAccessibility } from '../booking.accessibility';
import { ACCESSIBILITY_LANGUAGE } from '../booking.constants';
import type { Session } from '../booking.types';

type SessionCardProps = {
  session: Session;
  selected: boolean;
  onSelect: (sessionId: string) => void;
  onOpenDetails: (sessionId: string) => void;
};

export const SessionCard = memo(function SessionCard({
  session,
  selected,
  onSelect,
  onOpenDetails,
}: SessionCardProps) {
  const { fontScale } = useWindowDimensions();
  const usesAccessibilityTextSize = fontScale >= 2;
  const available = session.openSpots > 0;
  const availabilityText = available ? `${session.openSpots} spots available` : 'Session full';
  const timeAccessibilityLabel = formatTimeRangeForAccessibility(
    session.startTime,
    session.endTime,
  );
  const selectButtonLabel = available
    ? `Select ${session.title}`
    : `Unavailable for ${session.title}`;

  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      <View style={[styles.header, usesAccessibilityTextSize && styles.headerLargeText]}>
        <View style={styles.titleGroup}>
          <Text accessibilityLanguage={ACCESSIBILITY_LANGUAGE} style={styles.title}>
            {session.title}
          </Text>
          <Text
            accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
            accessibilityLabel={timeAccessibilityLabel}
            style={styles.time}
          >
            {session.startTime} – {session.endTime}
          </Text>
        </View>
        {selected ? (
          <Text
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={styles.selectedBadge}
          >
            Selected
          </Text>
        ) : null}
      </View>

      <Text accessibilityLanguage={ACCESSIBILITY_LANGUAGE} style={styles.metadata}>
        {session.coach} · {session.location}
      </Text>
      <Text
        accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
        style={[styles.availability, available ? styles.availabilityOpen : styles.availabilityFull]}
      >
        {availabilityText}
      </Text>

      {/* Assumption: Selecting a session and opening its details are separate
          actions because the task lists them as distinct capabilities. */}
      <View style={[styles.actions, usesAccessibilityTextSize && styles.actionsLargeText]}>
        <Pressable
          accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
          accessibilityRole="button"
          accessibilityLabel={selectButtonLabel}
          accessibilityHint={
            available && !selected ? 'Selects this session for booking' : undefined
          }
          accessibilityState={{ selected, disabled: !available }}
          disabled={!available}
          onPress={() => onSelect(session.id)}
          style={({ pressed }) => [
            styles.selectButton,
            usesAccessibilityTextSize && styles.actionButtonLargeText,
            selected && styles.selectButtonSelected,
            !available && styles.disabledButton,
            pressed && available && !selected && styles.selectButtonPressed,
            pressed && selected && styles.outlineButtonPressed,
          ]}
        >
          <Text
            style={[
              styles.selectButtonText,
              selected && styles.selectButtonTextSelected,
              !available && styles.disabledButtonText,
            ]}
          >
            {selected ? 'Selected' : available ? 'Select session' : 'Unavailable'}
          </Text>
        </Pressable>

        <Pressable
          accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
          accessibilityRole="button"
          accessibilityLabel={`View details for ${session.title}`}
          onPress={() => onOpenDetails(session.id)}
          style={({ pressed }) => [
            styles.detailsButton,
            usesAccessibilityTextSize && styles.actionButtonLargeText,
            pressed && styles.outlineButtonPressed,
          ]}
        >
          <Text style={styles.detailsButtonText}>View details</Text>
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  cardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.surfaceSelected,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  headerLargeText: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  titleGroup: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  time: {
    color: colors.textMuted,
    fontSize: 15,
  },
  metadata: {
    color: colors.textMuted,
    fontSize: 14,
  },
  availability: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 14,
    fontWeight: '700',
  },
  availabilityOpen: {
    color: colors.success,
    backgroundColor: colors.successSurface,
  },
  availabilityFull: {
    color: colors.danger,
    backgroundColor: colors.dangerSurface,
  },
  selectedBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    color: colors.primary,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 12,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionsLargeText: {
    flexDirection: 'column',
  },
  selectButton: {
    minHeight: 48,
    minWidth: 0,
    flexBasis: 136,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  selectButtonSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  selectButtonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  selectButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  selectButtonTextSelected: {
    color: colors.primary,
  },
  disabledButton: {
    backgroundColor: colors.border,
  },
  disabledButtonText: {
    color: colors.textMuted,
  },
  detailsButton: {
    minHeight: 48,
    minWidth: 0,
    flexBasis: 136,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  actionButtonLargeText: {
    width: '100%',
    flexBasis: 'auto',
    flexGrow: 0,
  },
  detailsButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  outlineButtonPressed: {
    backgroundColor: colors.surfacePressed,
  },
});
