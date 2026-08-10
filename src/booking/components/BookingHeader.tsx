import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

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
  const filterLabel = activeFilterCount > 0 ? `Filters, ${activeFilterCount} active` : 'Filters';

  return (
    <View style={styles.container}>
      <View style={styles.copy}>
        <Text accessibilityRole="header" style={styles.title}>
          Book a session
        </Text>
        <Text style={styles.subtitle}>Choose a date and session that works for you.</Text>
      </View>

      {showFilterButton ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={filterLabel}
          accessibilityHint="Opens session filtering options"
          accessibilityState={{ expanded: isFilterOpen }}
          onPress={onOpenFilters}
          style={({ pressed }) => [styles.filterButton, pressed && styles.filterButtonPressed]}
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
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 22,
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
  },
  filterButtonPressed: {
    backgroundColor: colors.surfaceSelected,
  },
  filterButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
