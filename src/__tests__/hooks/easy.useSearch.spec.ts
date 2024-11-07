import { useSearch } from '@features/search/model/hooks';
import { act, renderHook } from '@testing-library/react';

import { FILTERED_EVENTS } from '../../__mocks__/response/mockEvents';

describe('useSearch', () => {
  const getNewCurrentDate = () => new Date('2024-01-01T00:00:00.000Z');

  describe('기본 검색 기능', () => {
    it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
      const { result } = renderHook(() => useSearch(FILTERED_EVENTS, getNewCurrentDate(), 'month'));

      expect(result.current.filteredEvents).toHaveLength(FILTERED_EVENTS.length);
      expect(result.current.searchTerm).toBe('');
    });

    it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
      const { result } = renderHook(() => useSearch(FILTERED_EVENTS, getNewCurrentDate(), 'month'));

      act(() => {
        result.current.setSearchTerm('회의');
      });

      expect(result.current.filteredEvents).toHaveLength(3);
      expect(
        result.current.filteredEvents.every(
          (event) =>
            event.title.includes('회의') ||
            event.description.includes('회의') ||
            event.location.includes('회의')
        )
      ).toBe(true);
    });

    it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
      const { result } = renderHook(() => useSearch(FILTERED_EVENTS, getNewCurrentDate(), 'month'));

      act(() => {
        result.current.setSearchTerm('점심');
      });

      const filteredEvents = result.current.filteredEvents;
      expect(filteredEvents).toHaveLength(1);
      expect(filteredEvents.some((event) => event.title === '점심 약속')).toBe(true);
      expect(filteredEvents.some((event) => event.description.includes('점심'))).toBe(true);
    });
  });

  describe('날짜 필터링', () => {
    it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
      // 주간 뷰 테스트
      const { result: weekResult } = renderHook(() =>
        useSearch(FILTERED_EVENTS, getNewCurrentDate(), 'week')
      );
      expect(weekResult.current.filteredEvents).toHaveLength(2);

      // 월간 뷰 테스트
      const { result: monthResult } = renderHook(() =>
        useSearch(FILTERED_EVENTS, getNewCurrentDate(), 'month')
      );

      expect(monthResult.current.filteredEvents).toHaveLength(4);
    });
  });

  describe('검색어 변경', () => {
    it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
      const { result } = renderHook(() => useSearch(FILTERED_EVENTS, getNewCurrentDate(), 'month'));

      act(() => {
        result.current.setSearchTerm('회의');
      });

      expect(result.current.filteredEvents).toHaveLength(3);
      expect(result.current.searchTerm).toBe('회의');

      act(() => {
        result.current.setSearchTerm('점심');
      });

      expect(result.current.filteredEvents).toHaveLength(1);
      expect(result.current.searchTerm).toBe('점심');
      expect(
        result.current.filteredEvents.some(
          (event) => event.title.includes('점심') || event.description.includes('점심')
        )
      ).toBe(true);
    });
  });
});
