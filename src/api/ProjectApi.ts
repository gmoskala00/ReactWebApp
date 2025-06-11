export interface Project {
  _id: string;
  title: string;
  description: string;
}

const API_URL = "http://localhost:4000/api/projects";

const ProjectApi = {
  async getProjects(): Promise<Project[]> {
    const res = await fetch(API_URL);
    return await res.json();
  },

  async addProject(project: Omit<Project, "_id">): Promise<Project> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    return await res.json();
  },

  async updateProject(project: Project): Promise<Project> {
    const res = await fetch(`${API_URL}/${project._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    return await res.json();
  },

  async deleteProject(id: string): Promise<void> {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  },
};

export default ProjectApi;
