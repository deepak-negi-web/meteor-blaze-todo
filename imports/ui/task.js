import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { TaskList } from "./components";

import "./task.html";

Template.taskTemp.helpers({
  TaskList() {
    return TaskList;
  },
});
