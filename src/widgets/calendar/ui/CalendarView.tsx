import { Heading, VStack } from '@chakra-ui/react';
import { Event } from '@entities/event/model/types';
import { useCalendarView } from '@features/calendar/model/hooks';
import { CalenderController } from '@features/calendar/ui';
import { MonthView } from '@features/calendar/ui/MonthView';
import { WeekView } from '@features/calendar/ui/WeekView';

interface CalendarViewProps {
  filteredEvents: Event[];
  notifiedEvents: string[];
}

export const CalendarView = ({ filteredEvents, notifiedEvents }: CalendarViewProps) => {
  const { view, setView, currentDate, holidays, navigate } = useCalendarView();
  return (
    <VStack flex={1} spacing={5} align="stretch">
      <Heading>일정 보기</Heading>

      <CalenderController view={view} setView={setView} navigate={navigate} />

      {view === 'week' && (
        <WeekView
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
        />
      )}

      {view === 'month' && (
        <MonthView
          currentDate={currentDate}
          holidays={holidays}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
        />
      )}
    </VStack>
  );
};
