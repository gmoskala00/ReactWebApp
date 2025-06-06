import { useEffect, useState } from "react";
import ProjectForm from "../components/ProjectForm";
import ProjectApi, { Project } from "../api/ProjectApi";
import ProjectList from "../components/ProjectList";
import UserApi from "../api/UserApi";
import { useActiveProject } from "../store/ActiveProjectContext";
import StoryApi, { Story } from "../api/StoryApi";
import StoryList from "../components/StoryList";
import StoryForm from "../components/StoryForm";

function HomePage() {
  const [projects, setProjects] = useState<Project[]>(ProjectApi.getProjects());
  const [stories, setStories] = useState<Story[]>([]);
  const user = UserApi.getCurrentUser();
  const { activeProjectId } = useActiveProject();

  useEffect(() => {
    if (activeProjectId) {
      setStories(StoryApi.getStoriesForProject(activeProjectId));
    }
  }, [activeProjectId]);

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

  const handleAddStory = (story: Omit<Story, "id" | "createdAt">) => {
    StoryApi.addStory(story);
    setStories(StoryApi.getStoriesForProject(activeProjectId!));
  };

  const handleDeleteStory = (id: number) => {
    StoryApi.deleteStory(id);
    setStories(StoryApi.getStoriesForProject(activeProjectId!));
  };

  const handleEditStory = (updated: Story) => {
    StoryApi.updateStory(updated);
    setStories(StoryApi.getStoriesForProject(activeProjectId!));
  };

  return (
    <div className="vh-100">
      <div className="d-flex justify-content-end p-3">
        <span>
          Zalogowany jako:{" "}
          <strong>
            {user.firstName} {user.lastName}
          </strong>
        </span>
      </div>
      {!activeProjectId && <ProjectForm handleAddProject={handleAddProject} />}
      <ProjectList
        projects={projects}
        handleDelete={handleDeleteProject}
        handleEdit={handleEditProject}
      />
      {activeProjectId && (
        <div className="d-flex justify-content-center">
          <div className="d-flex w-75 mt-5 flex-row justify-content-around">
            <StoryForm handleAddStory={handleAddStory} />
            <StoryList
              stories={stories}
              handleEdit={handleEditStory}
              handleDelete={handleDeleteStory}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
