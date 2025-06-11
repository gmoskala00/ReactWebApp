import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import StoryApi, { Story } from "../api/StoryApi";
import TaskApi, { Task, TaskPriority, TaskState } from "../api/TaskApi";
import KanbanBoard from "../components/KanbanBoard";
import TaskDetails from "../components/TaskDetails";
import TaskForm from "../components/TaskForm";

export default function TasksPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const storyId = id!;
  const [story, setStory] = useState<Story | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    StoryApi.getStoryById(storyId).then(setStory);
    TaskApi.getTasksForStory(storyId).then(setTasks);
  }, [storyId]);

  const handleDeleteTask = async (id: string) => {
    await TaskApi.deleteTask(id);
    setTasks(await TaskApi.getTasksForStory(storyId));
  };

  const handleAssign = async (task: Task, userId: string) => {
    const updated: Task = {
      ...task,
      assigneeId: userId,
      state: "doing",
      startDate: task.startDate || new Date().toISOString(),
    };
    await TaskApi.updateTask(updated);
    setTasks(await TaskApi.getTasksForStory(storyId));
    setSelectedTask(updated);
  };

  const handleChangeState = async (task: Task, newState: TaskState) => {
    const updated: Task = {
      ...task,
      state: newState,
      startDate:
        newState === "doing" && !task.startDate
          ? new Date().toISOString()
          : task.startDate,
      endDate: newState === "done" ? new Date().toISOString() : undefined,
    };
    await TaskApi.updateTask(updated);
    setTasks(await TaskApi.getTasksForStory(storyId));
    setSelectedTask(updated);
  };

  const handleCloseDetails = () => setSelectedTask(null);

  const handleAddTask = async (task: {
    name: string;
    description: string;
    priority: TaskPriority;
    estimateHours: number;
  }) => {
    await TaskApi.addTask({ ...task, storyId, state: "todo" });
    setTasks(await TaskApi.getTasksForStory(storyId));
    setShowAddForm(false);
  };

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
          <button
            className="btn btn-primary mb-3"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Anuluj" : "Dodaj zadanie"}
          </button>
          {showAddForm && (
            <TaskForm
              onSubmit={handleAddTask}
              onCancel={() => setShowAddForm(false)}
            />
          )}
        </>
      )}
      {selectedTask ? (
        <TaskDetails
          task={selectedTask}
          onAssign={handleAssign}
          onChangeState={handleChangeState}
          onClose={handleCloseDetails}
        />
      ) : tasks.length === 0 ? (
        <div className="alert alert-info mt-4">
          Brak zadań w tej historyjce.
        </div>
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
