import React from "react";
import { Trash, Edit } from "../icons";
export const Task = ({ task, onClick, onDeleteClick, isOwner }) => {
  return (
    <li className="task__item">
      <label className="form-control">
        <input
          className="task__item_checkbox"
          type="checkbox"
          checked={!!task.isChecked}
          onClick={() => onClick(task)}
          readOnly
          disabled={!isOwner}
        />
        <span className="task__item_text">{task.text}</span>
      </label>
      {isOwner && (
        <div>
          <span
            data-taskid={task.id}
            className={
              task.isChecked
                ? "task_edit task__item_edit_disabled"
                : "task_edit task__item_edit"
            }
            title={task.isChecked ? "Task already completed" : "Edit Task"}
          >
            <Edit size="20" color="#000" />
          </span>
          <span
            className="task__item_cancel"
            onClick={() => onDeleteClick(task)}
          >
            <Trash size="20" color="#000" />
          </span>
        </div>
      )}
    </li>
  );
};
