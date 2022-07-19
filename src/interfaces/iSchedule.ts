export type scheduleId = string;
export type scheduleWeekday = number;
export type schedulePlannedHours = number;

export default interface iSchedule {
  _id: scheduleId,
  weekday: scheduleWeekday,
  planned_hours: schedulePlannedHours,
}