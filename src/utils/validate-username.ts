import { UserErrorCode } from '../enums/user-error-codes';

export type UsernameValidation =
  | { ok: true }
  | { ok: false; code: UserErrorCode };

const USERNAME_REGEX = /^[a-z0-9_.]+$/;

export function validateUsername(raw: string): UsernameValidation {
  const trimmed = raw.trim().toLowerCase();
  if (trimmed.length === 0) return { ok: false, code: UserErrorCode.USERNAME_REQUIRED };
  if (trimmed.length < 3 || trimmed.length > 20) {
    return { ok: false, code: UserErrorCode.USERNAME_INVALID };
  }
  if (!USERNAME_REGEX.test(trimmed)) {
    return { ok: false, code: UserErrorCode.USERNAME_INVALID };
  }
  return { ok: true };
}
