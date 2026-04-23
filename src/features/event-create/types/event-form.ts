import { EventDifficulty, EventTransport } from './event-interfaces';

export interface IEventFormState {
  activityId: string;
  location: string;
  dateFrom: string;
  dateTo: string;
  difficulty: EventDifficulty | undefined;
  spots: string;
  alreadyGoing: string;
  transport: EventTransport | undefined;
  budget: string;
  description: string;
}

export interface IEventFormErrors {
  activityId?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  difficulty?: string;
  spots?: string;
  alreadyGoing?: string;
  transport?: string;
  submit?: string;
}
