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
    //Retrieve artifact URLs
    const baseUrl = tl.getEndpointUrl(serviceConnectionId, true);
    const artifactUrls = tl.getInput('artifactUrls', false)?.split(',');
    const delimiter = tl.getInput('delimiter', false) || ',';
    console.log(artifactUrls);
    //set API headers
    const headers = {
        Authorization: `${authType} ${authToken}`,
        'Content-Type': 'application/json', // Set content type based on your requirements
    };
    //add properties to each artifact
    for (let artifactUrl of artifactUrls) {
        artifactUrl = `${baseUrl}artifactory/api/storage/${artifactUrl}`; // Construct the complete URL
        axios_1.default
            .get(artifactUrl, {
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
        // Object.keys(properties).forEach((prop) =>{
        //   const queryParams = {
        //     "properties": [prop] + '=' +properties[prop], // Assuming 'prop' and 'properties' are defined elsewhere
        //   };
        //   axios.put(artifactUrl, null, {
        //     params: queryParams,
        //     headers: headers,
        //   })
        //     .then(response => {
        //       console.log('Response from put url:', response.data);
        //       // Handle the response here
        //     })
        //     .catch(error => {
        //       console.log('Error from put URL data: response', error.response.data)
        //       // Handle errors here
        //       process.exit(1); // Exiting with a non-zero code indicating an error
        //     });
        //   })
    }
}
exports.setProperties = setProperties;
