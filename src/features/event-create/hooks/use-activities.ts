import { useState, useEffect, useCallback } from "react";
import { IActivity } from "../types/event-interfaces";
import { fetchActivities } from "../api/events";

let activitiesCache: IActivity[] | null = null;

interface UseActivitiesResult {
  activities: IActivity[];
  loading: boolean;
  error: boolean;
  retry: () => void;
}

export function useActivities(): UseActivitiesResult {
  const [activities, setActivities] = useState<IActivity[]>(
    activitiesCache ?? [],
  );
  const [loading, setLoading] = useState(activitiesCache === null);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchActivities();
      activitiesCache = data;
      setActivities(data);
    } catch (err) {
      console.log({ err: JSON.stringify(err) });
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activitiesCache === null) {
      load();
    }
  }, [load]);

  return { activities, loading, error, retry: load };
}
