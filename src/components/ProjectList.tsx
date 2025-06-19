import { useActiveProject } from "../store/ActiveProjectContext";
import { Project } from "../api/ProjectApi";
import { useState } from "react";

interface Props {
  projects: Project[];
  handleDelete: (id: string) => void;
  handleEdit: (project: Project) => void;
}

const ProjectList = ({ projects, handleDelete, handleEdit }: Props) => {
  const { activeProjectId, setActiveProjectId } = useActiveProject();
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  if (activeProjectId) {
    const selectedProject = projects.find((p) => p._id === activeProjectId);
    return (
      <div className="container w-50 mt-4">
        <div className="card p-4 shadow-sm">
          <h2>{selectedProject?.title}</h2>
          <p className="mb-4">{selectedProject?.description}</p>
          <button
            className="btn btn-secondary"
            onClick={() => setActiveProjectId(null)}
          >
            Wróć do wszystkich projektów
          </button>
        </div>
      </div>
    );
  }

  const handleEditClick = (project: Project) => {
    setEditingProjectId(project._id);
    setEditTitle(project.title);
    setEditDescription(project.description);
  };

  const handleEditConfirm = (project: Project) => {
    handleEdit({
      ...project,
      title: editTitle,
      description: editDescription,
    });
    setEditingProjectId(null);
  };

  const handleEditCancel = () => setEditingProjectId(null);

  return (
    <div className="container w-75">
      <div className="row fw-bold border-bottom py-2 mx-2">
        <p className="col-3">Tytuł</p>
        <p className="col-6">Opis</p>
        <p className="col-3">Akcje</p>
      </div>
      {projects.length > 0 ? (
        <ul className="list-group">
          {projects.map((project) => (
            <li
              key={project._id}
              className="list-group-item d-flex align-items-center mx-2"
            >
              {editingProjectId === project._id ? (
                <>
                  <input
                    className="form-control mx-1"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    data-testid="project-edit-name"
                  />
                  <input
                    className="form-control mx-1"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    data-testid="project-edit-description"
                  />
                  <button
                    className="btn btn-success mx-1"
                    onClick={() => handleEditConfirm(project)}
                  >
                    Zapisz
                  </button>
                  <button
                    className="btn btn-secondary mx-1"
                    onClick={handleEditCancel}
                  >
                    Anuluj
                  </button>
                </>
              ) : (
                <>
                  <div style={{ flex: 1 }}>{project.title}</div>
                  <div style={{ flex: 2 }}>{project.description}</div>
                  <div
                    style={{ flex: 1 }}
                    className="d-flex justify-content-evenly"
                  >
                    <button
                      className="btn btn-info mx-1"
                      onClick={() => setActiveProjectId(project._id)}
                    >
                      Wybierz
                    </button>
                    <button
                      className="btn btn-warning mx-1"
                      onClick={() => handleEditClick(project)}
                    >
                      Edytuj
                    </button>
                    <button
                      className="btn btn-danger mx-1"
                      onClick={() => handleDelete(project._id)}
                    >
                      Usuń
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="d-flex w-100 justify-content-center mt-3">
          <h1>No Projects Created</h1>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
