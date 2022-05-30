import React from "react";
import { Trash } from "../icons";

export const ProjectList = ({ projects, selectedProject, userId }) => {
  return (
    <ul className="project_list">
      {!!projects.length ? (
        projects.map((project) => (
          <div className="project_item_wrap">
            <li
              className={
                selectedProject && selectedProject._id === project._id
                  ? "project_item active_project"
                  : "project_item"
              }
              key={project._id}
              data-projectid={project._id}
            >
              {project.name} (by {project.username})
            </li>
            {project.owner === userId && (
              <span
                className="project_item_cancel"
                data-projectid={project._id}
              >
                <Trash size="20" color="#000" />
              </span>
            )}
          </div>
        ))
      ) : (
        <p>Create new projects & tasks to get started!</p>
      )}
    </ul>
  );
};
