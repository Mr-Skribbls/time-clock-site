export type ApiTimeCardId = string;
export type ApiTimeCardDate = string;
export type ApiTimeCardProjectId = string;
export type ApiTimeCardNotes = string;
export type ApiTimeCardAccumulatedTime = number;
export type ApiTimeCardTimePunch = string;

export interface iApiTimeCard {
  _id: ApiTimeCardId,
  date: ApiTimeCardDate,
  project_id: ApiTimeCardProjectId,
  notes: ApiTimeCardNotes,
  accumulated_time: ApiTimeCardAccumulatedTime,
  time_punch: ApiTimeCardTimePunch,
}

export interface iTimeCardQueryParams {
  date: Date,
  dateFrom: Date,
  dateTo: Date,
  projectId: ApiTimeCardProjectId,
  id: ApiTimeCardId,
}

export type TimeCardId = string;
export type TimeCardDate = Date;
export type TimeCardProjectId = string;
export type TimeCardNotes = string;
export type TimeCardAccumulatedTime = number;
export type TimeCardTimePunch = Date|null;

export default interface iTimeCard {
  _id: TimeCardId,
  date: TimeCardDate,
  project_id: TimeCardProjectId,
  notes: TimeCardNotes,
  accumulated_time: TimeCardAccumulatedTime,
  time_punch: TimeCardTimePunch,
}