import { useState, useCallback } from 'react';
import { IEvent } from '../types/event';
import { fetchEvent } from '../api/events';

interface UseEventDetailResult {
  event: IEvent | null;
  loading: boolean;
  error: boolean;
  load: (id: string) => void;
}

export function useEventDetail(): UseEventDetailResult {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async (id: string) => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchEvent(id);
      setEvent(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return { event, loading, error, load };
}
