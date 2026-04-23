import { api } from '../../../api/axios';
import { IActivity, ICreatedEvent, ICreateEventPayload } from '../types/event-interfaces';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function fetchActivities(): Promise<IActivity[]> {
  const { data } = await api.get<ApiResponse<IActivity[]>>('/activities');
  return data.data;
}

export async function createEvent(payload: ICreateEventPayload): Promise<ICreatedEvent> {
  const { data } = await api.post<ApiResponse<ICreatedEvent>>('/events', payload);
  return data.data;
}
