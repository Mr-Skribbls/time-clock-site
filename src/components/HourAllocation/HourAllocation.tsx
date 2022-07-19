import KeyValue from '../KeyValue/KeyValue';

import './HourAllocation.css';

interface iHourAllocationProps {
  weeksHrsWorked?: number|undefined,
  weeksHrsPlanned?: number|undefined,
  hrsWorked: number|undefined,
  hrsPlanned: number|undefined,
}

const HourAllocation = ({weeksHrsWorked = 0, weeksHrsPlanned = 0, hrsWorked, hrsPlanned}: iHourAllocationProps) => {
  return (
    <>
      <KeyValue 
        k='Hours Worked'
        v={hrsWorked}
        classNames='hrs-worked'></KeyValue>
      <KeyValue
        k='Hours Planned'
        v={hrsPlanned}
        classNames='hrs-planned'></KeyValue>
      <KeyValue
        k='Hours Left'
        v={weeksHrsPlanned - weeksHrsWorked}
        classNames='hrs-left'></KeyValue>
    </>
  );
}

export default HourAllocation;