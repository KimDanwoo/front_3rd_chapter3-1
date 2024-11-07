import { QueryFunction, useQuery } from '@tanstack/react-query';

import { eventApi } from './eventApi';

export const EVENT_QUERY_KEYS = {
  all: ['events'] as const,
  lists: () => [...EVENT_QUERY_KEYS.all, 'list'] as const,
  detail: (id: string) => [...EVENT_QUERY_KEYS.all, 'detail', id] as const,
} as const;

export const useEventsQuery = () => {
  return useQuery({
    queryKey: EVENT_QUERY_KEYS.all,
    queryFn: eventApi.fetchEvents as QueryFunction,
  });
};
