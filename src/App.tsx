import { useEffect, useState } from 'react';
import _ from 'lodash';

/// ----- interfaces ----- ///
import iWeekday from './interfaces/iWeekday';
import iSchedule from './interfaces/iSchedule';
import iProject, { ProjectId } from './interfaces/iProject';
import iTimeCard, { TimeCardId, TimeCardNotes } from './interfaces/iTimeCards';

/// ----- components ----- ///
import HourAllocation from './components/HourAllocation/HourAllocation';
import ProjectList from './components/ProjectList/ProjectList';
import DaysProjectWork from './components/DaysProjectWork/DaysProjectWork';
import DateSelector from './components/DateSelector/DateSelector';

/// ----- services ----- ///
import api from './services/api';
import time from './services/time';
import date from './services/date';

/// ----- styles ----- ///
import './App.css';

const App = () => {
  const [weekdays, setWeekdays] = useState<iWeekday[]>([]);
  const [weekday, setWeekday] = useState('today');
  const [schedules, setSchedules] = useState<iSchedule[]>([]);
  const [projects, setProjects] = useState<iProject[]>([]);
  const [timeCards, setTimeCards] = useState<iTimeCard[]>([]);

  const [selectedProjectId, setSelectedProjectId] = useState<ProjectId | null>();
  const [workingProjectId, setWorkingProjectId] = useState<ProjectId | null>();
  const [weeksHoursPlanned, setWeeksHoursPlanned] = useState(0);
  const [weeksHoursWorked, setWeeksHoursWorked] = useState(0);
  const [selectedProjectTime, setSelectedProjectTime] = useState(0);
  const [daysTimeCardSum, setDaysTimeCardSum] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todaysDay, setTodaysDay] = useState(0);

  /// ----- Effects ----- ///
  useEffect(() => {
    const interval = setInterval(() => {
      const selectedProjectTimeCard =  getProjectTimeCard(selectedProjectId, timeCards);
      setSelectedProjectTime(addTimeCardsHoursWorked(_.isNil(selectedProjectTimeCard) ? [] : [selectedProjectTimeCard]));
      setDaysTimeCardSum(time.round(addTimeCardsHoursWorked(timeCards), 3));
    }, 100);

    return () => clearInterval(interval);
  }, [selectedProjectId, timeCards]);

  useEffect(() => {
    setTodaysDay(selectedDate.getDay());

    const loadAllData = async () => {
      loadWeekdays();
      loadProjects();
      loadSchedules();
      loadTimeCards();

      loadWeeksHoursWorked();
    };
    
    loadAllData();
  }, [selectedDate]);

  useEffect(() => {
    setWeeksHoursPlanned(schedules
      .filter((sdl) => sdl.weekday <= todaysDay)
      .reduce((res, sdl) => _.toNumber(res) + _.toNumber(sdl.planned_hours), 0)
    );
  }, [schedules, todaysDay]);

  useEffect(() => {    
    const getWorkingProject = (timeCards: iTimeCard[], projects: iProject[]): iProject | null => {
      let workingProject: iProject | null = null;
      const workingTimeCard: iTimeCard | undefined = getWorkingTimeCard(timeCards);
      if (!_.isNil(workingTimeCard)) {
        workingProject = projects.find((proj) => proj._id === workingTimeCard.project_id) || null;
      }
      return workingProject;
    };

    const wpId = getWorkingProject(timeCards, projects)?._id;
    setWorkingProjectId(wpId);
    
    if(_.isNil(selectedProjectId)) {
      setSelectedProjectId(wpId);
    }

    loadWeeksHoursWorked();

  }, [timeCards, projects]);

  useEffect(() => {
    const wd = weekdays.find((w) => w.index === todaysDay)
    if(!_.isNil(wd)) {
      setWeekday(wd.display_name.toString());
    }
  }, [weekdays, todaysDay]);


  /// ----- Data Loading ----- ///
  const loadWeekdays = async () => {
    const weekdays: iWeekday[] = await api.weekdays.all();
    setWeekdays(weekdays);
  };

  const loadProjects = async () => {
    const projects: iProject[] = await api.projects.all();
    setProjects(projects);
  };

  const loadSchedules = async () => {
    const schedules: iSchedule[] = await api.schedules.all();
    setSchedules(schedules);
  };

  const loadTimeCards = async () => {
    const timeCards: iTimeCard[] = await api.timeCards.all({
      date: selectedDate,
    });

    setTimeCards(timeCards);
  };

  const loadWeeksHoursWorked = async () => {
    const weekTimeCards: iTimeCard[] = await getWeeksTimeCards();
    setWeeksHoursWorked(getWeeksHoursWorked(weekTimeCards));
  };

  /// ----- Updates ----- ///

  const updateTimeCardNotes = async ({
    timeCardId,
    notes,
  }: {
    timeCardId: TimeCardId,
    notes: TimeCardNotes,
  }) => {
    return await api.timeCards.update(timeCardId, {
      notes,
    });
  };

  const updateTimeCardPunch = async ({
    datetime,
    projectId,
    timeCard,
    timeCards,
  }: {
    datetime: Date,
    projectId: ProjectId,
    timeCard: iTimeCard | null | undefined,
    timeCards: iTimeCard[],
  }) => {
    if (_.isNil(timeCard)) {
      const addedTimeCards: iTimeCard[] = await api.timeCards.add(projectId, datetime);
      timeCards = [...timeCards, ...addedTimeCards]
      timeCard = addedTimeCards[0];
    }

    return await api.timeCards.update(timeCard._id, {
      timePunch: true,
    });
  };

  /// ----- Events ----- ///
  const toggleProjectSelection = (projectId: ProjectId): void => {
    console.log(selectedProjectId);
    setSelectedProjectId(projectId !== selectedProjectId ? projectId : null);
  };

  const toggleStart = (timeCards: iTimeCard[]) => (projectId: ProjectId): void => {
    setWorkingProjectId(workingProjectId !== projectId ? projectId : null);
    setSelectedProjectId(workingProjectId !== projectId ? projectId : workingProjectId);

    const datetime: Date = new Date();
    let timeCard: iTimeCard | null | undefined = getProjectTimeCard(projectId, timeCards);
    let timeCards_copy: iTimeCard[] = _.cloneDeep(timeCards);

    const update = updateTimeCardPunch({
      datetime,
      projectId,
      timeCard,
      timeCards: timeCards_copy,
    });

    update.then(() => loadTimeCards());
  };

  const updateNotes = (timeCard: iTimeCard | null | undefined) => (value: TimeCardNotes) => {
    if (_.isNil(timeCard)) return;

    const p = updateTimeCardNotes({
      timeCardId: timeCard._id,
      notes: value,
    });

    p.then(() => loadTimeCards());
  };

  /// ----- Methods ----- ///

  const getProjectTimeCard = (projectId: ProjectId | null | undefined, timeCards: iTimeCard[]): iTimeCard | null | undefined =>
    _.isNil(projectId) ? null : timeCards.find((tc) => tc.project_id === projectId);

  const getWorkingTimeCard = (timeCards: iTimeCard[]): iTimeCard | undefined => {
    return timeCards.find((tc) => !_.isNil(tc.time_punch));
  };

  const addTimeCardsHoursWorked = (timeCards: iTimeCard[]): number => 
    timeCards.reduce((acc, timeCard) => acc + time.getWorkingHours(timeCard), 0);

  const getWeeksHoursWorked = (weekTimeCards: iTimeCard[]) => weekTimeCards.reduce((res, tc) => _.toNumber(res) + _.toNumber(tc.accumulated_time), 0);

  const getWeeksTimeCards = (): Promise<iTimeCard[]> => api.timeCards.all({
    dateFrom: new Date((new Date()).setDate((new Date()).getDate() - todaysDay)),
    dateTo: new Date(),
  });

  return (
    <div className='app'>
      <div className='date-display'>
        <DateSelector
          selectedDate={selectedDate}
          setDate={setSelectedDate}></DateSelector>  
      </div>
      <div className='timecard'>
        <div className='timecard-section hour-allocation'>
          <HourAllocation
            weeksHrsWorked={weeksHoursWorked}
            weeksHrsPlanned={weeksHoursPlanned}
            hrsWorked={daysTimeCardSum}
            hrsPlanned={schedules.find((s) => s.weekday === todaysDay)?.planned_hours}></HourAllocation>
        </div>
        <div className='timecard-section projects-list'>
          <ProjectList
            projects={projects}
            selectedProjectId={selectedProjectId}
            workingProjectId={workingProjectId}
            toggleProjectSelection={toggleProjectSelection}
            toggleStart={toggleStart(timeCards)}></ProjectList>
        </div>
        <div className='timecard-section project-breakdown'>
          <DaysProjectWork
            timeCard={getProjectTimeCard(selectedProjectId, timeCards)}
            timeAccrued={selectedProjectTime}
            updateNotes={updateNotes(getProjectTimeCard(selectedProjectId, timeCards))}></DaysProjectWork>
        </div>
      </div>
    </div>
  );
}

export default App;
