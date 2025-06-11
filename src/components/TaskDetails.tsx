import { useEffect, useState } from "react";
import { Task, TaskState } from "../api/TaskApi";
import { AuthApi, User } from "../api/AuthApi";
import StoryApi, { Story } from "../api/StoryApi";

interface TaskDetailsProps {
  task: Task;
  onAssign: (task: Task, userId: string) => void;
  onChangeState: (task: Task, newState: TaskState) => void;
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
  onClose,
}: TaskDetailsProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [story, setStory] = useState<Story | null>(null);

  useEffect(() => {
    AuthApi.getUsers()
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    StoryApi.getStoryById(task.storyId)
      .then(setStory)
      .catch(() => setStory(null));
  }, [task.storyId]);

  const assignableUsers = users.filter(
    (u) => u.role === "developer" || u.role === "devops"
  );

  return (
    <div className="modal show d-block" tabIndex={-1}>
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
            <button className="btn btn-secondary" onClick={onClose}>
              Zamknij
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
