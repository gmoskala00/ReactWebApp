import { Task, TaskState } from "../api/TaskApi";
import UserApi from "../api/UserApi";

interface TaskDetailsProps {
  task: Task;
  onAssign: (task: Task, userId: number) => void;
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
  const users = UserApi.getUsers().filter(
    (u) => u.role === "developer" || u.role === "devops"
  );

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content p-4">
          <h4>{task.name}</h4>
          <p>{task.description}</p>
          <div>
            <b>Priorytet:</b> {task.priority}
            <br />
            <b>Szacowany czas:</b> {task.estimateHours} h<br />
            <b>Stan:</b> {stateLabels[task.state]}
            <br />
            <b>Osoba:</b>{" "}
            {task.assigneeId
              ? (() => {
                  const u = users.find((x) => x.id === task.assigneeId);
                  return u ? u.firstName + " " + u.lastName : "Nieznana osoba";
                })()
              : "Nieprzypisano"}
            <br />
            <b>Data startu:</b>{" "}
            {task.startDate ? new Date(task.startDate).toLocaleString() : "-"}
            <br />
            <b>Data zakończenia:</b>{" "}
            {task.endDate ? new Date(task.endDate).toLocaleString() : "-"}
          </div>
          <hr />
          <div className="d-flex gap-2">
            <select
              className="form-select"
              value={task.assigneeId ?? ""}
              onChange={(e) => {
                const userId = Number(e.target.value);
                onAssign(task, userId);
              }}
            >
              <option value="">Przypisz osobę</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} ({u.role})
                </option>
              ))}
            </select>

            <select
              className="form-select"
              value={task.state}
              onChange={(e) => onChangeState(task, e.target.value as TaskState)}
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
