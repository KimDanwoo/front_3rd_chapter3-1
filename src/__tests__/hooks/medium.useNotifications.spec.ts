import { useNotifications } from '@features/notification/model/hooks/useNotifications';
import { act, renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';

import { createTestEvent, resetNotificationStore } from '../helpers';
import { parseHM } from '../utils';

describe('useNotifications Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetNotificationStore();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('초기 상태에서는 알림이 없어야 한다', () => {
    const { result } = renderHook(() => useNotifications([]));

    console.log(result.current);

    expect(result.current.notifications).toHaveLength(0);
    expect(result.current.notifiedEvents).toHaveLength(0);
  });

  it('지정된 시간이 된 경우 알림이 새롭게 생성되어 추가된다', () => {
    const now = new Date();
    const event = createTestEvent({ minutes: 3 });
    const { result } = renderHook(() => useNotifications([event]));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toMatchObject({
      id: event.id,
      message: expect.stringContaining('5분 후'),
    });

    const expectedStartTime = parseHM(now.getTime() + 3 * 60 * 1000);
    expect(event.startTime).toBe(expectedStartTime);
  });

  it('index를 기준으로 알림을 적절하게 제거할 수 있다', () => {
    const event1 = createTestEvent({ minutes: 3 });
    const event2 = createTestEvent({ minutes: 4, id: '2' });
    const { result } = renderHook(() => useNotifications([event1, event2]));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.notifications).toHaveLength(2);

    act(() => {
      result.current.removeNotification(0);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].id).toBe('2');
  });

  it('이미 알림이 발생한 이벤트에 대해서는 중복 알림이 발생하지 않아야 한다', () => {
    const event = createTestEvent({ minutes: 3 });
    const { result } = renderHook(() => useNotifications([event]));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifiedEvents).toContain(event.id);

    const currentNotificationTime = result.current.notifications[0].message;
    expect(currentNotificationTime).toContain('5분 후');
  });

  it('여러 이벤트의 알림이 올바른 시간에 발생해야 한다', () => {
    const event1 = createTestEvent({ minutes: 3, id: '1' });
    const event2 = createTestEvent({ minutes: 8, notificationTime: 10, id: '2' });
    const { result } = renderHook(() => useNotifications([event1, event2]));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    console.log(result.current.notifications);
    expect(result.current.notifications).toHaveLength(2);
    expect(result.current.notifications[0].message).toContain('5분 후');

    act(() => {
      vi.advanceTimersByTime(2 * 60 * 1000);
    });

    expect(result.current.notifications).toHaveLength(2);
    expect(result.current.notifications[1].message).toContain('10분 후');
  });
});
