export type StoryPriority = "niski" | "średni" | "wysoki";
export type StoryState = "todo" | "doing" | "done";

export interface Story {
  id: number;
  name: string;
  description: string;
  priority: StoryPriority;
  projectId: number;
  createdAt: string;
  state: StoryState;
  ownerId: number;
}

export default class StoryApi {
  static getStories(): Story[] {
    const stories = localStorage.getItem("stories");
    return stories ? JSON.parse(stories) : [];
  }

  static getStoriesForProject(projectId: number): Story[] {
    return this.getStories().filter((s) => s.projectId === projectId);
  }

  static saveStories(stories: Story[]) {
    localStorage.setItem("stories", JSON.stringify(stories));
  }

  static addStory(story: Omit<Story, "id" | "createdAt">) {
    const stories = this.getStories();
    const newStory: Story = {
      ...story,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    stories.push(newStory);
    this.saveStories(stories);
  }

  static updateStory(updatedStory: Story) {
    const stories = this.getStories();
    const updated = stories.map((s) =>
      s.id === updatedStory.id ? updatedStory : s
    );
    this.saveStories(updated);
  }

  static deleteStory(storyId: number) {
    const stories = this.getStories();
    const filtered = stories.filter((s) => s.id !== storyId);
    this.saveStories(filtered);
  }
}
