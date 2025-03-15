import { useState } from "react";
import { Project } from "../api/ProjectApi";

interface Props {
  handleAddProject: (project: Omit<Project, "id">) => void;
}

const ProjectForm = ({ handleAddProject }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function onTextAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setDescription(event.target.value);
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-betwee mb-5">
      <h1 className="mb-4">ManagMe - Zarządzanie Projektami</h1>
      <form
        className="card p-4 shadow-sm mx-auto w-25"
        style={{ minHeight: "250px" }}
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          handleAddProject({ title: title, description: description });
          setTitle("");
          setDescription("");
          console.log("TEST");
        }}
      >
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Tytuł Projektu"
          value={title}
          onChange={onInputChange}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Opis Projektu"
          value={description}
          onChange={onTextAreaChange}
          style={{ minHeight: "100px" }}
        />
        <input type="submit" value="Dodaj" className="btn btn-success" />
      </form>
    </div>
  );
};

export default ProjectForm;
