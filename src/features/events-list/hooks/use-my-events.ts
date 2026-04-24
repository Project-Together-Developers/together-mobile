import { useState, useCallback } from 'react';
import { IEvent } from '../types/event';
import { fetchMyEvents } from '../api/events';

interface UseMyEventsResult {
  events: IEvent[];
  loading: boolean;
  error: boolean;
  load: () => void;
}

export function useMyEvents(): UseMyEventsResult {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchMyEvents();
      setEvents(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return { events, loading, error, load };
}
