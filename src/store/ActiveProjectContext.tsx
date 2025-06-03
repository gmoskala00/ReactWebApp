import React, { createContext, useContext, useState } from "react";

interface ActiveProjectContextType {
  activeProjectId: number | null;
  setActiveProjectId: (id: number | null) => void;
}

const ActiveProjectContext = createContext<
  ActiveProjectContextType | undefined
>(undefined);

export const ActiveProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeProjectId, setActiveProjectId] = useState<number | null>(() => {
    const id = localStorage.getItem("activeProject");
    return id ? Number(id) : null;
  });

  const handleSetActiveProjectId = (id: number | null) => {
    setActiveProjectId(id);
    if (id === null) {
      localStorage.removeItem("activeProject");
    } else {
      localStorage.setItem("activeProject", id.toString());
    }
  };

  return (
    <ActiveProjectContext.Provider
      value={{ activeProjectId, setActiveProjectId: handleSetActiveProjectId }}
    >
      {children}
    </ActiveProjectContext.Provider>
  );
};

export const useActiveProject = () => {
  const context = useContext(ActiveProjectContext);
  if (!context)
    throw new Error(
      "useActiveProject must be used within ActiveProjectProvider"
    );
  return context;
};
