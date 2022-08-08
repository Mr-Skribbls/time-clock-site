import {useEffect, useState} from 'react';
import _, { update } from 'lodash';

/// ----- interfaces ----- ///
import iWeekday from './interfaces/iWeekday';
import iSchedule from './interfaces/iSchedule';
import iProject, { ProjectId } from './interfaces/iProject';
import iTimeCard from './interfaces/iTimeCards';

/// ----- components ----- ///
import HourAllocation from './components/HourAllocation/HourAllocation';
import ProjectList from './components/ProjectList/ProjectList';
import DaysProjectWork from './components/DaysProjectWork/DaysProjectWork';

/// ----- services ----- ///
import api from './services/api';

/// ----- styles ----- ///
import './App.css';

const App = () => {
  const [weekdays, setWeekdays] = useState<iWeekday[]>([]);
  const [schedules, setSchedules] = useState<iSchedule[]>([]);
  const [projects, setProjects] = useState<iProject[]>([]);
  const [timeCards, setTimeCards] = useState<iTimeCard[]>([]);

  const [selectedProjectId, setSelectedProjectId] = useState<ProjectId|null>();
  const [workingProjectId, setWorkingProjectId] = useState<ProjectId|null>();
  const [weeksHoursPlanned, setWeeksHoursPlanned] = useState<number>(0);
  const [weeksHoursWorked, setWeeksHoursWorked] = useState<number>(0);

  /// ----- Effects ----- ///
  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    setWeeksHoursPlanned(schedules
      .filter((sdl) => sdl.weekday <= todaysDay)
      .reduce((res, sdl) => _.toNumber(res) + _.toNumber(sdl.planned_hours), weeksHoursPlanned)
    );
  }, [schedules]);

  useEffect(() => {
    setWorkingProjectId(getWorkingProject(timeCards, projects)?._id);
  }, [timeCards, projects]);


  const todaysDay = (new Date()).getDay();

  /// ----- Data Loading ----- ///
  const loadAllData = async () => {
    loadWeekdays();
    loadProjects();
    loadSchedules();
    loadTimeCards();

    loadWeeksHoursWorked();
  };

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
      date: new Date(),
    });

    setTimeCards(timeCards);
  };

  const loadWeeksHoursWorked = async () => {
    const weekTimeCards: iTimeCard[] = await api.timeCards.all({
      dateFrom: new Date((new Date()).setDate((new Date()).getDate() - todaysDay)),
      dateTo: new Date(),
    });
    setWeeksHoursWorked(weekTimeCards.reduce((res, tc) => _.toNumber(res) + _.toNumber(tc.accumulated_time), weeksHoursWorked));
  };

  /// ----- Updates ----- ///
  
  const updateTimeCard = async ({
    datetime,
    projectId,
    timeCard,
    timeCards,
  }: {
    datetime: Date,
    projectId: ProjectId,
    timeCard: iTimeCard|undefined,
    timeCards: iTimeCard[],
  }) => {
    if(_.isNil(timeCard)) {
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
    setSelectedProjectId(projectId !== selectedProjectId ? projectId : null);
  };

  const toggleStart = (timeCards: iTimeCard[]) => (projectId: ProjectId): void => {
    setWorkingProjectId(workingProjectId !== projectId ? projectId : null);
    setSelectedProjectId(workingProjectId !== projectId ? projectId : workingProjectId);

    const datetime: Date = new Date();
    let timeCard: iTimeCard|undefined = timeCards.find((tc) => tc.project_id === projectId);
    let timeCards_copy: iTimeCard[] = _.cloneDeep(timeCards);

    const update = updateTimeCard({
      datetime,
      projectId,
      timeCard,
      timeCards: timeCards_copy,
    });

    update.then(() => loadTimeCards());
  };

  /// ----- Methods ----- ///

  const getWorkingTimeCard = (timeCards: iTimeCard[]): iTimeCard|undefined => {
    return timeCards.find((tc) => !_.isNil(tc.time_punch));
  };

  const getWorkingProject = (timeCards: iTimeCard[], projects: iProject[]): iProject|null => {
    let workingProject: iProject|null = null;
    const workingTimeCard: iTimeCard|undefined = getWorkingTimeCard(timeCards);
    if(!_.isNil(workingTimeCard)) {
      workingProject = projects.find((proj) => proj._id === workingTimeCard.project_id) || null;
    }
    return workingProject;
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
          <ProjectList 
            projects={projects} 
            selectedProjectId={selectedProjectId}
            workingProjectId={workingProjectId}
            toggleProjectSelection={toggleProjectSelection}
            toggleStart={toggleStart(timeCards)}></ProjectList>
        </div>
        <div className='timecard-section project-breakdown'>
          <DaysProjectWork></DaysProjectWork>
        </div>
      </div>
    </div>
  );
}

export default App;
