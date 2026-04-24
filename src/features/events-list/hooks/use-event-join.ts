import { useState } from 'react';
import { joinEvent, leaveEvent } from '../api/events';

export type JoinResult = { joined: boolean; spotsFilled: number };

interface UseEventJoinResult {
  joining: boolean;
  toggle: (eventId: string, currentlyJoined: boolean) => Promise<JoinResult>;
}

export function useEventJoin(): UseEventJoinResult {
  const [joining, setJoining] = useState(false);

  const toggle = async (eventId: string, currentlyJoined: boolean): Promise<JoinResult> => {
    setJoining(true);
    try {
      if (currentlyJoined) {
        return await leaveEvent(eventId);
      } else {
        return await joinEvent(eventId);
      }
    } finally {
      setJoining(false);
    }
  };

  return { joining, toggle };
}
