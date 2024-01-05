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
    const baseUrl = tl.getEndpointUrl(serviceConnectionId, true);
    //Retrieve artifact URLs
    const delimiter = tl.getInput('delimiter', false) || ',';
    const artifactUrls = tl.getInput('artifactUrls', true)?.split(delimiter);
    //set API headers
    const headers = {
        Authorization: `${authType} ${authToken}`,
        'Content-Type': 'application/json', // Set content type based on your requirements
    };
    //add properties to each artifact
    for (let artifactUrlShort of artifactUrls) {
        const artifactUrl = `${baseUrl}artifactory/api/storage/${artifactUrlShort}`; // Construct the complete URL
        Object.keys(properties).forEach((prop) => {
            const queryParams = {
                "properties": [prop] + '=12' + properties[prop], // Assuming 'prop' and 'properties' are defined elsewhere
            };
            axios_1.default.put(artifactUrl, null, {
                params: queryParams,
                headers: headers,
            })
                .then(response => {
                // Handle the response here
            })
                .catch(error => {
                console.log('Error while attempting to add property to artifact: response', error.response.data);
                // Handle errors here
                process.exit(1); // Exiting with a non-zero code indicating an error
            });
        });
        console.log("Sucessfully added properties to artifact: " + artifactUrlShort);
    }
}
exports.setProperties = setProperties;
