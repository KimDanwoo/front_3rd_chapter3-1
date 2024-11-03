import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch';
import { Event } from '../../types';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: '주간 회의',
    description: '팀 주간 회의',
    location: '회의실 A',
    startTime: '10:00',
    endTime: '11:00',
    date: '2024-01-01',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '점심 약속',
    description: '클라이언트와 점심 미팅',
    location: '레스토랑',
    startTime: '12:00',
    endTime: '13:00',
    date: '2024-01-02',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '3',
    title: '프로젝트 미팅',
    description: '신규 프로젝트 점검',
    location: '회의실 B',
    startTime: '14:00',
    endTime: '15:00',
    date: '2024-01-15',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
];

describe('useSearch', () => {
  const getNewCurrentDate = () => new Date('2024-01-01T00:00:00.000Z');

  describe('기본 검색 기능', () => {
    it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
      const { result } = renderHook(() => useSearch(mockEvents, getNewCurrentDate(), 'month'));

      expect(result.current.filteredEvents).toHaveLength(mockEvents.length);
      expect(result.current.searchTerm).toBe('');
    });

    it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
      const { result } = renderHook(() => useSearch(mockEvents, getNewCurrentDate(), 'month'));

      act(() => {
        result.current.setSearchTerm('회의');
      });

      expect(result.current.filteredEvents).toHaveLength(2);
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
      const { result } = renderHook(() => useSearch(mockEvents, getNewCurrentDate(), 'month'));

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
        useSearch(mockEvents, getNewCurrentDate(), 'week')
      );
      expect(weekResult.current.filteredEvents).toHaveLength(2);

      // 월간 뷰 테스트
      const { result: monthResult } = renderHook(() =>
        useSearch(mockEvents, getNewCurrentDate(), 'month')
      );
      expect(monthResult.current.filteredEvents).toHaveLength(3);
    });
  });

  describe('검색어 변경', () => {
    it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
      const { result } = renderHook(() => useSearch(mockEvents, getNewCurrentDate(), 'month'));

      act(() => {
        result.current.setSearchTerm('회의');
      });

      expect(result.current.filteredEvents).toHaveLength(2);
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
