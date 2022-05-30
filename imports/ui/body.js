import { Template } from "meteor/templating";
import { Meteor } from "meteor/meteor";
import { ReactiveDict } from "meteor/reactive-dict";
import "./task.js";
import "./project.js";
import "./body.html";
import { Projects } from "../api/projects";

const LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY = "project.selectedProjectId";

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe("projects");
});
Template.body.helpers({
  projects() {
    return Projects.find(
      {},
      {
        sort: { createdAt: -1 },
      }
    ).fetch();
  },
  selectedProject() {
    const instance = Template.instance();
    const selectedProjectId = instance.state.get("selectedProjectId") || null;
    if (selectedProjectId) {
      const selectedProject = Projects.find(
        {
          _id: selectedProjectId,
        },
        {
          sort: { updatedAt: -1 },
        }
      ).fetch();
      const pendingTaskCount =
        selectedProject.length > 0
          ? selectedProject[0].tasks.reduce(
              (acc, curr) => (!curr.isChecked ? acc + 1 : acc + 0),
              0
            )
          : 0;
      const completedTaskCount =
        selectedProject.length > 0
          ? selectedProject[0].tasks.reduce(
              (acc, curr) => (curr.isChecked ? acc + 1 : acc + 0),
              0
            )
          : 0;
      return {
        ...(selectedProject.length > 0 ? selectedProject[0] : null),
        pendingTask: {
          count: pendingTaskCount,
          text: pendingTaskCount > 1 ? "Tasks" : "Task",
        },
        completedTask: {
          count: completedTaskCount,
          text: completedTaskCount > 1 ? "Tasks" : "Task",
        },
      };
    }
  },
});

Template.body.events({
  "submit .project_form"(event, instance) {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    const target = event.target;
    const name = target.projectName.value;
    // Insert a project into the collection
    Meteor.call("projects.insert", name, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        instance.state.set("selectedProjectId", res);
        // Clear form
        target.projectName.value = "";
      }
    });
  },
  "click .project_list"(event, instance) {
    if (event.target.tagName === "LI") {
      const selectedProjectId = event.target.dataset.projectid;
      instance.state.set("selectedProjectId", selectedProjectId);
    }
    if (
      event.target.parentNode.tagName === "SPAN" &&
      [...Array.from(event.target.parentNode.classList)].includes(
        "project_item_cancel"
      )
    ) {
      const selectedProjectId = event.target.parentNode.dataset.projectid;
      Meteor.call("projects.remove", selectedProjectId, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          // set  selectedProjectId state to null
          instance.state.set("selectedProjectId", null);
        }
      });
    }
  },
  "submit .task_form"(event, instance) {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    const target = event.target;
    const text = target.taskText.value;
    // Insert a task into the project collection
    const selectedProjectId = instance.state.get("selectedProjectId") || null;
    const selectedTaskId = instance.state.get("selectedTaskId") || null;
    if (selectedTaskId) {
      Meteor.call(
        "projects.updateSelectedTask",
        selectedProjectId,
        selectedTaskId,
        text,
        (err, res) => {
          if (err) {
            console.log(err);
          } else {
            const task_form_input = $(".task_input");
            const task_form_addBtn = $(".add_button_span");
            instance.state.set("selectedTaskId", null);
            task_form_input.val("");
            task_form_addBtn.text("Add");
          }
        }
      );
    } else {
      Meteor.call(
        "projects.insertTask",
        selectedProjectId,
        text,
        (err, res) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
    // Clear form
    target.taskText.value = "";
  },
  "click .task_edit"(event, instance) {
    const selectedProjectId = instance.state.get("selectedProjectId") || null;
    const taskId = event.currentTarget.dataset.taskid;
    const selectedProject = Projects.find(selectedProjectId, {
      sort: { createdAt: -1 },
    }).fetch();
    if (selectedProject) {
      const selectedTask = selectedProject[0].tasks.find(
        (task) => task.id === taskId
      );
      if (!selectedTask.isChecked) {
        const task_form_input = $(".task_input");
        const task_form_addBtn = $(".add_button_span");
        instance.state.set("selectedTaskId", taskId);
        task_form_input.val(selectedTask.text);
        task_form_input.focus();
        task_form_addBtn.text("Update");
      }
    }
  },
});
