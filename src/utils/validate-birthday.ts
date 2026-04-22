import { UserErrorCode } from '../enums/user-error-codes';
import { parseDDMMYYYY } from './format-date';

const MIN_AGE_YEARS = 13;

export type BirthdayValidation =
  | { ok: true; date?: Date }
  | { ok: false; code: UserErrorCode };

function yearsBetween(from: Date, to: Date): number {
  let years = to.getUTCFullYear() - from.getUTCFullYear();
  const monthDiff = to.getUTCMonth() - from.getUTCMonth();
  const dayDiff = to.getUTCDate() - from.getUTCDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) years -= 1;
  return years;
}

export function validateBirthday(raw: string): BirthdayValidation {
  if (!raw || raw.trim().length === 0) return { ok: true };
  const parsed = parseDDMMYYYY(raw);
  if (!parsed) return { ok: false, code: UserErrorCode.INVALID_BIRTHDAY };
  if (yearsBetween(parsed, new Date()) < MIN_AGE_YEARS) {
    return { ok: false, code: UserErrorCode.UNDERAGE };
  }
  return { ok: true, date: parsed };
}
