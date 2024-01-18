"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setProperties = void 0;
const tl = require("azure-pipelines-task-lib/task");
const axios_1 = __importDefault(require("axios"));
const Utils = __importStar(require("./helpers"));
function setProperties(properties) {
    var _a;
    // get username/password details from service connection
    const serviceConnectionId = tl.getInput('artifactoryServiceConnection', true);
    const auth = tl.getEndpointAuthorization(serviceConnectionId, false);
    let authType = tl.getEndpointAuthorizationScheme(serviceConnectionId, false);
    let authToken = '';
    if (authType == 'UsernamePassword') {
        const username = auth === null || auth === void 0 ? void 0 : auth.parameters['username'];
        const password = auth === null || auth === void 0 ? void 0 : auth.parameters['password'];
        authToken = Buffer.from(`${username}:${password}`).toString('base64');
        authType = 'Basic';
    }
    else if (authType == 'Token') {
        authToken = auth === null || auth === void 0 ? void 0 : auth.parameters['apitoken'];
        authType = 'Bearer';
    }
    const baseUrl = tl.getEndpointUrl(serviceConnectionId, true);
    //Retrieve artifact URLs
    const delimiter = tl.getInput('delimiter', false) || ',';
    const artifactUrls = (_a = tl.getInput('artifactUrls', true)) === null || _a === void 0 ? void 0 : _a.split(delimiter);
    //set API headers
    const headers = {
        Authorization: `${authType} ${authToken}`,
        'Content-Type': 'application/json', // Set content type based on your requirements
    };
    //add properties to each artifact
    for (let artifactUrlShort of artifactUrls) {
        try {
            artifactUrlShort = Utils.encodeSpaces(artifactUrlShort);
            const artifactUrl = `${baseUrl}artifactory/api/storage/${artifactUrlShort}`; // Construct the complete URL
            const queryParams = Object.keys(properties).map(prop => `${prop}=12${properties[prop]}`);
            const axiosConfig = {
                params: { properties: queryParams },
                headers: headers,
            };
            const response = axios_1.default.put(artifactUrl, null, axiosConfig);
            // Handle the response here
            console.log("Successfully added properties to artifact: " + artifactUrlShort);
        }
        catch (error) {
            console.error(`Error adding properties to artifact ${artifactUrlShort}. Error shown below:`);
            if (error.response) {
                console.error(error.response.data);
            }
            else {
                console.error(error.message);
            }
            // Handle errors here
            process.exit(1); // Exiting with a non-zero code indicating an error
        }
    }
}
exports.setProperties = setProperties;
