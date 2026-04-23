import React, { useState, useCallback, createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { IEventFormState, IEventFormErrors } from '../types/event-form';
import { EventDifficulty, EventTransport, ICreatedEvent, ICreateEventPayload } from '../types/event-interfaces';
import { EventErrorCode } from '../types/event-error-codes';
import { parseDDMMYYYYAny } from '../../../utils/format-date';
import { createEvent } from '../api/events';

const INITIAL_STATE: IEventFormState = {
  activityId: '',
  location: '',
  dateFrom: '',
  dateTo: '',
  difficulty: undefined,
  spots: '1',
  alreadyGoing: '0',
  transport: undefined,
  budget: '',
  description: '',
};

export interface UseEventFormResult {
  form: IEventFormState;
  errors: IEventFormErrors;
  submitting: boolean;
  setActivityId: (id: string) => void;
  setLocation: (v: string) => void;
  setDateFrom: (v: string) => void;
  setDateTo: (v: string) => void;
  setDifficulty: (v: EventDifficulty | undefined) => void;
  setSpots: (v: string) => void;
  setAlreadyGoing: (v: string) => void;
  setTransport: (v: EventTransport | undefined) => void;
  setBudget: (v: string) => void;
  setDescription: (v: string) => void;
  validateStep1: () => boolean;
  validateStep2: () => boolean;
  submit: () => Promise<ICreatedEvent | null>;
  reset: () => void;
}

export const EventFormContext = createContext<UseEventFormResult | null>(null);

export function useEventFormContext(): UseEventFormResult {
  const ctx = useContext(EventFormContext);
  if (!ctx) throw new Error('useEventFormContext must be used within EventFormContext.Provider');
  return ctx;
}

export function useEventForm(): UseEventFormResult {
  const { t } = useTranslation();
  const [form, setForm] = useState<IEventFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<IEventFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const clearError = (key: keyof IEventFormErrors) =>
    setErrors((prev) => ({ ...prev, [key]: undefined }));

  const setActivityId = useCallback((id: string) => {
    setForm((prev) => ({ ...prev, activityId: id }));
    clearError('activityId');
  }, []);

  const setLocation = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, location: v }));
    clearError('location');
  }, []);

  const setDateFrom = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, dateFrom: v }));
    clearError('dateFrom');
  }, []);

  const setDateTo = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, dateTo: v }));
    clearError('dateTo');
  }, []);

  const setDifficulty = useCallback((v: EventDifficulty | undefined) => {
    setForm((prev) => ({ ...prev, difficulty: v }));
    clearError('difficulty');
  }, []);

  const setSpots = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, spots: v }));
    clearError('spots');
  }, []);

  const setAlreadyGoing = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, alreadyGoing: v }));
    clearError('alreadyGoing');
  }, []);

  const setTransport = useCallback((v: EventTransport | undefined) => {
    setForm((prev) => ({ ...prev, transport: v }));
    clearError('transport');
  }, []);

  const setBudget = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, budget: v }));
  }, []);

  const setDescription = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, description: v }));
  }, []);

  const validateStep1 = useCallback((): boolean => {
    const newErrors: IEventFormErrors = {};
    if (!form.activityId) newErrors.activityId = t(EventErrorCode.ACTIVITY_REQUIRED);
    if (!form.location.trim()) newErrors.location = t(EventErrorCode.LOCATION_REQUIRED);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form.activityId, form.location, t]);

  const validateStep2 = useCallback((): boolean => {
    const newErrors: IEventFormErrors = {};

    if (!form.dateFrom) {
      newErrors.dateFrom = t(EventErrorCode.DATE_FROM_REQUIRED);
    } else {
      const dateFromParsed = parseDDMMYYYYAny(form.dateFrom);
      if (!dateFromParsed) {
        newErrors.dateFrom = t(EventErrorCode.DATE_FROM_INVALID);
      } else if (dateFromParsed.getTime() <= Date.now()) {
        newErrors.dateFrom = t(EventErrorCode.DATE_FROM_PAST);
      } else if (form.dateTo) {
        const dateToParsed = parseDDMMYYYYAny(form.dateTo);
        if (!dateToParsed) {
          newErrors.dateTo = t(EventErrorCode.DATE_TO_INVALID);
        } else if (dateToParsed.getTime() <= dateFromParsed.getTime()) {
          newErrors.dateTo = t(EventErrorCode.DATE_TO_BEFORE_FROM);
        }
      }
    }

    if (!form.difficulty) newErrors.difficulty = t(EventErrorCode.DIFFICULTY_REQUIRED);
    if (!form.transport) newErrors.transport = t(EventErrorCode.TRANSPORT_REQUIRED);

    const spotsNum = parseInt(form.spots, 10);
    if (isNaN(spotsNum) || spotsNum < 1) newErrors.spots = t(EventErrorCode.SPOTS_INVALID);

    const alreadyGoingNum = parseInt(form.alreadyGoing, 10);
    if (isNaN(alreadyGoingNum) || alreadyGoingNum < 0) newErrors.alreadyGoing = t(EventErrorCode.ALREADY_GOING_INVALID);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form.dateFrom, form.dateTo, form.difficulty, form.transport, form.spots, form.alreadyGoing, t]);

  const submit = useCallback(async (): Promise<ICreatedEvent | null> => {
    setSubmitting(true);
    setErrors((prev) => ({ ...prev, submit: undefined }));
    try {
      const dateFromDate = parseDDMMYYYYAny(form.dateFrom)!;
      const dateToDate = form.dateTo ? parseDDMMYYYYAny(form.dateTo) : null;

      const payload: ICreateEventPayload = {
        activityId: form.activityId,
        location: form.location.trim(),
        dateFrom: dateFromDate.toISOString(),
        dateTo: dateToDate ? dateToDate.toISOString() : undefined,
        difficulty: form.difficulty!,
        spots: parseInt(form.spots, 10),
        alreadyGoing: parseInt(form.alreadyGoing, 10),
        transport: form.transport!,
        budget: form.budget ? parseFloat(form.budget) : undefined,
        description: form.description.trim() || undefined,
      };

      const event = await createEvent(payload);
      return event;
    } catch {
      setErrors((prev) => ({ ...prev, submit: t(EventErrorCode.SUBMIT_FAILED) }));
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [form, t]);

  const reset = useCallback(() => {
    setForm(INITIAL_STATE);
    setErrors({});
    setSubmitting(false);
  }, []);

  return {
    form,
    errors,
    submitting,
    setActivityId,
    setLocation,
    setDateFrom,
    setDateTo,
    setDifficulty,
    setSpots,
    setAlreadyGoing,
    setTransport,
    setBudget,
    setDescription,
    validateStep1,
    validateStep2,
    submit,
    reset,
  };
}
