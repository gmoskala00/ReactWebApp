import { useState } from "react";
import { Project } from "../api/ProjectApi";

interface Props {
  projects: Project[];
  handleDelete: (index: number) => void;
  handleEdit: (project: Project) => void;
}

const ProjectList = ({ projects, handleDelete, handleEdit }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setTitle(event.target.value);
  };

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setDescription(event.target.value);
  };

  const handleEditClick = (project: Project) => {
    setEditingProjectId(project.id);
    setTitle(project.title);
    setDescription(project.description);
  };

  const handleConfirmEdit = () => {
    if (editingProjectId !== null) {
      const updatedProject = {
        id: editingProjectId,
        title: title,
        description: description,
      };
      handleEdit(updatedProject);
    } else {
      alert("Error occured while editing project");
    }
    setEditingProjectId(null);
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
  };

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
              key={project.id}
              className="list-group-item d-flex align-items-center mx-2"
            >
              {editingProjectId !== project.id ? (
                <>
                  <div style={{ flex: 1 }}>{project.title}</div>
                  <div style={{ flex: 2 }}>{project.description}</div>
                  <div
                    style={{ flex: 1 }}
                    className="d-flex justify-content-evenly"
                  >
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        handleEditClick(project);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(project.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <input
                    style={{ flex: 1 }}
                    value={title}
                    className="w-75"
                    onChange={handleInputChange}
                  />
                  <textarea
                    style={{ flex: 2 }}
                    value={description}
                    className="mx-2"
                    onChange={handleTextAreaChange}
                  />
                  <div
                    style={{ flex: 1 }}
                    className="d-flex justify-content-evenly"
                  >
                    <button
                      className="btn btn-success btn-sm"
                      onClick={handleConfirmEdit}
                    >
                      Confirm
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleCancelEdit}
                    >
                      Stop Edit
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
