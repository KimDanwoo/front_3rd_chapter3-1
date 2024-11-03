import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

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
    notificationTime: 30,
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
    notificationTime: 30,
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
    notificationTime: 30,
  },
];

describe('getUpcomingEvents', () => {
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const now = new Date('2024-08-15T14:30');
    const upcomingEvents = getUpcomingEvents(testEvents, now, []);
    expect(upcomingEvents).toHaveLength(1);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const now = new Date('2024-08-15T15:00');
    const upcomingEvents = getUpcomingEvents(testEvents, now, ['1']);
    expect(upcomingEvents).toHaveLength(0);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-08-15T15:31');
    const upcomingEvents = getUpcomingEvents(testEvents, now, []);
    expect(upcomingEvents).toHaveLength(0);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-08-15T15:31');
    const upcomingEvents = getUpcomingEvents(testEvents, now, []);
    expect(upcomingEvents).toHaveLength(0);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const message = createNotificationMessage(testEvents[0]);
    expect(message).toBe('30분 후 이벤트 1 일정이 시작됩니다.');
  });
});
