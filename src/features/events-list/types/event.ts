import { EventDifficulty, EventTransport } from '../../event-create/types/event-interfaces';

export interface IEventActivity {
  _id: string;
  name: string;
  icon: string;
}

export interface IEventUser {
  _id: string;
  firstname: string;
  lastname?: string;
  username: string;
  avatar?: string;
}

export interface IEventParticipant {
  _id: string;
  user: IEventUser;
  joinedAt: string;
}

export interface IEvent {
  _id: string;
  activity: IEventActivity;
  organizer: IEventUser;
  location: string;
  dateFrom: string;
  dateTo?: string;
  difficulty: EventDifficulty;
  spots: number;
  spotsFilled: number;
  alreadyGoing: number;
  transport: EventTransport;
  budget?: number;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  participants?: IEventParticipant[];
  createdAt: string;
}

export type EventTabFilter = 'active' | 'past' | 'my';
