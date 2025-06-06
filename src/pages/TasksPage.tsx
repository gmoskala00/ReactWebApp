import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import StoryApi, { Story } from "../api/StoryApi";
import { Task, TaskApi, TaskState } from "../api/TaskApi";
import KanbanBoard from "../components/KanbanBoard";
import TaskDetails from "../components/TaskDetails";

export default function TasksPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const storyId = Number(id);
  const [story, setStory] = useState<Story | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const foundStory =
      StoryApi.getStories().find((s) => s.id === storyId) || null;
    setStory(foundStory);

    const existing = TaskApi.getTasksForStory(storyId);
    if (existing.length === 0) {
      const exampleTasks: Omit<Task, "id" | "createdAt">[] = [
        {
          name: "Zaprojektuj formularz",
          description: "Stwórz formularz dodawania użytkownika",
          priority: "średni",
          storyId: storyId,
          estimateHours: 4,
          state: "todo",
        },
        {
          name: "Napisz endpoint API",
          description: "Stwórz endpoint do pobierania listy projektów",
          priority: "wysoki",
          storyId: storyId,
          estimateHours: 6,
          state: "todo",
        },
        {
          name: "Testuj backend",
          description: "Dodaj testy jednostkowe dla backendu",
          priority: "niski",
          storyId: storyId,
          estimateHours: 3,
          state: "doing",
          assigneeId: 2,
          startDate: new Date().toISOString(),
        },
      ];
      exampleTasks.forEach((task) => TaskApi.addTask(task));
    }

    setTasks(TaskApi.getTasksForStory(storyId));
  }, [storyId]);

  const handleDeleteTask = (id: number) => {
    TaskApi.deleteTask(id);
    setTasks(TaskApi.getTasksForStory(storyId));
  };

  const handleAssign = (task: Task, userId: number) => {
    const updated = {
      ...task,
      assigneeId: userId,
    };
    TaskApi.updateTask(updated);
    setTasks(TaskApi.getTasksForStory(storyId));
    setSelectedTask({ ...updated });
  };

  const handleChangeState = (task: Task, newState: TaskState) => {
    const updated = {
      ...task,
      state: newState,
      startDate:
        newState === "doing" && !task.startDate
          ? new Date().toISOString()
          : task.startDate,
      endDate: newState === "done" ? new Date().toISOString() : undefined,
    };
    TaskApi.updateTask(updated);
    setTasks(TaskApi.getTasksForStory(storyId));
    setSelectedTask(updated);
  };

  const handleCloseDetails = () => setSelectedTask(null);

  if (!story) {
    return (
      <div className="container mt-5">
        <h2>Historyjka nie istnieje</h2>
        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
          Wróć
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {!selectedTask && (
        <>
          <button
            className="btn btn-secondary mb-3"
            onClick={() => navigate(-1)}
          >
            ← Wróć do listy historyjek
          </button>
          <h2>
            Zadania historyjki: <b>{story.name}</b>
          </h2>
          <p>{story.description}</p>
        </>
      )}
      {selectedTask ? (
        <TaskDetails
          task={selectedTask}
          onAssign={handleAssign}
          onChangeState={handleChangeState}
          onClose={handleCloseDetails}
        />
      ) : (
        <KanbanBoard
          tasks={tasks}
          onDelete={handleDeleteTask}
          onTaskClick={setSelectedTask}
        />
      )}
    </div>
  );
}
