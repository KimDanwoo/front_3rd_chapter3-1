import { http, HttpResponse } from 'msw';

import { server } from '../setupTests';
import { Event } from '../types';

// ! Hard
// ! 이벤트는 생성, 수정 되면 fetch를 다시 해 상태를 업데이트 합니다. 이를 위한 제어가 필요할 것 같은데요. 어떻게 작성해야 테스트가 병렬로 돌아도 안정적이게 동작할까요?
// ! 아래 이름을 사용하지 않아도 되니, 독립적이게 테스트를 구동할 수 있는 방법을 찾아보세요. 그리고 이 로직을 PR에 설명해주세요.

/**
 * @description 이벤트 생성 핸들러
 * @param initEvents 초기 이벤트 배열
 * @returns 이벤트 생성 핸들러
 */
export const setupMockHandlerCreation = (initEvents: Event[] = []) => {
  let mockEvents: Event[] = [...initEvents];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.post('/api/events', async ({ request }) => {
      const newEvent = (await request.json()) as Event;
      newEvent.id = String(mockEvents.length + 1);
      mockEvents = [...mockEvents, newEvent];

      return HttpResponse.json(newEvent, { status: 201 });
    })
  );
};

/**
 * @description 이벤트 수정 핸들러
 * @param initEvents 초기 이벤트 배열
 * @returns 이벤트 수정 핸들러
 */
export const setupMockHandlerUpdating = (initEvents: Event[] = []) => {
  let mockEvents: Event[] = [...initEvents];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.put('/api/events/:id', async ({ params, request }) => {
      const { id } = params;
      const updatedEvent = (await request.json()) as Event;
      const index = mockEvents.findIndex((event) => event.id === id);
      mockEvents = mockEvents.map((event) => (event.id === id ? updatedEvent : event));

      return HttpResponse.json(mockEvents[index]);
    })
  );
};

/**
 * @description 이벤트 삭제 핸들러
 * @param initEvents 초기 이벤트 배열
 * @returns 이벤트 삭제 핸들러
 */
export const setupMockHandlerDeletion = (initEvents: Event[] = []) => {
  let mockEvents: Event[] = [...initEvents];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.delete('/api/events/:id', ({ params }) => {
      const { id } = params;
      mockEvents = mockEvents.filter((event) => event.id !== id);

      return new HttpResponse(null, { status: 204 });
    })
  );
};
