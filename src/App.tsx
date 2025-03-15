import { useState } from "react";
import ProjectForm from "./components/ProjectForm";
import ProjectApi, { Project } from "./api/ProjectApi";
import ProjectList from "./components/ProjectList";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  const [projects, setProjects] = useState<Project[]>(ProjectApi.getProjects());

  const handleAddProject = (project: Omit<Project, "id">) => {
    ProjectApi.addProject(project);
    setProjects(ProjectApi.getProjects());
  };

  const handleDeleteProject = (id: number) => {
    ProjectApi.deleteProject(id);
    setProjects(ProjectApi.getProjects());
  };

  const handleEditProject = (updatedProject: Project) => {
    ProjectApi.updateProject(updatedProject);
    setProjects(ProjectApi.getProjects());
  };

  return (
    <div className="vh-100">
      <ProjectForm handleAddProject={handleAddProject}></ProjectForm>
      <ProjectList
        projects={projects}
        handleDelete={handleDeleteProject}
        handleEdit={handleEditProject}
      ></ProjectList>
    </div>
  );
}

export default App;
