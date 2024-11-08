import { Box, Flex } from '@chakra-ui/react';
import { Event } from '@entities/event/model/types';
import { useCalendarView } from '@features/calendar/model/hooks';
import { useEventOperations } from '@features/event/model/hooks';
import { AddEventForm, ClashEventDialog } from '@features/event/ui';
import { useNotifications } from '@features/notification/model/hooks';
import { useSearch } from '@features/search/model/hooks';
import { CalendarView } from '@widgets/calendar/ui';
import { EventView } from '@widgets/event/ui';
import { NotificationDialog } from '@widgets/notification/ui';
import { useRef, useState } from 'react';

export const CalendarPage = () => {
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

        <EventView
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          deleteEvent={deleteEvent}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
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
