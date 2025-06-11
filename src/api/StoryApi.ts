export type StoryPriority = "niski" | "średni" | "wysoki";
export type StoryState = "todo" | "doing" | "done";

export interface Story {
  _id: string;
  name: string;
  description: string;
  priority: StoryPriority;
  projectId: string;
  createdAt: string;
  state: StoryState;
  ownerId: string;
}

const API_URL = "http://localhost:4000/api/stories";

const StoryApi = {
  async getStoriesForProject(projectId: string): Promise<Story[]> {
    const res = await fetch(`${API_URL}?projectId=${projectId}`);
    return await res.json();
  },

  async addStory(story: Omit<Story, "_id" | "createdAt">): Promise<Story> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(story),
    });
    return await res.json();
  },

  async updateStory(story: Story): Promise<Story> {
    const res = await fetch(`${API_URL}/${story._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(story),
    });
    return await res.json();
  },

  async deleteStory(id: string): Promise<void> {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  },

  getStoryById: async (id: string) => {
    const res = await fetch(`http://localhost:4000/api/stories/${id}`);
    return await res.json();
  },
};

export default StoryApi;
