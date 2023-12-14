"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setProperties = void 0;
const tl = require("azure-pipelines-task-lib/task");
const axios_1 = __importDefault(require("axios"));
//Get auth details
function setProperties(properties) {
    //get username/password details from service connection
    const serviceConnectionId = tl.getInput('artifactoryServiceConnection', true);
    const auth = tl.getEndpointAuthorization(serviceConnectionId, false);
    const username = auth?.parameters["username"];
    const password = auth?.parameters["password"];
    const url = 'http://oshprengel.jfrog.io/artifactory/api/storage/docker-trial';
    //setup client for artifactory
    const artifactUrl = tl.getInput('artifactUrl', true);
    const baseUrl = tl.getEndpointUrl(serviceConnectionId, false);
    console.log(`Base URL: ` + baseUrl);
    //
    const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');
    const headers = {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json', // Set content type based on your requirements
    };
    axios_1.default.get(url, { headers })
        .then(response => {
        console.log('Response:', response.data);
        // Handle the response here
    })
        .catch(error => {
        console.error('Error:', error);
        // Handle errors here
    });
}
exports.setProperties = setProperties;
