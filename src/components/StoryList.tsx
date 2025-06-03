import { useState } from "react";
import { Story, StoryState, StoryPriority } from "../api/StoryApi";
import UserApi from "../api/UserApi";
import { useActiveProject } from "../store/ActiveProjectContext";

interface Props {
  stories: Story[];
  handleEdit: (story: Story) => void;
  handleDelete: (id: number) => void;
}

const stateLabels: Record<StoryState, string> = {
  todo: "Do zrobienia",
  doing: "W trakcie",
  done: "Zrobione",
};

const priorityLabels: Record<StoryPriority, string> = {
  niski: "Niski",
  średni: "Średni",
  wysoki: "Wysoki",
};

export default function StoryList({
  stories,
  handleEdit,
  handleDelete,
}: Props) {
  const { activeProjectId } = useActiveProject();
  const user = UserApi.getCurrentUser();

  const [editingStoryId, setEditingStoryId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<StoryPriority>("średni");
  const [editState, setEditState] = useState<StoryState>("todo");

  const [filter, setFilter] = useState<StoryState | "all">("all");
  const filteredStories =
    filter === "all"
      ? stories
      : stories.filter((story: Story) => story.state === filter);

  const handleEditClick = (story: Story) => {
    setEditingStoryId(story.id);
    setEditName(story.name);
    setEditDescription(story.description);
    setEditPriority(story.priority);
    setEditState(story.state);
  };

  const handleConfirmEdit = (story: Story) => {
    handleEdit({
      ...story,
      name: editName,
      description: editDescription,
      priority: editPriority,
      state: editState,
    });
    setEditingStoryId(null);
  };

  const handleCancelEdit = () => {
    setEditingStoryId(null);
  };

  if (!activeProjectId) return null;

  return (
    <div className="w-100">
      <div className="mb-3 d-flex align-items-center">
        <span className="me-2">Filtruj:</span>
        <select
          className="form-select w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value as StoryState | "all")}
        >
          <option value="all">Wszystkie</option>
          <option value="todo">Do zrobienia</option>
          <option value="doing">W trakcie</option>
          <option value="done">Zrobione</option>
        </select>
      </div>
      <ul className="list-group">
        {filteredStories.length === 0 ? (
          <li className="list-group-item">
            Brak historyjek dla tego projektu.
          </li>
        ) : (
          filteredStories.map((story: Story) => (
            <li
              key={story.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {editingStoryId === story.id ? (
                <>
                  <div className="w-100">
                    <input
                      className="form-control mb-2"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <textarea
                      className="form-control mb-2"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                    <select
                      className="form-select mb-2"
                      value={editPriority}
                      onChange={(e) =>
                        setEditPriority(e.target.value as StoryPriority)
                      }
                    >
                      <option value="niski">Niski</option>
                      <option value="średni">Średni</option>
                      <option value="wysoki">Wysoki</option>
                    </select>
                    <select
                      className="form-select mb-2"
                      value={editState}
                      onChange={(e) =>
                        setEditState(e.target.value as StoryState)
                      }
                    >
                      <option value="todo">Do zrobienia</option>
                      <option value="doing">W trakcie</option>
                      <option value="done">Zrobione</option>
                    </select>
                    <div>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleConfirmEdit(story)}
                      >
                        Zapisz
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={handleCancelEdit}
                      >
                        Anuluj
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <b>{story.name}</b> ({priorityLabels[story.priority]})<br />
                    <span className="text-muted">{story.description}</span>
                    <br />
                    <small>
                      Stan: {stateLabels[story.state]}, data:{" "}
                      {story.createdAt.split("T")[0]}, właściciel:{" "}
                      {user.id === story.ownerId
                        ? "Ty"
                        : `User ${story.ownerId}`}
                    </small>
                  </div>
                  <div>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEditClick(story)}
                    >
                      Edytuj
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(story.id)}
                    >
                      Usuń
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
