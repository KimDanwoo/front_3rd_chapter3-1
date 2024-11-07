import { Event, EventForm } from '@entities/event/model/types';
import { create } from 'zustand';

type OperationResult = {
  success: boolean;
  error?: unknown;
  editing?: boolean;
};

interface EventState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<OperationResult>;
  saveEvent: (eventData: Event | EventForm, editing: boolean) => Promise<OperationResult>;
  deleteEvent: (id: string) => Promise<OperationResult>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  isLoading: false,
  error: null,

  fetchEvents: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const { events } = await response.json();
      set({ events, isLoading: false });
      return { success: true };
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
      return { success: false, error };
    }
  },

  saveEvent: async (eventData: Event | EventForm, editing: boolean) => {
    try {
      set({ isLoading: true, error: null });
      let response;

      if (editing) {
        response = await fetch(`/api/events/${(eventData as Event).id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        });
      } else {
        response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      await get().fetchEvents();
      return { success: true, editing };
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
      return { success: false, error };
    }
  },

  deleteEvent: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      await get().fetchEvents();
      return { success: true };
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
      return { success: false, error };
    }
  },
}));
