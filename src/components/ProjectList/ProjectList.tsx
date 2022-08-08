/// ----- interfaces ----- ///
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
    let className = getContainerClass(project);
    let buttonName = getButtonName(project);

    const itemContainer = (display: JSX.Element, startButton: JSX.Element): JSX.Element => <div className={`list-item-container ${className}`}>
      {startButton}
      {display}
    </div>

    const display = (name: ProjectName): JSX.Element => <span className={`list-item-display`} onClick={selectionClickEvent(project)}>{name}</span>

    const startButton = (project: iProject): JSX.Element => <button onClick={startButtonClickEvent(project)}>{buttonName}</button>

    return <li key={key}>
      {itemContainer(
        display(project.name), 
        startButton(project)
      )}
    </li>;
  };

  return (
    <UnorderedList listItems={projects} listBuilder={projectNameListBuilder} className="project-list"></UnorderedList>
  );
};

export default ProjectList;