import { useActiveProject } from "../store/ActiveProjectContext";
import { Project } from "../api/ProjectApi";

interface Props {
  projects: Project[];
  handleDelete: (id: string) => void;
  handleEdit: (project: Project) => void;
}

const ProjectList = ({ projects, handleDelete, handleEdit }: Props) => {
  const { activeProjectId, setActiveProjectId } = useActiveProject();

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

  return (
    <div className="container w-50">
      <div className="row fw-bold border-bottom py-2 mx-2">
        <p className="col-3">Title</p>
        <p className="col-6">Description</p>
        <p className="col-3">Actions</p>
      </div>
      {projects.length > 0 ? (
        <ul className="list-group">
          {projects.map((project) => (
            <li
              key={project._id}
              className="list-group-item d-flex align-items-center mx-2"
            >
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
                  onClick={() => handleEdit(project)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger mx-1"
                  onClick={() => handleDelete(project._id)}
                >
                  Delete
                </button>
              </div>
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
