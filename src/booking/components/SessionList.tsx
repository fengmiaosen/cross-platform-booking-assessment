import { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { ACCESSIBILITY_LANGUAGE } from '../booking.constants';
import type { Session } from '../booking.types';

import { BookingStateView } from './BookingStateView';
import { SessionCard } from './SessionCard';

type SessionListProps = {
  sessions: Session[];
  selectedSessionId: string | null;
  columnCount: number;
  bottomInset: number;
  onSelectSession: (sessionId: string) => void;
  onOpenDetails: (sessionId: string) => void;
};

export function SessionList({
  sessions,
  selectedSessionId,
  columnCount,
  bottomInset,
  onSelectSession,
  onOpenDetails,
}: SessionListProps) {
  const renderSession = useCallback(
    ({ item }: { item: Session }) => (
      <View style={styles.cardWrapper}>
        <SessionCard
          session={item}
          selected={item.id === selectedSessionId}
          onSelect={onSelectSession}
          onOpenDetails={onOpenDetails}
        />
      </View>
    ),
    [onOpenDetails, onSelectSession, selectedSessionId],
  );

  return (
    <FlatList
      key={`session-grid-${columnCount}`}
      accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
      accessibilityLabel="Available sessions"
      data={sessions}
      keyExtractor={(item) => item.id}
      renderItem={renderSession}
      numColumns={columnCount}
      columnWrapperStyle={columnCount > 1 ? styles.columnWrapper : undefined}
      contentContainerStyle={[styles.content, { paddingBottom: bottomInset + spacing.xl }]}
      ListHeaderComponent={
        <Text
          accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
          accessibilityLiveRegion="polite"
          style={styles.resultCount}
        >
          {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
        </Text>
      }
      ListEmptyComponent={
        <BookingStateView
          type="empty"
          message="Try changing the date or turning off availability filters."
        />
      }
      initialNumToRender={8}
      windowSize={5}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    gap: spacing.md,
  },
  columnWrapper: {
    gap: spacing.md,
  },
  cardWrapper: {
    flex: 1,
    marginBottom: spacing.md,
  },
  resultCount: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
});
