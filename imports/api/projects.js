import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Projects = new Mongo.Collection("projects");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("projects", function projectsPublication() {
    return Projects.find({
      $or: [{ private: { $ne: true } }, { owner: this.userId }],
    });
  });
}

Meteor.methods({
  "projects.insert"(name) {
    check(name, String);

    // Make sure the user is logged in before inserting a task
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    const insertedProjectId = Projects.insert({
      name,
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [],
    });
    return insertedProjectId;
  },
  "projects.remove"(projectId) {
    check(projectId, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Projects.remove(projectId);
  },
  "projects.updateSelectedTask"(projectId, taskId, text) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    check(projectId, String);
    check(taskId, String);
    check(text, String);
    Projects.update(
      {
        _id: projectId,
        "tasks.id": taskId,
      },
      {
        $set: {
          updatedAt: new Date(), // current time
          "tasks.$.text": text,
        },
      }
    );
  },
  "projects.insertTask"(projectId, text) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    check(projectId, String);
    check(text, String);
    Projects.update(projectId, {
      $set: {
        updatedAt: new Date(), // current time
      },
      $push: {
        tasks: {
          id: new Date().valueOf().toString(),
          createdAt: new Date(), // current time
          updatedAt: new Date(), // current time
          text,
          isChecked: false,
        },
      },
    });
  },
  "projects.setTaskChecked"(projectId, taskId, isChecked) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    check(projectId, String);
    check(taskId, String);
    check(isChecked, Boolean);
    Projects.update(
      {
        _id: projectId,
        "tasks.id": taskId,
      },
      {
        $set: {
          updatedAt: new Date(), // current time
          "tasks.$.isChecked": isChecked,
        },
      }
    );
  },
  "projects.removeTask"(projectId, taskId) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    check(projectId, String);
    check(taskId, String);
    Projects.update(
      {
        _id: projectId,
      },
      {
        $pull: {
          tasks: {
            id: taskId,
          },
        },
      }
    );
  },
});
