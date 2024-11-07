import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { eventApi } from './eventApi';
import { EVENT_QUERY_KEYS } from './query';
import { Event, EventForm } from '../model/types';

interface UseEventMutationOptions {
  onSuccess?: () => void;
}

export const useCreateEventMutation = (options?: UseEventMutationOptions) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (eventData: EventForm) => eventApi.createEvent(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.all });
      options?.onSuccess?.();
      toast({
        title: '일정이 추가되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error: Error) => {
      console.error('Error creating event:', error);
      toast({
        title: '일정 저장 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });
};

export const useUpdateEventMutation = (options?: UseEventMutationOptions) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (event: Event) => eventApi.updateEvent(event.id, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.all });
      options?.onSuccess?.();
      toast({
        title: '일정이 수정되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error: Error) => {
      console.error('Error updating event:', error);
      toast({
        title: '일정 수정 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });
};

export const useDeleteEventMutation = (options?: UseEventMutationOptions) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: eventApi.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.all });
      options?.onSuccess?.();
      toast({
        title: '일정이 삭제되었습니다.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error: Error) => {
      console.error('Error deleting event:', error);
      toast({
        title: '일정 삭제 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });
};
