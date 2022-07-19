/// ----- interfaces ----- ///
import iProject from '../../interfaces/iProject';

/// ----- components ----- ///
import UnorderedList from '../UnorderedList/UnorderedList';

/// ----- styles ----- ///
import './ProjectList.css';

interface iProjectListProps {
  projects: iProject[];
};

const ProjectList = ({projects}: iProjectListProps) => {

  const clickEvent = (project: iProject) => () => console.log(project.name);
  
  const projectNameListBuilder = (project: iProject, key: number) => <li key={key} onClick={clickEvent(project)}>{project.name}</li>;

  return (
    <UnorderedList listItems={projects} listBuilder={projectNameListBuilder} className="project-list"></UnorderedList>
  );
};

export default ProjectList;