"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setProperties = void 0;
const tl = require("azure-pipelines-task-lib/task");
const axios_1 = __importDefault(require("axios"));
function setProperties(properties) {
    // get username/password details from service connection
    const serviceConnectionId = tl.getInput('artifactoryServiceConnection', true);
    const auth = tl.getEndpointAuthorization(serviceConnectionId, false);
    let authType = tl.getEndpointAuthorizationScheme(serviceConnectionId, false);
    let authToken = '';
    if (authType == 'UsernamePassword') {
        const username = auth?.parameters['username'];
        const password = auth?.parameters['password'];
        authToken = Buffer.from(`${username}:${password}`).toString('base64');
        authType = 'Basic';
    }
    else if (authType == 'Token') {
        authToken = auth?.parameters['apitoken'];
        authType = 'Bearer';
    }
    const baseUrl = tl.getEndpointUrl(serviceConnectionId, false);
    const artifactUrl = tl.getInput('artifactUrl', true);
    const url = `${baseUrl}/${artifactUrl}`; // Construct the complete URL
    console.log('Full URL: ' + url);
    const testURL = 'http://oshprengel.jfrog.io/artifactory/api/storage/docker-trial';
    const headers = {
        Authorization: `${authType} ${authToken}`,
        'Content-Type': 'application/json', // Set content type based on your requirements
    };
    axios_1.default
        .get(testURL, {
        headers: headers, // Pass headers as part of the request config
    })
        .then((response) => {
        // Handle successful response
        console.log('Response:', response.data);
    })
        .catch((error) => {
        // Handle error
        console.error('Error occurred:', error);
    });
}
exports.setProperties = setProperties;
// for(let prop in Object.keys(properties)){
//   axios.put(url + "?properties=" + prop + "=" + properties[prop], { headers })
//   .then(response => {
//     console.log('Response:', response.data);
//     // Handle the response here
//   })
//   .catch(error => {
//     console.error('Error:', error);
//     // Handle errors here
//   });
// }
// const url = 'http://oshprengel.jfrog.io/artifactory/api/storage/docker-trial';
