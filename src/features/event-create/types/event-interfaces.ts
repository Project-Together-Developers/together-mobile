export interface IActivity {
  _id: string;
  name: string;
  icon: string;
}

export interface ICreatedEvent {
  _id: string;
  activityId: {
    _id: string;
    name: string;
    icon: string;
  };
  location: string;
  dateFrom: string;
  spots: number;
}

export type EventDifficulty = 'beginner' | 'medium' | 'pro';
export type EventTransport = 'need-ride' | 'has-seats' | 'public';

export interface ICreateEventPayload {
  activityId: string;
  location: string;
  dateFrom: string;
  dateTo?: string;
  difficulty: EventDifficulty;
  spots: number;
  alreadyGoing: number;
  transport: EventTransport;
  budget?: number;
  description?: string;
}
