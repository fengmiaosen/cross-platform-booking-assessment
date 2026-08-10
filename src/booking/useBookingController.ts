import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

import { initialBookingState } from './booking.constants';
import { bookingReducer } from './booking.reducer';
import { mockBookingRepository, type BookingRepository } from './booking.repository';
import {
  getActiveFilterCount,
  selectDetailsSession,
  selectVisibleSessions,
} from './booking.selectors';
import type { BookingFilters } from './booking.types';

export function useBookingController(repository: BookingRepository = mockBookingRepository) {
  const [state, dispatch] = useReducer(bookingReducer, initialBookingState);
  const requestIdRef = useRef(0);

  const loadInitialData = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    dispatch({ type: 'loadStarted' });

    try {
      const dates = await repository.getDates();
      const selectedDateId = dates[0]?.id;
      const sessions = selectedDateId
        ? await repository.getSessions({ dateId: selectedDateId })
        : [];

      if (requestId !== requestIdRef.current) return;
      dispatch({ type: 'initialLoadSucceeded', dates, sessions });
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      dispatch({
        type: 'loadFailed',
        message: error instanceof Error ? error.message : 'Unable to load booking data.',
      });
    }
  }, [repository]);

  useEffect(() => {
    void loadInitialData();
    return () => {
      requestIdRef.current += 1;
    };
  }, [loadInitialData]);

  const selectDate = useCallback(
    (dateId: string) => {
      if (dateId === state.selectedDateId) return;

      const requestId = ++requestIdRef.current;
      dispatch({ type: 'loadStarted', dateId });

      void repository
        .getSessions({ dateId })
        .then((sessions) => {
          if (requestId === requestIdRef.current) {
            dispatch({ type: 'sessionsLoadSucceeded', sessions });
          }
        })
        .catch((error: unknown) => {
          if (requestId === requestIdRef.current) {
            dispatch({
              type: 'loadFailed',
              message: error instanceof Error ? error.message : 'Unable to load sessions.',
            });
          }
        });
    },
    [repository, state.selectedDateId],
  );

  const changeFilters = useCallback((filters: BookingFilters) => {
    dispatch({ type: 'filtersChanged', filters });
  }, []);

  const selectSession = useCallback((sessionId: string) => {
    dispatch({ type: 'sessionSelected', sessionId });
  }, []);

  const openDetails = useCallback((sessionId: string) => {
    dispatch({ type: 'detailsOpened', sessionId });
  }, []);

  const closeDetails = useCallback(() => dispatch({ type: 'detailsClosed' }), []);
  const openFilters = useCallback(() => dispatch({ type: 'filtersOpened' }), []);
  const closeFilters = useCallback(() => dispatch({ type: 'filtersClosed' }), []);

  const retry = useCallback(() => {
    if (!state.selectedDateId || state.dates.length === 0) {
      void loadInitialData();
      return;
    }
    const dateId = state.selectedDateId;
    const requestId = ++requestIdRef.current;
    dispatch({ type: 'loadStarted', dateId });
    void repository
      .getSessions({ dateId })
      .then((sessions) => {
        if (requestId === requestIdRef.current) {
          dispatch({ type: 'sessionsLoadSucceeded', sessions });
        }
      })
      .catch((error: unknown) => {
        if (requestId === requestIdRef.current) {
          dispatch({
            type: 'loadFailed',
            message: error instanceof Error ? error.message : 'Unable to load sessions.',
          });
        }
      });
  }, [loadInitialData, repository, state.dates.length, state.selectedDateId]);

  const visibleSessions = useMemo(() => selectVisibleSessions(state), [state]);
  const detailsSession = useMemo(() => selectDetailsSession(state), [state]);
  const activeFilterCount = useMemo(() => getActiveFilterCount(state.filters), [state.filters]);

  return {
    state,
    visibleSessions,
    detailsSession,
    activeFilterCount,
    actions: {
      selectDate,
      changeFilters,
      selectSession,
      openDetails,
      closeDetails,
      openFilters,
      closeFilters,
      retry,
    },
  };
}
