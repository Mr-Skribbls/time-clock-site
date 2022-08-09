import iTimeCard from "../interfaces/iTimeCards";

const round = (num: number, decimalPlaces: number) => {
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round((num + Number.EPSILON) * multiplier) / multiplier;
};

const convertMsTo = {
  seconds: (ms: number) => ms/1000,
  minutes: (ms: number) => convertMsTo.seconds(ms)/60,
  hours: (ms: number) => convertMsTo.minutes(ms)/60,
};

const convertToMs = {
  seconds: (sec: number) => sec*1000,
  minutes: (min: number) => convertToMs.seconds(min*60),
  hours: (hrs: number) => convertToMs.minutes(hrs*60),
};

const getWorkingHours = (timeCard: iTimeCard) => {
  const acc = timeCard.accumulated_time || 0;
  const punchTime = timeCard.time_punch?.getTime() || 0;
  const hours = acc + (punchTime !== 0 ? convertMsTo.hours(Date.now() - punchTime) : 0);
  return round(hours, 3);
};

const time = {
  round,
  convertMsTo,
  convertToMs,
  getWorkingHours,
};

export default time;