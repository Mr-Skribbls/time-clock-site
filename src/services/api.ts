import { 
  iAllRequestAction, 
  iOneRequestAction, 
  iAddRequestAction, 
  iUpdateRequestAction, 
  iDeleteRequestAction,
} from '../interfaces/iApiRequestActions';
import iWeekday, {WeekdayIndex} from '../interfaces/iWeekday';
import iSchedule, {scheduleWeekday, schedulePlannedHours, scheduleId} from '../interfaces/iSchedule';
import iProject, {ProjectId, ProjectName} from '../interfaces/iProject';
import iTimeCard, { 
  TimeCardProjectId, 
  TimeCardDate, 
  TimeCardId,
  iApiTimeCard,
  iTimeCardQueryParams,
} from '../interfaces/iTimeCards';
import _ from 'lodash';

interface iWeekdaysRequestActions extends 
  iAllRequestAction, 
  iOneRequestAction {};

interface iScheduleRequestActions extends 
  iAllRequestAction, 
  iOneRequestAction, 
  iAddRequestAction, 
  iUpdateRequestAction,
  iDeleteRequestAction {};

interface iProjectRequestActions extends
  iAllRequestAction,
  iOneRequestAction,
  iAddRequestAction,
  iDeleteRequestAction {};

interface iTimeCardRequestActions extends
  iAllRequestAction, 
  iOneRequestAction, 
  iAddRequestAction, 
  iUpdateRequestAction,
  iDeleteRequestAction {};

interface iApi {
  weekdays: iWeekdaysRequestActions,
  schedules: iScheduleRequestActions,
  projects: iProjectRequestActions,
  timeCards: iTimeCardRequestActions,
};

type QueryParams = { [key: string]: any}

interface iRequestSettings {
  url: string,
  queryParams?: QueryParams,
  args: RequestInit,
}

