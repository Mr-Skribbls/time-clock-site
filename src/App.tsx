import {useEffect, useState} from 'react';
import _ from 'lodash';

/// ----- interfaces ----- ///
import iWeekday from './interfaces/iWeekday';
import iSchedule from './interfaces/iSchedule';
import iProject from './interfaces/iProject';
import iTimeCard from './interfaces/iTimeCards';

/// ----- components ----- ///

/// ----- services ----- ///
import api from './services/api';

/// ----- styles ----- ///
import './App.css';
import HourAllocation from './components/HourAllocation/HourAllocation';
import ProjectList from './components/ProjectList/ProjectList';
import DaysProjectWork from './components/DaysProjectWork/DaysProjectWork';

const App = () => {
  const [weekdays, setWeekdays] = useState<iWeekday[]>([]);
  const [schedules, setSchedules] = useState<iSchedule[]>([]);
  const [projects, setProjects] = useState<iProject[]>([]);
  const [timeCards, setTimeCards] = useState<iTimeCard[]>([]);

  const [selectedProject, setSelectedProject] = useState<iProject>();
  const [weeksHoursPlanned, setWeeksHoursPlanned] = useState<number>(0);
  const [weeksHoursWorked, setWeeksHoursWorked] = useState<number>(0);

  useEffect(() => {
    loadData();
  }, []);
  
  const todaysDay = (new Date()).getDay();

  const loadData = async () => {
    const weekdays: iWeekday[] = await api.weekdays.all();
    const projects: iProject[] = await api.projects.all();
    const schedules: iSchedule[] = await api.schedules.all();
    const weekTimeCards: iTimeCard[] = await api.timeCards.all({
      dateFrom: new Date((new Date()).setDate((new Date()).getDate() - todaysDay)),
      dateTo: new Date(),
    })
    const timeCards: iTimeCard[] = await api.timeCards.all({
      date: new Date(),
    });

    setWeekdays(weekdays);
    setProjects(projects);
    setSchedules(schedules);
    setTimeCards(timeCards);

    setWeeksHoursWorked(weekTimeCards.reduce((res, tc) => _.toNumber(res) + _.toNumber(tc.accumulated_time), weeksHoursWorked));

    setWeeksHoursPlanned(schedules
      .filter((sdl) => sdl.weekday <= todaysDay)
      .reduce((res, sdl) => _.toNumber(res) + _.toNumber(sdl.planned_hours), weeksHoursPlanned)
    );

    console.log('weekdays', weekdays);
    console.log('projects', projects);
    console.log('schedules', schedules);
    console.log('time cards', timeCards);
  };

  return (
    <div className='app'>
      <div className='date-display'>today</div>
      <div className='timecard'>
        <div className='timecard-section hour-allocation'>
          <HourAllocation 
            weeksHrsWorked={weeksHoursWorked}
            weeksHrsPlanned={weeksHoursPlanned}
            hrsWorked={1} 
            hrsPlanned={schedules.find((s) => s.weekday === todaysDay)?.planned_hours}></HourAllocation>
        </div>
        <div className='timecard-section projects-list'>
          <ProjectList projects={projects}></ProjectList>
        </div>
        <div className='timecard-section project-breakdown'>
          <DaysProjectWork></DaysProjectWork>
        </div>
      </div>
    </div>
  );
}

export default App;
