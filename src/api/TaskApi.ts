export type TaskPriority = "niski" | "średni" | "wysoki";
export type TaskState = "todo" | "doing" | "done";

export interface Task {
  id: number;
  name: string;
  description: string;
  priority: TaskPriority;
  storyId: number;
  estimateHours: number;
  state: TaskState;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  assigneeId?: number;
  actualHours?: number;
}

export const TaskApi = {
  getTasks(): Task[] {
    const tasks = localStorage.getItem("tasks");
    return tasks ? JSON.parse(tasks) : [];
  },

  getTasksForStory(storyId: number): Task[] {
    return TaskApi.getTasks().filter((t) => t.storyId === storyId);
  },

  saveTasks(tasks: Task[]): void {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  },

  addTask(task: Omit<Task, "id" | "createdAt">): void {
    const tasks = TaskApi.getTasks();
    const maxId = tasks.reduce((max, t) => (t.id > max ? t.id : max), 0);
    const newTask: Task = {
      ...task,
      id: maxId + 1,
      createdAt: new Date().toISOString(),
      state: "todo",
    };
    tasks.push(newTask);
    TaskApi.saveTasks(tasks);
  },

  updateTask(updatedTask: Task) {
    const tasks = TaskApi.getTasks();
    const updated = tasks.map((t) =>
      t.id === updatedTask.id ? updatedTask : t
    );
    TaskApi.saveTasks(updated);
  },

  deleteTask(taskId: number): void {
    const tasks = TaskApi.getTasks();
    TaskApi.saveTasks(tasks.filter((t) => t.id !== taskId));
  },
};
