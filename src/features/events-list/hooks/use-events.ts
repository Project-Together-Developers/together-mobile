import { useState, useEffect, useCallback } from 'react';
import { IEvent } from '../types/event';
import { fetchEvents } from '../api/events';

interface UseEventsResult {
  events: IEvent[];
  loading: boolean;
  error: boolean;
  retry: () => void;
}

export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { events, loading, error, retry: load };
}
