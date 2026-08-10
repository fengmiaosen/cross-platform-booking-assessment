import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
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
  const available = session.openSpots > 0;
  const availabilityText = available ? `${session.openSpots} spots available` : 'Session full';

  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>{session.title}</Text>
          <Text style={styles.time}>
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

      <Text style={styles.metadata}>
        {session.coach} · {session.location}
      </Text>
      <Text
        style={[styles.availability, available ? styles.availabilityOpen : styles.availabilityFull]}
      >
        {availabilityText}
      </Text>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Select ${session.title}, ${session.startTime} to ${session.endTime}, ${availabilityText}`}
          accessibilityHint="Selects this session for booking"
          accessibilityState={{ selected, disabled: !available }}
          disabled={!available}
          onPress={() => onSelect(session.id)}
          style={({ pressed }) => [
            styles.selectButton,
            selected && styles.selectButtonSelected,
            !available && styles.disabledButton,
            pressed && available && styles.pressed,
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
          accessibilityRole="button"
          accessibilityLabel={`View details for ${session.title}`}
          onPress={() => onOpenDetails(session.id)}
          style={({ pressed }) => [styles.detailsButton, pressed && styles.pressed]}
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
  titleGroup: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  time: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 21,
  },
  metadata: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  availability: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
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
    overflow: 'hidden',
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
  selectButton: {
    minHeight: 48,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
  },
  selectButtonSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  selectButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '700',
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
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  detailsButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.72,
  },
});
