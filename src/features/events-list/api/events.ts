import { api } from '../../../api/axios';
import { IEvent } from '../types/event';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function fetchEvents(): Promise<IEvent[]> {
  const { data } = await api.get<ApiResponse<IEvent[]>>('/events');
  return data.data;
}

export async function fetchMyEvents(): Promise<IEvent[]> {
  const { data } = await api.get<ApiResponse<IEvent[]>>('/events/my');
  return data.data;
}

export async function fetchEvent(id: string): Promise<IEvent> {
  const { data } = await api.get<ApiResponse<IEvent>>(`/events/${id}`);
  return data.data;
}

export async function joinEvent(id: string): Promise<{ joined: boolean; spotsFilled: number }> {
  const { data } = await api.post<ApiResponse<{ joined: boolean; spotsFilled: number }>>(`/events/${id}/join`);
  return data.data;
}

export async function leaveEvent(id: string): Promise<{ joined: boolean; spotsFilled: number }> {
  const { data } = await api.delete<ApiResponse<{ joined: boolean; spotsFilled: number }>>(`/events/${id}/join`);
  return data.data;
}
