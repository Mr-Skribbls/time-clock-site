import _ from 'lodash';
import { useState, useEffect } from 'react';
import iTimeCard from '../../interfaces/iTimeCards';

/// ----- styles ----- ///
import './DaysProjectWork.css';

interface iDaysProjectWork {
  timeCard: iTimeCard|null|undefined,
  timeAccrued: number,
  updateNotes: Function,
};

const DaysProjectWork = ({
  timeCard,
  timeAccrued,
  updateNotes
}: iDaysProjectWork) => {
  const [notes, setNotes] = useState('');
  // const [workingTime, setWorkingTime] = useState('');

  useEffect(() => {
    setNotes(!_.isNil(timeCard) ? timeCard.notes : '');
  }, [timeCard]);

  const timeCardWork = (workingTime: string, notes: string) => (
    <div className='work-container'>
      <span>Time: {workingTime}</span>
      <span>Notes</span>
      <textarea onChange={(e) => updateNotes(e.target.value)} value={notes}></textarea>
    </div>
  );

  const noTimeCard = () => (
    <div>No Timecard</div>
  );

  return _.isNil(timeCard) ? noTimeCard() : timeCardWork(timeAccrued.toString(), notes);
};

export default DaysProjectWork;