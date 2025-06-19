import { useState } from "react";
import { Story, StoryPriority, StoryState } from "../api/StoryApi";
import { useActiveProject } from "../store/ActiveProjectContext";
import { useAuth } from "../store/AuthContext";

interface Props {
  handleAddStory: (story: Omit<Story, "_id" | "createdAt">) => void;
}

const StoryForm = ({ handleAddStory }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<StoryPriority>("średni");
  const [state, setState] = useState<StoryState>("todo");

  const { activeProjectId } = useActiveProject();
  const { user } = useAuth();

  if (!activeProjectId) return null;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleAddStory({
      name,
      description,
      priority,
      state,
      projectId: activeProjectId!,
      ownerId: user!._id,
    });
    setName("");
    setDescription("");
    setPriority("średni");
    setState("todo");
  }

  return (
    <form onSubmit={onSubmit} className="card p-3 mb-4 min mx-5 col-2 w-25">
      <h4>Dodaj nową historyjkę</h4>
      <input
        className="form-control mb-2"
        placeholder="Nazwa"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        className="form-control mb-2"
        placeholder="Opis"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <select
        className="form-select mb-2"
        value={priority}
        onChange={(e) => setPriority(e.target.value as StoryPriority)}
      >
        <option value="niski">Niski</option>
        <option value="średni">Średni</option>
        <option value="wysoki">Wysoki</option>
      </select>
      <select
        className="form-select mb-2"
        value={state}
        onChange={(e) => setState(e.target.value as StoryState)}
      >
        <option value="todo">Do zrobienia</option>
        <option value="doing">W trakcie</option>
        <option value="done">Zrobione</option>
      </select>
      <button type="submit" className="btn btn-success" data-testid="story-add">
        Dodaj
      </button>
    </form>
  );
};

export default StoryForm;
