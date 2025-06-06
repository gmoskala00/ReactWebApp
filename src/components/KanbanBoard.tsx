import { Task, TaskState } from "../api/TaskApi";

interface Props {
  tasks: Task[];
  onDelete: (id: number) => void;
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
        <div key={col} className="flex-fill">
          <h5>{stateLabels[col]}</h5>
          <ul className="list-group">
            {tasks
              .filter((t) => t.state === col)
              .map((task) => (
                <li
                  key={task.id}
                  className="list-group-item"
                  onClick={() => onTaskClick && onTaskClick(task)}
                  style={{ cursor: "pointer" }}
                >
                  <b>{task.name}</b> <br />
                  <small>Priorytet: {task.priority}</small>
                  <br />
                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => onDelete(task.id)}
                    style={{ marginTop: 8 }}
                  >
                    Usuń
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
