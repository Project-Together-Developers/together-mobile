export type Gender = 'male' | 'female';

export interface IUser {
  id: string;
  phone: string;
  name: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  gender?: Gender;
  birthday?: string;
  avatar?: string;
  isProfileComplete: boolean;
  role: 'user' | 'admin';
}

export interface CompleteProfilePayload {
  username: string;
  firstname: string;
  lastname?: string;
  gender?: Gender;
  birthday?: string;
  avatar?: {
    uri: string;
    name: string;
    type: string;
  };
}
