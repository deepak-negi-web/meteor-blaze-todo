import React from "react";

// create a task context provider

const initialState = {
  projects: [],
  selectedProjectId: null,
};

const TaskContext = React.createContext();

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "SET_PROJECTS":
      return { ...state, projects: payload };
    case "SET_SELECTED_PROJECT":
      return { ...state, selectedProjectId: payload };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const setProjects = (projects) => {
    dispatch({ type: "SET_PROJECTS", payload: projects });
  };

  const setSelectedProject = (projectId) => {
    dispatch({ type: "SET_SELECTED_PROJECT", payload: projectId });
  };

  return (
    <TaskContext.Provider
      value={{
        projects: state.projects,
        selectedProjectId: state.selectedProjectId,
        setProjects,
        setSelectedProject,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => React.useContext(TaskContext);
