import { Event } from '@entities/event/model/types';
import { http, HttpResponse } from 'msw';

import { server } from '../setupTests';

// ! Hard
// ! 이벤트는 생성, 수정 되면 fetch를 다시 해 상태를 업데이트 합니다. 이를 위한 제어가 필요할 것 같은데요. 어떻게 작성해야 테스트가 병렬로 돌아도 안정적이게 동작할까요?
// ! 아래 이름을 사용하지 않아도 되니, 독립적이게 테스트를 구동할 수 있는 방법을 찾아보세요. 그리고 이 로직을 PR에 설명해주세요.

export const setupMockHandlers = (initEvents: Event[] = []) => {
  // 테스트 별로 독립적인 상태 관리를 위한 클로저
  let mockEvents = [...initEvents];

  // 모든 API 요청에 대한 핸들러를 한번에 설정
  server.use(
    // 조회 - 항상 최신 mockEvents 상태 반환
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),

    // 생성
    http.post('/api/events', async ({ request }) => {
      const newEvent = (await request.json()) as Event;
      newEvent.id = String(mockEvents.length + 1);
      mockEvents = [...mockEvents, newEvent];
      return HttpResponse.json(newEvent, { status: 201 });
    }),

    // 수정
    http.put('/api/events/:id', async ({ params, request }) => {
      const { id } = params;
      const updatedEvent = (await request.json()) as Event;
      mockEvents = mockEvents.map((event) => (event.id === id ? updatedEvent : event));
      return HttpResponse.json(updatedEvent);
    }),

    // 삭제
    http.delete('/api/events/:id', ({ params }) => {
      const { id } = params;
      mockEvents = mockEvents.filter((event) => event.id !== id);
      return new HttpResponse(null, { status: 204 });
    })
  );
  return {
    // 핸들러 초기화
    reset: () => {
      mockEvents = [...initEvents];
      server.resetHandlers();
    },
    // 현재 상태 확인 (테스트용)
    getCurrentEvents: () => [...mockEvents],
  };
};

export const setupMockHandlerCreation = (initEvents: Event[] = []) => {
  return setupMockHandlers(initEvents);
};

export const setupMockHandlerUpdating = (initEvents: Event[] = []) => {
  return setupMockHandlers(initEvents);
};

export const setupMockHandlerDeletion = (initEvents: Event[] = []) => {
  return setupMockHandlers(initEvents);
};
