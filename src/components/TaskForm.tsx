import { useState } from "react";
import { TaskPriority } from "../api/TaskApi";

interface TaskFormProps {
  onSubmit: (task: {
    name: string;
    description: string;
    priority: TaskPriority;
    estimateHours: number;
  }) => void;
  onCancel: () => void;
}

export default function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("średni");
  const [estimateHours, setEstimateHours] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    onSubmit({ name, description, priority, estimateHours });
    setName("");
    setDescription("");
    setPriority("średni");
    setEstimateHours(1);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow-sm">
      <div className="mb-2">
        <label className="form-label">Nazwa zadania</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-testid="task-name"
          required
        />
      </div>
      <div className="mb-2">
        <label className="form-label">Opis</label>
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          data-testid="task-description"
          required
        />
      </div>
      <div className="mb-2">
        <label className="form-label">Priorytet</label>
        <select
          className="form-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
        >
          <option value="niski">Niski</option>
          <option value="średni">Średni</option>
          <option value="wysoki">Wysoki</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Szacowane roboczogodziny</label>
        <input
          type="number"
          min={1}
          className="form-control"
          value={estimateHours}
          onChange={(e) => setEstimateHours(Number(e.target.value))}
          required
        />
      </div>
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-success">
          Dodaj zadanie
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Anuluj
        </button>
      </div>
    </form>
  );
}
