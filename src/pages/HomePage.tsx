import { useEffect, useState } from "react";
import ProjectForm from "../components/ProjectForm";
import ProjectApi, { Project } from "../api/ProjectApi";
import ProjectList from "../components/ProjectList";
import { useActiveProject } from "../store/ActiveProjectContext";
import StoryApi, { Story } from "../api/StoryApi";
import StoryList from "../components/StoryList";
import StoryForm from "../components/StoryForm";

function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const { activeProjectId } = useActiveProject();

  useEffect(() => {
    ProjectApi.getProjects().then(setProjects);
  }, []);

  useEffect(() => {
    if (activeProjectId) {
      StoryApi.getStoriesForProject(activeProjectId).then(setStories);
    }
  }, [activeProjectId]);

  // --- Projekty
  const handleAddProject = async (project: Omit<Project, "_id">) => {
    await ProjectApi.addProject(project);
    setProjects(await ProjectApi.getProjects());
  };

  const handleDeleteProject = async (id: string) => {
    await ProjectApi.deleteProject(id);
    setProjects(await ProjectApi.getProjects());
  };

  const handleEditProject = async (updatedProject: Project) => {
    await ProjectApi.updateProject(updatedProject);
    setProjects(await ProjectApi.getProjects());
  };

  const handleAddStory = async (story: Omit<Story, "_id" | "createdAt">) => {
    await StoryApi.addStory(story);
    setStories(await StoryApi.getStoriesForProject(activeProjectId!));
  };

  const handleDeleteStory = async (id: string) => {
    await StoryApi.deleteStory(id);
    setStories(await StoryApi.getStoriesForProject(activeProjectId!));
  };

  const handleEditStory = async (updated: Story) => {
    await StoryApi.updateStory(updated);
    setStories(await StoryApi.getStoriesForProject(activeProjectId!));
  };

  return (
    <div className="vh-100">
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
