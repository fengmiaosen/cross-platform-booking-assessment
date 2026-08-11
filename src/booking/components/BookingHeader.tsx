import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { ACCESSIBILITY_LANGUAGE } from '../booking.constants';

type BookingHeaderProps = {
  activeFilterCount: number;
  isFilterOpen: boolean;
  showFilterButton: boolean;
  onOpenFilters: () => void;
};

export function BookingHeader({
  activeFilterCount,
  isFilterOpen,
  showFilterButton,
  onOpenFilters,
}: BookingHeaderProps) {
  const { fontScale } = useWindowDimensions();
  const usesAccessibilityTextSize = fontScale >= 2;
  // Assumption: The unlabeled menu control in the supplied source represents
  // filters because filtering is required and no other menu destination exists.
  const filterLabel = activeFilterCount > 0 ? `Filters, ${activeFilterCount} active` : 'Filters';

  return (
    <View style={[styles.container, usesAccessibilityTextSize && styles.containerLargeText]}>
      <View style={[styles.copy, !usesAccessibilityTextSize && styles.copyInline]}>
        <Text
          accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
          accessibilityRole="header"
          style={styles.title}
        >
          Book a session
        </Text>
        <Text accessibilityLanguage={ACCESSIBILITY_LANGUAGE} style={styles.subtitle}>
          Choose a date and session that works for you.
        </Text>
      </View>

      {showFilterButton ? (
        <Pressable
          accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
          accessibilityRole="button"
          accessibilityLabel={filterLabel}
          accessibilityHint="Opens session filtering options"
          accessibilityState={{ expanded: isFilterOpen }}
          onPress={onOpenFilters}
          style={({ pressed }) => [
            styles.filterButton,
            usesAccessibilityTextSize && styles.filterButtonLargeText,
            pressed && styles.filterButtonPressed,
          ]}
        >
          <Text style={styles.filterButtonText}>
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  containerLargeText: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  copy: {
    minWidth: 0,
    gap: spacing.xs,
  },
  copyInline: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
  },
  filterButton: {
    minWidth: 88,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterButtonLargeText: {
    alignSelf: 'stretch',
  },
  filterButtonPressed: {
    backgroundColor: colors.surfaceSelected,
  },
  filterButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
