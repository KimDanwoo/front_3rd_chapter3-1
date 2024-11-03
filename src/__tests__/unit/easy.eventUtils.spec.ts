import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

describe('getFilteredEvents', () => {
  const testEvents: Event[] = [
    {
      id: '1',
      title: '이벤트 1',
      description: '첫 번째 이벤트입니다',
      location: '회의실 A',
      date: '2024-07-01',
      startTime: '10:00',
      endTime: '11:00',
      category: 'meeting',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '2',
      title: '이벤트 2',
      description: '두 번째 이벤트입니다',
      location: '회의실 B',
      date: '2024-07-03',
      startTime: '14:00',
      endTime: '15:00',
      category: 'meeting',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '3',
      title: '이벤트 3',
      description: '세 번째 이벤트입니다',
      location: '이벤트 2 홀',
      date: '2024-08-15',
      startTime: '15:00',
      endTime: '16:00',
      category: 'meeting',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '4',
      title: 'SPECIAL EVENT',
      description: '특별 이벤트',
      location: '대강당',
      date: '2024-08-30',
      startTime: '09:00',
      endTime: '10:00',
      category: 'meeting',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '5',
      title: '마지막 이벤트',
      description: '이벤트 시리즈',
      location: '회의실 C',
      date: '2024-09-31',
      startTime: '16:00',
      endTime: '17:00',
      category: 'meeting',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
  ];

  const filterEvents = (
    searchQuery = '',
    baseDate = new Date('2024-07-01'),
    viewType: 'week' | 'month' = 'month'
  ) => {
    return getFilteredEvents(testEvents, searchQuery, baseDate, viewType);
  };

  describe('검색 기능', () => {
    it('정확한 제목으로 이벤트를 검색한다', () => {
      const result = filterEvents('이벤트 2');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('이벤트 2');
    });

    it('대소문자를 구분하지 않고 검색한다', () => {
      const lowerResult = filterEvents('special', new Date('2024-08-01'));
      const upperResult = filterEvents('SPECIAL', new Date('2024-08-01'));

      expect(lowerResult).toHaveLength(1);
      expect(upperResult).toHaveLength(1);
      expect(lowerResult[0]).toEqual(upperResult[0]);
      expect(lowerResult[0].title).toBe('SPECIAL EVENT');
    });

    it('검색어가 없을 때는 날짜 기준으로만 필터링한다', () => {
      const result = filterEvents('');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('날짜 필터링', () => {
    it('주간 뷰에서 해당 주의 이벤트만 표시한다', () => {
      const result = filterEvents('', new Date('2024-07-01'), 'week');

      expect(result).toHaveLength(2);
      expect(result.map((e) => e.date)).toEqual(['2024-07-01', '2024-07-03']);
    });

    it('월간 뷰에서 해당 월의 이벤트만 표시한다', () => {
      const result = filterEvents('', new Date('2024-07-01'), 'month');

      expect(result).toHaveLength(2);
      expect(result.every((e) => e.date.startsWith('2024-07'))).toBe(true);
    });

    it('월의 경계 날짜를 정확하게 처리한다', () => {
      const result = filterEvents('', new Date('2024-07-01'), 'month');

      const hasJuneEvent = result.some((e) => e.date === '2024-06-30');
      const hasJulyEvent = result.some((e) => e.date === '2024-07-31');

      expect(hasJuneEvent).toBe(false);
      expect(hasJulyEvent).toBe(false);
    });
  });

  describe('복합 필터링', () => {
    it('검색어와 날짜 필터를 동시에 적용한다', () => {
      const result = filterEvents('이벤트', new Date('2024-07-01'), 'week');

      expect(result.length).toBeGreaterThan(0);
      expect(
        result.every(
          (e) =>
            e.date >= '2024-07-01' &&
            e.date <= '2024-07-07' &&
            (e.title.includes('이벤트') ||
              e.description.includes('이벤트') ||
              e.location.includes('이벤트'))
        )
      ).toBe(true);
    });
  });

  describe('엣지 케이스', () => {
    it('빈 이벤트 리스트를 처리한다', () => {
      const result = getFilteredEvents([], '', new Date('2024-07-01'), 'month');

      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
