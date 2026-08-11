import { Modal, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { ACCESSIBILITY_LANGUAGE } from '../booking.constants';
import type { BookingFilters } from '../booking.types';

type FilterControlsProps = {
  filters: BookingFilters;
  presentation: 'inline' | 'modal';
  visible: boolean;
  onChange: (filters: BookingFilters) => void;
  onClose: () => void;
};

type FilterContentProps = Omit<FilterControlsProps, 'presentation' | 'visible'> & {
  showCloseButton: boolean;
};

function FilterContent({ filters, showCloseButton, onChange, onClose }: FilterContentProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Text
          accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
          accessibilityRole="header"
          style={styles.title}
        >
          Filters
        </Text>
        {showCloseButton ? (
          <Pressable
            accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
            accessibilityRole="button"
            accessibilityLabel="Close filters"
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
          >
            <Text importantForAccessibility="no" style={styles.closeText}>
              ×
            </Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.filterRow}>
        <View style={styles.filterCopy}>
          <Text accessibilityLanguage={ACCESSIBILITY_LANGUAGE} style={styles.filterLabel}>
            Available sessions only
          </Text>
          <Text accessibilityLanguage={ACCESSIBILITY_LANGUAGE} style={styles.filterDescription}>
            Hide sessions that have no open spots.
          </Text>
        </View>
        <Switch
          accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
          accessibilityLabel="Available sessions only"
          accessibilityHint="Hides sessions that have no open spots"
          value={filters.onlyAvailable}
          onValueChange={(onlyAvailable) => onChange({ ...filters, onlyAvailable })}
          trackColor={{ false: colors.borderStrong, true: colors.primary }}
        />
      </View>

      {showCloseButton ? (
        <Pressable
          accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
          accessibilityRole="button"
          accessibilityLabel="Apply filters"
          onPress={onClose}
          style={({ pressed }) => [styles.applyButton, pressed && styles.applyButtonPressed]}
        >
          <Text style={styles.applyButtonText}>Apply filters</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function FilterControls(props: FilterControlsProps) {
  const insets = useSafeAreaInsets();

  if (props.presentation === 'inline') {
    return <FilterContent {...props} showCloseButton={false} />;
  }

  if (!props.visible) return null;

  return (
    <Modal animationType="fade" onRequestClose={props.onClose} transparent visible={props.visible}>
      <View style={[styles.overlay, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <View accessibilityViewIsModal style={styles.modalPanel}>
          <FilterContent {...props} showCloseButton />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
    padding: spacing.lg,
  },
  modalPanel: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  panel: {
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
  filterRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  filterCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  filterLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  filterDescription: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  applyButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
  },
  applyButtonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  applyButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});
