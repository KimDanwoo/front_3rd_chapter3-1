import { Event } from '@entities/event/model/types';
import { formatDate } from '@features/calendar/model/utils';
import { screen, within } from '@testing-library/react';

import { parseHM } from '../utils';

export const createTestEvent = ({
  minutes,
  notificationTime = 5,
  id = '1',
}: {
  minutes: number;
  notificationTime?: number;
  id?: string;
}): Event => {
  const now = new Date();
  const eventTime = new Date(now.getTime() + minutes * 60 * 1000);

  return {
    id,
    title: '임시 테스트',
    date: formatDate(eventTime),
    startTime: parseHM(eventTime.getTime()),
    endTime: '23:59',
    description: '임시 테스트 설명',
    location: 'Test Location',
    category: 'Test Category',
    repeat: { type: 'none', interval: 0 },
    notificationTime,
  };
};

export const fillEventForm = async (user: any, eventData: Partial<Event>) => {
  if (eventData.title) {
    await user.clear(screen.getByLabelText(/제목/));
    await user.type(screen.getByLabelText(/제목/), eventData.title);
  }
  if (eventData.date) {
    await user.clear(screen.getByLabelText(/날짜/));
    await user.type(screen.getByLabelText(/날짜/), eventData.date);
  }
  if (eventData.startTime) {
    await user.clear(screen.getByLabelText(/시작 시간/));
    await user.type(screen.getByLabelText(/시작 시간/), eventData.startTime);
  }
  if (eventData.endTime) {
    await user.clear(screen.getByLabelText(/종료 시간/));
    await user.type(screen.getByLabelText(/종료 시간/), eventData.endTime);
  }
  if (eventData.description) {
    await user.clear(screen.getByLabelText(/설명/));
    await user.type(screen.getByLabelText(/설명/), eventData.description);
  }
  if (eventData.location) {
    await user.clear(screen.getByLabelText(/위치/));
    await user.type(screen.getByLabelText(/위치/), eventData.location);
  }
  if (eventData.category) {
    await user.selectOptions(screen.getByLabelText(/카테고리/), eventData.category);
  }
};

export const verifyEventInList = async (eventList: HTMLElement, eventData: Partial<Event>) => {
  const assertions = [];
  if (eventData.title) {
    assertions.push(expect(within(eventList).getByText(eventData.title)).toBeInTheDocument());
  }
  if (eventData.date) {
    assertions.push(expect(within(eventList).getByText(eventData.date)).toBeInTheDocument());
  }
  if (eventData.startTime) {
    assertions.push(
      expect(within(eventList).getByText(new RegExp(eventData.startTime))).toBeInTheDocument()
    );
  }
  if (eventData.endTime) {
    assertions.push(
      expect(within(eventList).getByText(new RegExp(eventData.endTime))).toBeInTheDocument()
    );
  }
  if (eventData.description) {
    assertions.push(expect(within(eventList).getByText(eventData.description)).toBeInTheDocument());
  }
  if (eventData.location) {
    assertions.push(expect(within(eventList).getByText(eventData.location)).toBeInTheDocument());
  }
  if (eventData.category) {
    assertions.push(
      expect(within(eventList).getByText(new RegExp(eventData.category))).toBeInTheDocument()
    );
  }
  return Promise.all(assertions);
};
