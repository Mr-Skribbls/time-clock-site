import date from '../../services/date';

import './DateSelector.css';

interface iDateSelectorProps {
  selectedDate: Date,
  setDate: Function,
}

const DateSelector = ({
  selectedDate,
  setDate,
}: iDateSelectorProps) => {

  const incrementDate = (days: number) => () => {
    setDate(date(selectedDate).add.days(days));
  }

  return (
    <div className='date-selector'>
      <div className='selector-button' onClick={incrementDate(-1)}>&lt;</div>
      <div className='date-display'>{selectedDate.toDateString()}</div>
      <div className='selector-button' onClick={incrementDate(1)}>&gt;</div>
    </div>
  )
};

export default DateSelector;