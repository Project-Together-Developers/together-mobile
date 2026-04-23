export enum EventErrorCode {
  ACTIVITY_REQUIRED = 'createEvent.errors.activityRequired',
  LOCATION_REQUIRED = 'createEvent.errors.locationRequired',
  DATE_FROM_REQUIRED = 'createEvent.errors.dateFromRequired',
  DATE_FROM_INVALID = 'createEvent.errors.dateFromInvalid',
  DATE_FROM_PAST = 'createEvent.errors.dateFromPast',
  DATE_TO_INVALID = 'createEvent.errors.dateToInvalid',
  DATE_TO_BEFORE_FROM = 'createEvent.errors.dateToBeforeFrom',
  DIFFICULTY_REQUIRED = 'createEvent.errors.difficultyRequired',
  SPOTS_INVALID = 'createEvent.errors.spotsInvalid',
  ALREADY_GOING_INVALID = 'createEvent.errors.alreadyGoingInvalid',
  TRANSPORT_REQUIRED = 'createEvent.errors.transportRequired',
  SUBMIT_FAILED = 'createEvent.errors.submitFailed',
}
