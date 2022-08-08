import _ from 'lodash';
import { useState, useEffect } from 'react';
import iTimeCard from '../../interfaces/iTimeCards';

/// ----- styles ----- ///
import './DaysProjectWork.css';

interface iDaysProjectWork {
  timeCard: iTimeCard|null|undefined,
  updateNotes: Function,
};

const DaysProjectWork = ({
  timeCard,
  updateNotes
}: iDaysProjectWork) => {
  const [text, setText] = useState('');
  const [workingTime, setWorkingTime] = useState('');

  useEffect(() => {
    setText(!_.isNil(timeCard) ? timeCard.notes : '');

    const getWorkingTime = (timeCard: iTimeCard|null|undefined): string => {
      const acc = timeCard?.accumulated_time || 0;
      const punchTime = !_.isNil(timeCard) && !_.isNil(timeCard.time_punch) ? 
        timeCard.time_punch.getTime() :
        0;
      const totalHours = acc + (punchTime !== 0 ? (Date.now() - punchTime)/1000/60/60 : 0);
  
      return round(totalHours).toString();
    };
  
    const interval = setInterval(() => {
      if(_.isNil(timeCard)) return;
      setWorkingTime(getWorkingTime(timeCard));
    }, 100);

    return () => clearInterval(interval);
  }, [timeCard]);

  const round = (hrs: number) => Math.round((hrs + Number.EPSILON) * 1000) / 1000

  return (
    <div className='work-container'>
      <span>Time: {workingTime}</span>
      <span>Notes</span>
      <textarea onChange={(e) => updateNotes(e.target.value)} value={text}></textarea>
    </div>
  );
};

export default DaysProjectWork;