import { Event } from '../../types';
import {
  fillZero,
  formatDate,
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
  isDateInRange,
} from '../../utils/dateUtils';

const mockEvents: Event[] = [
  {
    id: '1',
    title: '아침 회의',
    date: '2024-01-01',
    startTime: '09:00',
    endTime: '10:00',
    description: '팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '점심 회의',
    date: '2024-01-15',
    startTime: '12:00',
    endTime: '13:00',
    description: '고객 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
];

describe('getDaysInMonth', () => {
  it('각 월의 일수를 정확히 계산한다', () => {
    expect(getDaysInMonth(2024, 1)).toBe(31); // 1월
    expect(getDaysInMonth(2024, 4)).toBe(30); // 4월
    expect(getDaysInMonth(2024, 2)).toBe(29); // 윤년 2월
    expect(getDaysInMonth(2023, 2)).toBe(28); // 평년 2월
  });

  it('유효하지 않은 월은 31을 반환한다', () => {
    expect(getDaysInMonth(2024, 13)).toBe(31);
  });
});

describe('getWeekDates', () => {
  it('한 주의 날짜들을 반환한다', () => {
    const result = getWeekDates(new Date('2024-11-06'));
    const expected = [
      new Date('2024-11-03'),
      new Date('2024-11-04'),
      new Date('2024-11-05'),
      new Date('2024-11-06'),
      new Date('2024-11-07'),
      new Date('2024-11-08'),
      new Date('2024-11-09'),
    ];
    expect(result).toEqual(expected);
  });

  it('연도가 바뀌는 주의 날짜들을 처리한다', () => {
    const result = getWeekDates(new Date('2024-12-31'));
    const expected = [
      new Date('2024-12-29'),
      new Date('2024-12-30'),
      new Date('2024-12-31'),
      new Date('2025-01-01'),
      new Date('2025-01-02'),
      new Date('2025-01-03'),
      new Date('2025-01-04'),
    ];
    expect(result).toEqual(expected);
  });
});

describe('isDateInRange', () => {
  const start = new Date('2024-07-01');
  const end = new Date('2024-07-31');

  it('범위 내의 날짜를 확인한다', () => {
    expect(isDateInRange(new Date('2024-07-10'), start, end)).toBe(true);
    expect(isDateInRange(new Date('2024-06-30'), start, end)).toBe(false);
    expect(isDateInRange(new Date('2024-08-01'), start, end)).toBe(false);
  });

  it('잘못된 범위를 처리한다', () => {
    const invalidStart = new Date('2024-07-31');
    const invalidEnd = new Date('2024-07-01');
    expect(isDateInRange(new Date('2024-07-15'), invalidStart, invalidEnd)).toBe(false);
  });
});

describe('날짜 포맷팅', () => {
  it('formatWeek: 주 단위 포맷', () => {
    expect(formatWeek(new Date('2024-07-10'))).toBe('2024년 7월 2주');
    expect(formatWeek(new Date('2024-12-31'))).toBe('2025년 1월 1주');
  });

  it('formatMonth: 월 단위 포맷', () => {
    expect(formatMonth(new Date('2024-07-10'))).toBe('2024년 7월');
    expect(formatMonth(new Date('2024-12-31'))).toBe('2024년 12월');
  });

  it('formatDate: 날짜 포맷', () => {
    expect(formatDate(new Date('2024-07-10'))).toBe('2024-07-10');
    expect(formatDate(new Date('2024-07-01'), 2)).toBe('2024-07-02');
  });

  it('fillZero: 숫자 패딩', () => {
    expect(fillZero(5)).toBe('05');
    expect(fillZero(10)).toBe('10');
    expect(fillZero(3, 3)).toBe('003');
  });
});

describe('이벤트 관리', () => {
  it('getEventsForDay: 특정 날짜의 이벤트를 반환한다', () => {
    expect(getEventsForDay(mockEvents, 1)).toHaveLength(1);
    expect(getEventsForDay(mockEvents, 2)).toHaveLength(0);
  });

  it('getWeeksAtMonth: 월의 주 정보를 반환한다', () => {
    const expected = [
      [null, 1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 31, null, null, null],
    ];
    expect(getWeeksAtMonth(new Date(2024, 0, 1))).toEqual(expected);
  });
});
