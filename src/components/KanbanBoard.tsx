import { Task, TaskState } from "../api/TaskApi";

interface Props {
  tasks: Task[];
  onDelete: (id: string) => Promise<void>;
  onTaskClick: React.Dispatch<React.SetStateAction<Task | null>>;
}

const stateLabels: Record<TaskState, string> = {
  todo: "Do zrobienia",
  doing: "W trakcie",
  done: "Zrobione",
};

export default function KanbanBoard({ tasks, onDelete, onTaskClick }: Props) {
  const columns: TaskState[] = ["todo", "doing", "done"];

  return (
    <div className="d-flex gap-4">
      {columns.map((col) => (
        <div
          key={col}
          className="flex-fill border border-secondary rounded p-3"
        >
          <h5>{stateLabels[col]}</h5>
          <ul className="list-group">
            {tasks
              .filter((t) => t.state === col)
              .map((task) => (
                <li
                  key={task._id}
                  className="list-group-item border border-secondary rounded task-list-item py-3 my-2"
                  onClick={() => onTaskClick && onTaskClick(task)}
                  style={{ cursor: "pointer" }}
                >
                  <b>{task.name}</b> <br />
                  <small>Priorytet: {task.priority}</small>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
