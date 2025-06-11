export type TaskPriority = "niski" | "średni" | "wysoki";
export type TaskState = "todo" | "doing" | "done";

export interface Task {
  _id: string;
  name: string;
  description: string;
  priority: TaskPriority;
  storyId: string;
  estimateHours: number;
  state: TaskState;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  assigneeId?: string;
  actualHours?: number;
}

const API_URL = "http://localhost:4000/api/tasks";

const TaskApi = {
  async getTasksForStory(storyId: string): Promise<Task[]> {
    const res = await fetch(`${API_URL}?storyId=${storyId}`);
    return await res.json();
  },

  async addTask(task: Omit<Task, "_id" | "createdAt">): Promise<Task> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    return await res.json();
  },

  async updateTask(task: Task): Promise<Task> {
    const res = await fetch(`${API_URL}/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    return await res.json();
  },

  async deleteTask(id: string): Promise<void> {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  },
};

export default TaskApi;
