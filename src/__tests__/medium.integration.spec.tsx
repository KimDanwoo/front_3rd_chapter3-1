import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';

import {
  setupMockHandlerCreation,
  setupMockHandlerUpdating,
  setupMockHandlerDeletion,
} from '../__mocks__/handlersUtils';
import App from '../App';
import { fillEventForm, verifyEventInList } from './helpers';
import { TEST_EVENT, TEST_EVENTS } from '../__mocks__/response/mockEvents';

const renderApp = () => {
  return render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
};

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('일정 CRUD 및 기본 기능', () => {
  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    // ! HINT. event를 추가 제거하고 저장하는 로직을 잘 살펴보고, 만약 그대로 구현한다면 어떤 문제가 있을 지 고민해보세요.
    setupMockHandlerCreation();
    renderApp();

    const newEvent = {
      title: '프론트엔드 코드리뷰',
      date: '2024-11-04',
      startTime: '09:00',
      endTime: '10:00',
      description: '중간점검',
      location: '회의실',
      category: '업무',
    };

    await fillEventForm(user, newEvent);
    await user.click(screen.getByRole('button', { name: /일정 추가/ }));

    const eventList = screen.getByTestId('event-list');
    await verifyEventInList(eventList, newEvent);
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {
    setupMockHandlerUpdating([TEST_EVENT]);

    renderApp();

    const newEvent = {
      title: '팀점심',
      category: '개인',
      date: '2024-11-03',
      startTime: '12:00',
      endTime: '13:00',
      description: '팀 점심 회의',
      location: '회의실',
    };

    const eventList = await screen.findByTestId('event-list');
    await verifyEventInList(eventList, newEvent);

    const editButton = await within(eventList).findByRole('button', { name: 'Edit event' });
    await user.click(editButton);

    const editEvent = {
      title: '긴급 장애대응',
      date: '2024-11-03',
      startTime: '12:00',
      endTime: '13:00',
      description: '긴급 장애대응 팀 회의',
      location: '회의실',
      category: '업무',
    };

    await fillEventForm(user, editEvent);
    await user.click(screen.getByRole('button', { name: /일정 수정/ }));

    const updatedEventList = await screen.findByTestId('event-list');
    await verifyEventInList(updatedEventList, editEvent);
  });

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
    setupMockHandlerDeletion([TEST_EVENT]);
    renderApp();

    const eventList = await screen.findByTestId('event-list');
    expect(within(eventList).getByText('팀점심')).toBeInTheDocument();

    const deleteButton = await within(eventList).findByRole('button', { name: 'Delete event' });
    await user.click(deleteButton);

    expect(within(eventList).queryByText('팀점심')).not.toBeInTheDocument();
  });
});

describe('일정 뷰', () => {
  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {
    setupMockHandlerCreation([{ ...TEST_EVENT, date: '2024-11-30' }]);
    renderApp();

    await user.selectOptions(screen.getByLabelText(/view/), 'week');

    const eventList = await screen.findByTestId('event-list');

    expect(within(eventList).getByText(/검색 결과가 없습니다./)).toBeInTheDocument();
  });

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {
    const fixedDate = new Date(2024, 10, 6); // 2024년 11월 6일로 고정
    vi.setSystemTime(fixedDate);

    setupMockHandlerCreation([TEST_EVENT]);
    renderApp();

    await user.selectOptions(screen.getByLabelText(/view/), 'week');

    const eventList = await screen.findByTestId('event-list');
    expect(within(eventList).getByText('팀점심')).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
    setupMockHandlerCreation([{ ...TEST_EVENT, date: '2024-12-01' }]);
    renderApp();

    await user.selectOptions(screen.getByLabelText(/view/), 'month');

    const eventList = await screen.findByTestId('event-list');
    expect(within(eventList).getByText(/검색 결과가 없습니다./)).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
    const fixedDate = new Date(2024, 10, 6); // 2024년 11월 6일로 고정
    vi.setSystemTime(fixedDate);

    setupMockHandlerCreation([TEST_EVENT]);
    renderApp();

    await user.selectOptions(screen.getByLabelText(/view/), 'month');

    const eventList = await screen.findByTestId('event-list');
    expect(within(eventList).getByText('팀점심')).toBeInTheDocument();
  });

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
    const fixedDate = new Date(2024, 12, 1);
    vi.setSystemTime(fixedDate);

    renderApp();

    await user.selectOptions(screen.getByLabelText(/view/), 'month');

    const monthView = await screen.findByTestId('month-view');
    expect(within(monthView).getByText(/신정/)).toBeInTheDocument();
  });
});

describe('검색 기능', () => {
  const fixedDate = new Date(2024, 10, 1);
  vi.setSystemTime(fixedDate);
  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {
    setupMockHandlerCreation([TEST_EVENT]);
    renderApp();

    await user.type(screen.getByLabelText(/일정 검색/), '없는 일정');

    const eventList = await screen.findByTestId('event-list');
    expect(within(eventList).getByText(/검색 결과가 없습니다./)).toBeInTheDocument();
  });

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {
    const fixedDate = new Date(2024, 10, 1);
    vi.setSystemTime(fixedDate);

    setupMockHandlerCreation(TEST_EVENTS);
    renderApp();

    const eventList = await screen.findByTestId('event-list');
    expect(within(eventList).getByText('기존 회의')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/검색어를 입력하세요/), '팀 회의');

    expect(within(eventList).queryByText('기존 회의')).not.toBeInTheDocument();
    expect(within(eventList).getByText('팀 회의')).toBeInTheDocument();
  });

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
    setupMockHandlerCreation(TEST_EVENTS);
    renderApp();

    await user.type(screen.getByPlaceholderText(/검색어를 입력하세요/), '없는 일정');

    const eventList = await screen.findByTestId('event-list');
    expect(within(eventList).getByText(/검색 결과가 없습니다./)).toBeInTheDocument();

    await user.clear(screen.getByPlaceholderText(/검색어를 입력하세요/));

    expect(within(eventList).getByText('기존 회의')).toBeInTheDocument();
  });
});

describe('일정 충돌', () => {
  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {
    setupMockHandlerCreation(TEST_EVENTS);
    renderApp();

    await user.type(screen.getByLabelText(/제목/), '새로운 회의');
    await user.type(screen.getByLabelText(/날짜/), '2024-11-15');
    await user.type(screen.getByLabelText(/시작 시간/), '09:00');
    await user.type(screen.getByLabelText(/종료 시간/), '10:00');

    await user.click(screen.getByRole('button', { name: /일정 추가/ }));

    expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
  });

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {
    setupMockHandlerCreation(TEST_EVENTS);
    renderApp();

    await user.type(screen.getByLabelText(/일정 검색/), '기존 회의');

    await user.click(screen.getByRole('button', { name: 'Edit event' }));

    await user.clear(screen.getByLabelText(/시작 시간/));
    await user.type(screen.getByLabelText(/시작 시간/), '10:00');
    await user.clear(screen.getByLabelText(/종료 시간/));
    await user.type(screen.getByLabelText(/종료 시간/), '11:00');

    await user.click(screen.getByRole('button', { name: /일정 수정/ }));

    expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
  });
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {
  vi.setSystemTime(new Date('2024-11-03T11:50:00'));
  setupMockHandlerCreation([TEST_EVENT]);
  renderApp();

  await waitFor(() => {
    expect(screen.getByText(/일정이 시작됩니다./)).toBeInTheDocument();
  });
  vi.useRealTimers();
});
