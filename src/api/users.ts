import { api } from './axios';
import { CompleteProfilePayload, IUser } from '../interfaces/user';
import { ICheckUsernameResponse, ICompleteProfileResponse } from '../interfaces/api-responses';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function checkUsername(username: string): Promise<ICheckUsernameResponse> {
  const { data } = await api.get<ApiResponse<ICheckUsernameResponse>>('/users/check-username', {
    params: { username },
  });
  return data.data;
}

export async function completeProfile(payload: CompleteProfilePayload): Promise<IUser> {
  const form = new FormData();
  form.append('username', payload.username);
  form.append('firstname', payload.firstname);
  if (payload.lastname) form.append('lastname', payload.lastname);
  if (payload.gender) form.append('gender', payload.gender);
  if (payload.birthday) form.append('birthday', payload.birthday);
  if (payload.avatar) {
    form.append('avatar', {
      uri: payload.avatar.uri,
      name: payload.avatar.name,
      type: payload.avatar.type,
    } as unknown as Blob);
  }

  const { data } = await api.post<ApiResponse<ICompleteProfileResponse>>(
    '/users/me/complete-profile',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data.user;
}
