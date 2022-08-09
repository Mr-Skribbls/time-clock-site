import { useEffect, useState } from 'react';
import time from '../../services/time';
import KeyValue from '../KeyValue/KeyValue';

import './HourAllocation.css';

interface iHourAllocationProps {
  weeksHrsWorked?: number|undefined,
  weeksHrsPlanned?: number|undefined,
  hrsWorked: number|undefined,
  hrsPlanned: number|undefined,
}

const HourAllocation = ({weeksHrsWorked = 0, weeksHrsPlanned = 0, hrsWorked, hrsPlanned}: iHourAllocationProps) => {
  const [hoursLeft, setHoursLeft] = useState(0);
  const [clockOutTime, setClockOutTime] = useState('00:00');

  useEffect(() => {
    setHoursLeft(time.round(weeksHrsPlanned - weeksHrsWorked - (hrsWorked || 0), 3));
  }, [weeksHrsPlanned, weeksHrsWorked, hrsWorked])

  useEffect(() => {
    const getTimeDisplay = (t: number): string => t < 10 ? `0${t}` : t.toString();
    const extractHours = (hours: number): number => Math.floor(hours);
    const extractMinutes = (hours: number): number => Math.round(time.convertMsTo.minutes(time.convertToMs.hours(hours - extractHours(hours))));

    const now = new Date();
    const msNow = time.convertToMs.hours(now.getHours()) + time.convertToMs.minutes(now.getMinutes());
    const msTotal = msNow + time.convertToMs.hours(hoursLeft);
    const hrTotal = time.convertMsTo.hours(msTotal);

    setClockOutTime(`${getTimeDisplay(extractHours(hrTotal))}:${getTimeDisplay(extractMinutes(hrTotal))}`);
  }, [hoursLeft]);

  return (
    <>
      {/* <KeyValue
        k='Hours Planned'
        v={hrsPlanned}
        classNames='hrs-planned'></KeyValue> */}
      <KeyValue 
        k='Hours Worked'
        v={hrsWorked}
        classNames='hrs-worked'></KeyValue>
      <KeyValue
        k='Hours Left'
        v={hoursLeft}
        classNames='hrs-left'></KeyValue>
      <KeyValue
        k='Clock Out At'
        v={clockOutTime}></KeyValue>
    </>
  );
}

export default HourAllocation;