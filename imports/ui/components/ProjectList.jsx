import React from "react";
import { Meteor } from "meteor/meteor";
import { Trash } from "../icons";

export const ProjectList = ({ projects, selectedProject, userId }) => {
  const makeProjectPrivate = (project) => {
    Meteor.call("projects.setIsPrivate", project, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log("updated!!");
      }
    });
  };
  return (
    <ul className="project_list">
      {!!projects.length ? (
        projects.map((project) => (
          <div className="project_item_wrap">
            <small>{!!project.isPrivate ? "Private" : "Public"}</small>
            <label class="switch">
              <input
                id="toggle"
                type="checkbox"
                checked={!!project.isPrivate}
                onChange={() => makeProjectPrivate(project)}
                readOnly
              />
              <span class="slider round"></span>
            </label>
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
              <>
                <span
                  className="project_item_cancel"
                  data-projectid={project._id}
                >
                  <Trash size="24" color="#000" />
                </span>
              </>
            )}
          </div>
        ))
      ) : (
        <p>Create new projects & tasks to get started!</p>
      )}
    </ul>
  );
};
