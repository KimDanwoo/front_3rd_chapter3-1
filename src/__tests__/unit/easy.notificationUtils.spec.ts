import { FILTERED_EVENTS } from '../../__mocks__/response/mockEvents';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

const testEvents = FILTERED_EVENTS;

describe('getUpcomingEvents', () => {
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const now = new Date('2024-01-01T09:50');
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
    expect(message).toBe('10분 후 주간 회의 일정이 시작됩니다.');
  });
});