const apiPath: string = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}`;

const buildQueryParamsString = (queryParams: QueryParams): string => {
  const qpArray = _.reduce(queryParams, (result: string[], value: string, key: any) => [...result, `${key}=${value}`], []);
  let qpString = qpArray.join('&');

  if(!_.isEmpty(qpString)) {
    qpString = `?${qpString}`;
  }

  return qpString;
};

const requestBase = async ({url, queryParams, args}: iRequestSettings) => {
  let data;
  if(!_.isNil(queryParams)) {
    url = `${url}${buildQueryParamsString(queryParams)}`;
  }
  try {
    args.mode = 'cors';
    const res = await fetch(url, args);
    data = await res.json();
  } catch (e) {
    console.error(e);
  }
  return data;
}

/// ----- weekdays ----- ///
const allWeekdays = (): Promise<iWeekday[]> => requestBase({
  url: `${apiPath}/weekdays`, 
  args: {
    method: 'GET',
  },
});

const oneWeekday = (index: WeekdayIndex): Promise<iWeekday[]> => requestBase({
  url: `${apiPath}/weekdays/${index}`,
  args: {
    method: 'GET',
  },
});

/// ----- schedule ----- ///
const allSchedules = (): Promise<iSchedule[]> => requestBase({
  url: `${apiPath}/schedule`,
  args: {
    method: 'GET',
  },
});

const oneSchedule = (weekday: scheduleWeekday): Promise<iSchedule[]> => requestBase({
  url: `${apiPath}/schedule/${weekday}`,
  args: {
    method: 'GET',
  },
});

const addSchedule = (weekday: scheduleWeekday, hours: schedulePlannedHours): Promise<iSchedule[]> => requestBase({
  url: `${apiPath}/schedule/${weekday}/hrs/${hours}`,
  args:{
    method: 'POST',
  },
});

const updateSchedule = (weekday: scheduleWeekday, hours: schedulePlannedHours): Promise<iSchedule[]> => requestBase({
  url: `${apiPath}/schedule/${weekday}/hrs/${hours}`,
  args:{
    method: 'PUT',
  },
});

const deleteSchedule = (id: scheduleId): Promise<iSchedule[]> => requestBase({
  url: `${apiPath}/schedule/${id}`,
  args: {
    method: 'DELETE',
  },
});

/// ----- projects ----- ///
const allProjects = (): Promise<iProject[]> => requestBase({
  url: `${apiPath}/projects`,
  args: {
    method: 'GET',
  },
});

const oneProject = (id: ProjectId): Promise<iProject[]> => requestBase({
  url: `${apiPath}/projects/${id}`,
  args: {
    method: 'GET',
  },
});

const addProject = (name: ProjectName): Promise<iProject[]> => requestBase({
  url: `${apiPath}/projects/${name}`,
  args: {
    method: 'POST',
  },
});

const deleteProject = (id: ProjectId): Promise<iProject[]> => requestBase({
  url: `${apiPath}/projects/${id}`,
  args: {
    method: 'DELETE',
  },
});

/// ----- time cards ----- ///
const constructTimeCards = (apiTimeCards: iApiTimeCard[]): iTimeCard[] => apiTimeCards.map((apiTimeCard): iTimeCard => ({
  _id: _.toString(apiTimeCard._id),
  date: new Date(apiTimeCard.date),
  project_id: _.toString(apiTimeCard.project_id),
  notes: _.toString(apiTimeCard.notes),
  accumulated_time: _.toNumber(apiTimeCard.accumulated_time),
  time_punch: _.isNil(apiTimeCard.time_punch) ? null : new Date(apiTimeCard.time_punch),
}));

const allTimeCards = async ({
  date, dateFrom, dateTo, projectId, id
}: iTimeCardQueryParams): Promise<iTimeCard[]> => {
  const path = `${apiPath}/timeCard`;
  const requestSettings: iRequestSettings = {
    url: path, 
    args: {
      method: 'GET',
    },
  };

  if(
    !_.isNil(date) || 
    !_.isNil(dateFrom) ||
    !_.isNil(dateTo) ||
    !_.isNil(projectId) || 
    !_.isNil(id)
  ) {
    requestSettings.queryParams = {};
    if(!_.isNil(date)) {
      requestSettings.queryParams.date = date;
    }
    if(!_.isNil(dateFrom)) {
      requestSettings.queryParams.dateFrom = dateFrom;
    }
    if(!_.isNil(dateTo)) {
      requestSettings.queryParams.dateTo = dateTo;
    }
    if(!_.isNil(projectId)) {
      requestSettings.queryParams.projectId = projectId;
    }
    if(!_.isNil(id)) {
      requestSettings.queryParams.id = id;
    }
  }

  return constructTimeCards(await requestBase(requestSettings));
};

const oneTimeCard = async (projectId: TimeCardProjectId, date: TimeCardDate): Promise<iTimeCard[]> => constructTimeCards(await requestBase({
  url: `${apiPath}/timeCard/${projectId}/date/${date}`,
  args: {
    method: 'GET',
  },
}));

const addTimeCard = async (projectId: TimeCardProjectId, date: TimeCardDate): Promise<iTimeCard[]> => constructTimeCards( await requestBase({
  url: `${apiPath}/timeCard/${projectId}/date/${date}`,
  args: {
    method: 'POST',
  },
}));

const updateTimeCard = async (id: TimeCardId, body: BodyInit): Promise<iTimeCard[]> => constructTimeCards(await requestBase({
  url: `${apiPath}/timeCard/${id}`,
  args: {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
  },
}));

const deleteTimeCard = async (id: TimeCardId): Promise<iTimeCard[]> => constructTimeCards(await requestBase({
  url: `${apiPath}/timeCard/${id}`,
  args: {
    method: 'DELETE',
  },
}));

const api: iApi = {
  weekdays: {
    all: allWeekdays,
    one: oneWeekday,
  },
  schedules: {
    all: allSchedules,
    one: oneSchedule,
    add: addSchedule,
    update: updateSchedule,
    delete: deleteSchedule,
  },
  projects: {
    all: allProjects,
    one: oneProject,
    add: addProject,
    delete: deleteProject,
  },
  timeCards: {
    all: allTimeCards,
    one: oneTimeCard,
    add: addTimeCard,
    update: updateTimeCard,
    delete: deleteTimeCard,
  },
};

export default api;