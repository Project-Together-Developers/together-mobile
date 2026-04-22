import { IUser } from './user';

export interface ICheckUsernameResponse {
  available: boolean;
}

export interface ICompleteProfileResponse {
  user: IUser;
}
