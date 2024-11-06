import { http, HttpResponse } from 'msw';

import { server } from '../setupTests';
import { Event } from '../types';

// ! Hard
// ! 이벤트는 생성, 수정 되면 fetch를 다시 해 상태를 업데이트 합니다. 이를 위한 제어가 필요할 것 같은데요. 어떻게 작성해야 테스트가 병렬로 돌아도 안정적이게 동작할까요?
// ! 아래 이름을 사용하지 않아도 되니, 독립적이게 테스트를 구동할 수 있는 방법을 찾아보세요. 그리고 이 로직을 PR에 설명해주세요.

interface HandlerOptions {
  delay?: number; // API 응답 지연시간 (ms)
}

/**
 * 이벤트 CRUD 작업을 위한 통합 핸들러 생성 함수
 * 클로저를 통해 각 테스트별로 독립적인 상태를 유지
 */
export const createEventHandlers = (initialEvents: Event[] = [], options: HandlerOptions = {}) => {
  // 클로저로 관리되는 상태
  let events = [...initialEvents];
  const delay = options.delay || 0;

  /**
   * 모든 핸들러에서 공통적으로 사용할 지연 함수
   */
  const applyDelay = async () => {
    if (delay) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  };

  /**
   * MSW 핸들러 정의
   */
  const handlers = [
    // GET - 이벤트 목록 조회
    http.get('/api/events', async () => {
      await applyDelay();
      return HttpResponse.json({ events });
    }),

    // POST - 이벤트 생성
    http.post('/api/events', async ({ request }) => {
      const newEvent = (await request.json()) as Event;
      const createdEvent = {
        ...newEvent,
        id: String(events.length + 1),
      };

      events = [...events, createdEvent];

      await applyDelay();
      return HttpResponse.json(createdEvent, { status: 201 });
    }),

    // PUT - 이벤트 수정
    http.put('/api/events/:id', async ({ params, request }) => {
      const { id } = params;
      const updatedEvent = (await request.json()) as Event;
      const index = events.findIndex((event) => event.id === id);

      if (index === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      events = events.map((event) => (event.id === id ? { ...updatedEvent, id } : event));

      await applyDelay();
      return HttpResponse.json(updatedEvent);
    }),

    // DELETE - 이벤트 삭제
    http.delete('/api/events/:id', async ({ params }) => {
      const { id } = params;
      events = events.filter((event) => event.id !== id);

      await applyDelay();
      return new HttpResponse(null, { status: 204 });
    }),
  ];

  return {
    setUp: () => server.use(...handlers),
    reset: () => {
      events = [...initialEvents];
    },
    getEvents: () => events,
    getAllHandlers: () => handlers,
  };
};

/**
 * 레거시 인터페이스 지원을 위한 래퍼 함수들
 */
export const setupMockHandlerCreation = (initEvents: Event[] = [], options?: HandlerOptions) => {
  const instance = createEventHandlers(initEvents, options);
  instance.setUp();
  return instance;
};

export const setupMockHandlerUpdating = (initEvents: Event[] = [], options?: HandlerOptions) => {
  const instance = createEventHandlers(initEvents, options);
  instance.setUp();
  return instance;
};

export const setupMockHandlerDeletion = (initEvents: Event[] = [], options?: HandlerOptions) => {
  const instance = createEventHandlers(initEvents, options);
  instance.setUp();
  return instance;
};
