export interface Project {
  id: number;
  title: string;
  description: string;
}

export default class ProjectApi {
  static getProjects(): Project[] {
    const projects = localStorage.getItem("projects");
    return projects ? JSON.parse(projects) : [];
  }

  static saveProjects(projects: Project[]) {
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  static addProject(project: Omit<Project, "id">) {
    const projects = this.getProjects();
    if (project.title && project.description) {
      projects.push({ id: Date.now(), ...project });
      this.saveProjects(projects);
    } else {
      alert("You must set title and description");
    }
    console.log(projects);
  }

  static updateProject(updatedProject: Project) {
    const projects = this.getProjects();
    const updatedProjects = projects.map((project) =>
      project.id === updatedProject.id ? updatedProject : project
    );
    this.saveProjects(updatedProjects);
  }

  static deleteProject(projectId: number) {
    const projects = this.getProjects();
    const filteredProjects = projects.filter(
      (project) => project.id !== projectId
    );
    this.saveProjects(filteredProjects);
  }
}
