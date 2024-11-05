import { TEST_EVENT } from '../../__mocks__/response/mockEvents';
import { Event, EventForm } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const date = parseDateTime('2024-07-01', '14:30');
    expect(date).toBeInstanceOf(Date);
    expect(date.getMonth()).toBe(6);
    expect(date.getDate()).toBe(1);
    expect(date.getHours()).toBe(14);
    expect(date.getMinutes()).toBe(30);
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const date = parseDateTime('2024-07-01', '14:30');
    expect(date).toBeInstanceOf(Date);
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const date = parseDateTime('2024-07-01', '14:30');
    expect(date).toBeInstanceOf(Date);
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const date = parseDateTime('', '14:30');
    expect(date).toBeInstanceOf(Date);
  });
});

describe('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const dateRange = convertEventToDateRange(TEST_EVENT);
    expect(dateRange).toEqual({
      start: parseDateTime(TEST_EVENT.date, TEST_EVENT.startTime),
      end: parseDateTime(TEST_EVENT.date, TEST_EVENT.endTime),
    });

    const start = dateRange.start;
    const end = dateRange.end;

    expect(start.getFullYear()).toBe(2024);
    expect(start.getMonth()).toBe(10);
    expect(start.getDate()).toBe(3);
    expect(start.getHours()).toBe(12);
    expect(start.getMinutes()).toBe(0);

    expect(end.getFullYear()).toBe(2024);
    expect(end.getMonth()).toBe(10);
    expect(end.getDate()).toBe(3);
    expect(end.getHours()).toBe(13);
    expect(end.getMinutes()).toBe(0);
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const invalidDateEvents: EventForm[] = [
      { ...TEST_EVENT, date: '2024-13-01' }, // 존재하지 않는 월
      { ...TEST_EVENT, date: '2024-07-32' }, // 존재하지 않는 일
      { ...TEST_EVENT, date: 'invalid-date' }, // 잘못된 형식
      { ...TEST_EVENT, date: '2024/07/01' }, // 잘못된 구분자
      { ...TEST_EVENT, date: '' }, // 빈 문자열
    ];

    invalidDateEvents.forEach((event) => {
      const dateRange = convertEventToDateRange(event);
      expect(dateRange.start.toString()).toBe('Invalid Date');
      expect(dateRange.end.toString()).toBe('Invalid Date');
    });
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const invalidTimeEvents = [
      { ...TEST_EVENT, startTime: '25:00' },
      { ...TEST_EVENT, startTime: '14:60' },
      { ...TEST_EVENT, endTime: '24:01' },
      { ...TEST_EVENT, endTime: '15:61' },
    ];

    invalidTimeEvents.forEach((event) => {
      const { start, end } = convertEventToDateRange(event);
      expect(isNaN(start.getTime()) || isNaN(end.getTime())).toBe(true);
    });
  });
});

describe('isOverlapping', () => {
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    const event1 = { ...TEST_EVENT, date: '2024-07-01', startTime: '14:30', endTime: '15:30' };
    const event2 = { ...TEST_EVENT, date: '2024-07-01', startTime: '15:00', endTime: '16:00' };
    expect(isOverlapping(event1, event2)).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    const event1 = { ...TEST_EVENT, date: '2024-07-01', startTime: '14:30', endTime: '15:30' };
    const event2 = { ...TEST_EVENT, date: '2024-07-01', startTime: '15:30', endTime: '16:00' };
    expect(isOverlapping(event1, event2)).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const events = [
      { ...TEST_EVENT, id: '2', date: '2024-11-03', startTime: '12:30', endTime: '15:30' },
      { ...TEST_EVENT, id: '3', date: '2024-11-03', startTime: '11:00', endTime: '12:30' },
    ];

    const overlappingEvents = findOverlappingEvents(TEST_EVENT as Event, events);
    expect(overlappingEvents).toEqual(events);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const events = [
      { ...TEST_EVENT, id: '1', date: '2024-07-01', startTime: '16:30', endTime: '18:30' },
    ];

    const overlappingEvents = findOverlappingEvents(TEST_EVENT as Event, events);
    expect(overlappingEvents).toEqual([]);
  });
});
