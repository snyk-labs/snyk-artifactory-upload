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
    console.log("endpoint is " + serviceConnectionId);
    console.log("type is " + typeof serviceConnectionId);
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
    const url = `${baseUrl}artifactory/api/storage/${artifactUrl}`; // Construct the complete URL
    const headers = {
        Authorization: `${authType} ${authToken}`,
        'Content-Type': 'application/json', // Set content type based on your requirements
    };
    axios_1.default
        .get(url, {
        headers: headers, // Pass headers as part of the request config
    })
        .then((response) => {
        // Handle successful response
        console.log('Response from get URL:', response.data);
    })
        .catch((error) => {
        // Handle error
        console.error('Error get URL:', error);
        process.exit();
    });
    Object.keys(properties).forEach((prop) => {
        const queryParams = {
            "properties": [prop] + '=' + properties[prop], // Assuming 'prop' and 'properties' are defined elsewhere
        };
        axios_1.default.put(url, null, {
            params: queryParams,
            headers: headers,
        })
            .then(response => {
            console.log('Response from put url:', response.data);
            // Handle the response here
        })
            .catch(error => {
            console.log('Error from put URL data: response', error.response.data);
            // Handle errors here
            process.exit(1); // Exiting with a non-zero code indicating an error
        });
    });
}
exports.setProperties = setProperties;
