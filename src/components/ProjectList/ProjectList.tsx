import _ from 'lodash';

/// ----- interfaces ----- ///
import { JsxElement } from 'typescript';
import iProject, {ProjectId, ProjectName} from '../../interfaces/iProject';

/// ----- components ----- ///
import UnorderedList from '../UnorderedList/UnorderedList';

/// ----- styles ----- ///
import './ProjectList.css';

interface iProjectListProps {
  projects: iProject[];
  selectedProjectId: ProjectId|undefined|null;
  workingProjectId: ProjectId|undefined|null;
  toggleProjectSelection: Function;
  toggleStart: Function
};

const ProjectList = ({
  projects, 
  selectedProjectId,
  workingProjectId,
  toggleProjectSelection, 
  toggleStart
}: iProjectListProps) => {

  const selectionClickEvent = (project: iProject) => () => {
    toggleProjectSelection(project._id);
  };

  const startButtonClickEvent = (project: iProject) => () => {
    toggleStart(project._id);
  }

  const getContainerClass = (project: iProject) => {
    let className = '';
    if(project._id === selectedProjectId) {
      className = `${className} selected`;
    }
    if(project._id === workingProjectId) {
      className = `${className} working`;
    }

    return className;
  };

  const getButtonName = (project: iProject) => project._id === workingProjectId ? 'Stop' : 'Start';
  
  const projectNameListBuilder = (project: iProject, key: number): JSX.Element => {
    let className = '';
    let buttonName = 'Start';
    if(project._id === selectedProjectId) {
      className = `${className} selected`;
    } else {
      className = className.replace(/selected/g, '').trim();
    }
    if(project._id === workingProjectId) {
      className = `${className} working`;
      buttonName = 'Stop';
    } else {
      className = className.replace(/working/g, '').trim();
    }

    const itemContainer = (display: JSX.Element, startButton: JSX.Element): JSX.Element => <div className={`list-item-container ${className}`}>
      {startButton}
      {display}
    </div>

    const display = (name: ProjectName): JSX.Element => <span className={`list-item-display`}>{name}</span>

    const startButton = (project: iProject): JSX.Element => <button onClick={startButtonClickEvent(project)}>{buttonName}</button>

    return <li key={key} onClick={selectionClickEvent(project)}>
      {itemContainer(
        display(project.name), 
        startButton(project)
      )}
    </li>;
  };

  return (
    // <UnorderedList listItems={projects} listBuilder={projectNameListBuilder} className="project-list"></UnorderedList>
    <ul className='project-list'>
      {projects.map((project, key) => <li key={key}>
        <div className={`list-item-container ${getContainerClass(project)}`} onClick={selectionClickEvent(project)}>
          <button onClick={startButtonClickEvent(project)}>{getButtonName(project)}</button>
          <span className='list-item-display'>{project.name}</span>
        </div>
      </li>)}
    </ul>
  );
};

export default ProjectList;