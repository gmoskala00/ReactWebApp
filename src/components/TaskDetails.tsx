import { useEffect, useState } from "react";
import { Task, TaskState, TaskPriority } from "../api/TaskApi";
import { AuthApi, User } from "../api/AuthApi";
import StoryApi, { Story } from "../api/StoryApi";

interface TaskDetailsProps {
  task: Task;
  onAssign: (task: Task, userId: string) => void;
  onChangeState: (task: Task, newState: TaskState) => void;
  onEdit: (task: Task) => void;
  onDelete: () => Promise<void>;
  onClose: () => void;
}

const stateLabels: Record<TaskState, string> = {
  todo: "Do zrobienia",
  doing: "W trakcie",
  done: "Zrobione",
};

export default function TaskDetails({
  task,
  onAssign,
  onChangeState,
  onEdit,
  onDelete,
  onClose,
}: TaskDetailsProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [story, setStory] = useState<Story | null>(null);
  const [editing, setEditing] = useState(false);

  const [editName, setEditName] = useState(task.name);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority);
  const [editEstimateHours, setEditEstimateHours] = useState<number>(
    task.estimateHours
  );

  useEffect(() => {
    AuthApi.getUsers()
      .then(setUsers)
      .catch(() => setUsers([]));
    StoryApi.getStoryById(task.storyId)
      .then(setStory)
      .catch(() => setStory(null));
  }, [task.storyId]);

  useEffect(() => {
    setEditName(task.name);
    setEditDescription(task.description);
    setEditPriority(task.priority);
    setEditEstimateHours(task.estimateHours);
  }, [task]);

  const assignableUsers = users.filter(
    (u) => u.role === "developer" || u.role === "devops"
  );

  const handleSaveEdit = () => {
    onEdit({
      ...task,
      name: editName,
      description: editDescription,
      priority: editPriority,
      estimateHours: editEstimateHours,
    });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="modal show d-block mt-5" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content p-4">
            <h4>Edycja zadania</h4>
            <input
              className="form-control mb-2"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Nazwa zadania"
            />
            <textarea
              className="form-control mb-2"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Opis"
            />
            <select
              className="form-select mb-2"
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
            >
              <option value="niski">Niski</option>
              <option value="średni">Średni</option>
              <option value="wysoki">Wysoki</option>
            </select>
            <input
              className="form-control mb-2"
              type="number"
              value={editEstimateHours}
              onChange={(e) => setEditEstimateHours(Number(e.target.value))}
              placeholder="Szacowane roboczogodziny"
            />
            <div>
              <button
                className="btn btn-success m-1 w-25"
                onClick={handleSaveEdit}
              >
                Zapisz
              </button>
              <button
                className="btn btn-secondary m-1 w-25"
                onClick={() => setEditing(false)}
              >
                Anuluj
              </button>
              <button className="btn btn-danger m-1" onClick={onDelete}>
                Usuń
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal show d-block mt-5" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content p-4">
          <h4>{task.name}</h4>
          <p>{task.description}</p>
          {story && (
            <div>
              <b>Historyjka:</b> {story.name}
              <br />
            </div>
          )}
          <div>
            <b>Priorytet:</b> {task.priority}
            <br />
            <b>Szacowany czas:</b> {task.estimateHours} h<br />
            <b>Stan:</b> {stateLabels[task.state]}
            <br />
            <b>Osoba:</b>{" "}
            {task.assigneeId
              ? (() => {
                  const u = assignableUsers.find(
                    (x) => x._id === task.assigneeId
                  );
                  return u ? `${u.firstName} ${u.lastName}` : "Nieznana osoba";
                })()
              : "Nieprzypisano"}
            <br />
            <b>Data startu:</b>{" "}
            {task.startDate ? new Date(task.startDate).toLocaleString() : "-"}
            <br />
            <b>Data zakończenia:</b>{" "}
            {task.endDate ? new Date(task.endDate).toLocaleString() : "-"}
            <br />
            <b>Zrealizowane roboczogodziny:</b>{" "}
            {task.actualHours !== undefined ? task.actualHours : "-"}
          </div>
          <hr />
          <div className="d-flex gap-2">
            <select
              className="form-select"
              value={task.assigneeId ?? ""}
              onChange={(e) => {
                const userId = e.target.value;
                if (userId) {
                  onAssign(task, userId);
                }
              }}
            >
              <option value="">Przypisz osobę</option>
              {assignableUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.firstName} {u.lastName} ({u.role})
                </option>
              ))}
            </select>
            <select
              className="form-select"
              value={task.state}
              onChange={(e) => {
                const newState = e.target.value as TaskState;
                onChangeState(task, newState);
              }}
            >
              <option value="todo">Do zrobienia</option>
              <option value="doing">W trakcie</option>
              <option value="done">Zrobione</option>
            </select>
            <button
              className="btn btn-warning mx-2"
              onClick={() => setEditing(true)}
            >
              Edytuj
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Zamknij
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
