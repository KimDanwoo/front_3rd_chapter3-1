import { Box, Flex, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { Event } from '@entities/event/model/types';
import { useCalendarView } from '@features/calendar/model/hooks';
import { CalendarView } from '@features/calendar/ui';
import { useEventOperations } from '@features/event/model/hooks';
import { useEventFormStore } from '@features/event/model/stores';
import { AddEventForm, ClashEventDialog, EventList } from '@features/event/ui';
import { useNotifications } from '@features/notification/model/hooks';
import { NotificationDialog } from '@features/notification/ui';
import { useSearch } from '@features/search/model/hooks';
import { useRef, useState } from 'react';

export const CalendarPage = () => {
  const { editEvent } = useEventFormStore();
  const { events, saveEvent, deleteEvent } = useEventOperations();

  const { notifications, notifiedEvents, setNotifications } = useNotifications(events);
  const { view, currentDate } = useCalendarView();
  const { searchTerm, filteredEvents, setSearchTerm } = useSearch(events, currentDate, view);

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <AddEventForm
          events={events}
          setOverlappingEvents={setOverlappingEvents}
          setIsOverlapDialogOpen={setIsOverlapDialogOpen}
          saveEvent={saveEvent}
        />

        <CalendarView filteredEvents={filteredEvents} notifiedEvents={notifiedEvents} />

        <VStack data-testid="event-list" w="500px" h="full" overflowY="auto">
          <FormControl>
            <FormLabel>일정 검색</FormLabel>
            <Input
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormControl>

          <EventList
            filteredEvents={filteredEvents}
            notifiedEvents={notifiedEvents}
            editEvent={editEvent}
            deleteEvent={deleteEvent}
          />
        </VStack>
      </Flex>

      <ClashEventDialog
        isOverlapDialogOpen={isOverlapDialogOpen}
        setIsOverlapDialogOpen={setIsOverlapDialogOpen}
        overlappingEvents={overlappingEvents}
        cancelRef={cancelRef}
      />

      <NotificationDialog notifications={notifications} setNotifications={setNotifications} />
    </Box>
  );
};
