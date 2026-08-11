import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { ACCESSIBILITY_LANGUAGE } from '../booking.constants';
import type { BookingDate } from '../booking.types';

type DateSelectorProps = {
  dates: BookingDate[];
  selectedDateId: string | null;
  onSelectDate: (dateId: string) => void;
};

export function DateSelector({ dates, selectedDateId, onSelectDate }: DateSelectorProps) {
  const selectedIndex = Math.max(
    0,
    dates.findIndex((date) => date.id === selectedDateId),
  );
  const previousDisabled = selectedIndex <= 0;
  const nextDisabled = selectedIndex >= dates.length - 1;

  // Assumption: The unlabeled arrows in the supplied code move to the previous
  // or next available date. Date options remain directly selectable, which
  // keeps touch and assistive navigation predictable.
  const selectRelativeDate = (offset: number) => {
    const nextDate = dates[selectedIndex + offset];
    if (nextDate) onSelectDate(nextDate.id);
  };

  return (
    <View
      accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
      accessibilityLabel="Available dates"
      style={styles.container}
    >
      <Pressable
        accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
        accessibilityRole="button"
        accessibilityLabel="Select previous date"
        accessibilityState={{ disabled: previousDisabled }}
        disabled={previousDisabled}
        onPress={() => selectRelativeDate(-1)}
        style={({ pressed }) => [
          styles.arrowButton,
          previousDisabled && styles.disabled,
          pressed && !previousDisabled && styles.pressed,
        ]}
      >
        <Text importantForAccessibility="no" style={styles.arrowText}>
          {'<'}
        </Text>
      </Pressable>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroller}
        contentContainerStyle={styles.dateList}
      >
        {dates.map((date) => {
          const selected = date.id === selectedDateId;
          return (
            <Pressable
              key={date.id}
              accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
              accessibilityRole="button"
              accessibilityLabel={date.fullLabel}
              accessibilityState={{ selected }}
              onPress={() => onSelectDate(date.id)}
              style={({ pressed }) => [
                styles.dateButton,
                selected && styles.dateButtonSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.weekday, selected && styles.dateTextSelected]}>
                {date.weekdayLabel}
              </Text>
              <Text style={[styles.dayNumber, selected && styles.dateTextSelected]}>
                {date.dayNumber}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable
        accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
        accessibilityRole="button"
        accessibilityLabel="Select next date"
        accessibilityState={{ disabled: nextDisabled }}
        disabled={nextDisabled}
        onPress={() => selectRelativeDate(1)}
        style={({ pressed }) => [
          styles.arrowButton,
          nextDisabled && styles.disabled,
          pressed && !nextDisabled && styles.pressed,
        ]}
      >
        <Text importantForAccessibility="no" style={styles.arrowText}>
          {'>'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dateList: {
    flexGrow: 1,
    gap: spacing.sm,
  },
  scroller: {
    flex: 1,
  },
  arrowButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  arrowText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  dateButton: {
    minWidth: 64,
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  dateButtonSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.surfaceSelected,
  },
  weekday: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  dayNumber: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  dateTextSelected: {
    color: colors.primary,
  },
  pressed: {
    opacity: 0.72,
  },
  disabled: {
    opacity: 0.4,
  },
});
