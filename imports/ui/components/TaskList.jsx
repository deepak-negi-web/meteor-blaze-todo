import React from "react";
import { Meteor } from "meteor/meteor";
import { Task } from "./Task";

export function TaskList({ project, userId }) {
  // updating a task as completed
  const onCheckboxClick = ({ id, isChecked }) => {
    // update the isChecked property of the task
    Meteor.call(
      "projects.setTaskChecked",
      project._id,
      id,
      !isChecked,
      (err, res) => {
        if (err) {
          console.log(err);
        }
      }
    );
  };

  // removing a task from the list
  const onRemoveTask = ({ id }) => {
    Meteor.call("projects.removeTask", project._id, id, (err, res) => {
      if (err) {
        console.log(err);
      }
    });
  };

  return (
    <ul className="task__list">
      {!!project.tasks.length ? (
        project.tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onClick={onCheckboxClick}
            onDeleteClick={onRemoveTask}
            onEditClick={() => {}}
            isOwner={project.owner === userId}
          />
        ))
      ) : (
        <h4>No pending Task!</h4>
      )}
    </ul>
  );
}
