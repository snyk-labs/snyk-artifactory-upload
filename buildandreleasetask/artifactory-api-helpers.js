"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setProperties = void 0;
const tl = require("azure-pipelines-task-lib/task");
//Get auth details
function setProperties(properties) {
    const serviceConnectionId = tl.getInput('artifactoryServiceConnection', true);
    console.log(serviceConnectionId);
    const auth = tl.getEndpointAuthorization(serviceConnectionId, false);
    console.log(auth?.parameters["username"].toString());
    console.log(auth?.parameters["password"].toString());
    console.log(JSON.stringify(auth));
}
exports.setProperties = setProperties;
