import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
} from '@chakra-ui/react';
import { Event } from '@entities/event/model/types';
import React from 'react';

import { useEventOperations } from '../model/hooks';
import { useEventFormStore } from '../model/stores';

interface ClashEventDialogProps {
  isOverlapDialogOpen: boolean;
  setIsOverlapDialogOpen: (isOpen: boolean) => void;
  overlappingEvents: Event[];
  cancelRef: React.RefObject<HTMLButtonElement>;
}

export const ClashEventDialog = ({
  isOverlapDialogOpen,
  setIsOverlapDialogOpen,
  overlappingEvents,
  cancelRef,
}: ClashEventDialogProps) => {
  const {
    title,
    date,
    startTime,
    endTime,
    description,
    location,
    category,
    isRepeating,
    repeatType,
    repeatInterval,
    repeatEndDate,
    notificationTime,
    editingEvent,
  } = useEventFormStore();

  const { saveEvent } = useEventOperations();

  const handleSaveEvent = () => {
    () => {
      setIsOverlapDialogOpen(false);
      saveEvent(
        {
          id: editingEvent ? editingEvent.id : undefined,
          title,
          date,
          startTime,
          endTime,
          description,
          location,
          category,
          repeat: {
            type: isRepeating ? repeatType : 'none',
            interval: repeatInterval,
            endDate: repeatEndDate || undefined,
          },
          notificationTime,
        },
        Boolean(editingEvent)
      );
    };
  };

  return (
    <AlertDialog
      isOpen={isOverlapDialogOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => setIsOverlapDialogOpen(false)}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            일정 겹침 경고
          </AlertDialogHeader>

          <AlertDialogBody>
            다음 일정과 겹칩니다:
            {overlappingEvents.map((event) => (
              <Text key={event.id}>
                {event.title} ({event.date} {event.startTime}-{event.endTime})
              </Text>
            ))}
            계속 진행하시겠습니까?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => setIsOverlapDialogOpen(false)}>
              취소
            </Button>
            <Button colorScheme="red" onClick={handleSaveEvent} ml={3}>
              계속 진행
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
