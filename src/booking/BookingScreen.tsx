import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

import { ACCESSIBILITY_LANGUAGE, getColumnCount, getLayoutMode } from './booking.constants';
import type { BookingRepository } from './booking.repository';
import { BookingHeader } from './components/BookingHeader';
import { BookingStateView } from './components/BookingStateView';
import { DateSelector } from './components/DateSelector';
import { FilterControls } from './components/FilterControls';
import { SessionDetails } from './components/SessionDetails';
import { SessionList } from './components/SessionList';
import { useBookingController } from './useBookingController';

type BookingScreenProps = {
  repository?: BookingRepository;
};

export function BookingScreen({ repository }: BookingScreenProps) {
  // Assumption: Keyboard scope means native iOS/Android hardware-keyboard and
  // assistive navigation. React Native Web is outside the requested platforms.
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { state, visibleSessions, detailsSession, activeFilterCount, actions } =
    useBookingController(repository);

  const layoutMode = getLayoutMode(width);
  const showInlineFilters = layoutMode === 'expanded';
  // Assumption: Phones and narrower windows use modals, while sufficiently
  // wide windows can keep filters and session details visible as side panes.
  const showDetailsPane = width >= 1180;
  const reservedWidth = (showInlineFilters ? 272 : 0) + (showDetailsPane ? 336 : 0);
  const columnCount = getColumnCount(Math.max(320, width - reservedWidth));

  const renderResults = () => {
    if (state.status === 'loading') return <BookingStateView type="loading" />;
    if (state.status === 'error') {
      return (
        <BookingStateView
          type="error"
          message={state.error ?? 'Please try again.'}
          onRetry={actions.retry}
        />
      );
    }

    return (
      <SessionList
        sessions={visibleSessions}
        selectedSessionId={state.selectedSessionId}
        columnCount={columnCount}
        bottomInset={insets.bottom}
        onSelectSession={actions.selectSession}
        onOpenDetails={actions.openDetails}
      />
    );
  };

  return (
    <SafeAreaView
      accessibilityLanguage={ACCESSIBILITY_LANGUAGE}
      edges={['top', 'left', 'right']}
      style={styles.safeArea}
    >
      <View style={styles.page}>
        <View style={styles.content}>
          <BookingHeader
            activeFilterCount={activeFilterCount}
            isFilterOpen={state.isFilterOpen}
            showFilterButton={!showInlineFilters}
            onOpenFilters={actions.openFilters}
          />

          {state.dates.length > 0 ? (
            <DateSelector
              dates={state.dates}
              selectedDateId={state.selectedDateId}
              onSelectDate={actions.selectDate}
            />
          ) : null}

          <View style={styles.workspace}>
            {showInlineFilters ? (
              <View style={styles.filterRail}>
                <FilterControls
                  filters={state.filters}
                  presentation="inline"
                  visible
                  onChange={actions.changeFilters}
                  onClose={actions.closeFilters}
                />
              </View>
            ) : null}

            <View style={styles.results}>{renderResults()}</View>

            {showDetailsPane ? (
              <SessionDetails
                session={detailsSession}
                presentation="pane"
                onClose={actions.closeDetails}
              />
            ) : null}
          </View>
        </View>
      </View>

      {!showInlineFilters ? (
        <FilterControls
          filters={state.filters}
          presentation="modal"
          visible={state.isFilterOpen}
          onChange={actions.changeFilters}
          onClose={actions.closeFilters}
        />
      ) : null}

      {!showDetailsPane ? (
        <SessionDetails
          session={detailsSession}
          presentation="modal"
          onClose={actions.closeDetails}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  page: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 1280,
    flex: 1,
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  workspace: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.lg,
  },
  filterRail: {
    width: 256,
  },
  results: {
    minWidth: 0,
    flex: 1,
  },
});
