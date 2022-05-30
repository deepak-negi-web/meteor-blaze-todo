import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ProjectList } from "./components";

import "./project.html";

Template.projectTemp.helpers({
  ProjectList() {
    return ProjectList;
  },
});
