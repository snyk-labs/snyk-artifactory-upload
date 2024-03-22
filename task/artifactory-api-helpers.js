"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.setProperties = void 0;
var tl = require("azure-pipelines-task-lib/task");
var axios_1 = require("axios");
var axios_retry_1 = require("axios-retry");
var Utils = require("./helpers");
(0, axios_retry_1["default"])(axios_1["default"], {
    retries: 10,
    retryDelay: axios_retry_1["default"].exponentialDelay,
    onRetry: function (retryCount, error, Config) { console.log("Axios request failed with " + error + " retrying now.."); }
});
function setProperties(properties) {
    var _a, _b;
    var inputType = (_a = tl.getInput("InputType", true)) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    // get username/password details from service connection
    var serviceConnectionId = tl.getInput('artifactoryServiceConnection', true);
    var auth = tl.getEndpointAuthorization(serviceConnectionId, false);
    var authType = tl.getEndpointAuthorizationScheme(serviceConnectionId, false);
    var authToken = '';
    if (authType == 'UsernamePassword') {
        var username = auth === null || auth === void 0 ? void 0 : auth.parameters['username'];
        var password = auth === null || auth === void 0 ? void 0 : auth.parameters['password'];
        authToken = Buffer.from("".concat(username, ":").concat(password)).toString('base64');
        authType = 'Basic';
    }
    else if (authType == 'Token') {
        authToken = auth === null || auth === void 0 ? void 0 : auth.parameters['apitoken'];
        authType = 'Bearer';
    }
    var baseUrl = tl.getEndpointUrl(serviceConnectionId, true);
    //set API headers
    var headers = {
        Authorization: "".concat(authType, " ").concat(authToken),
        'Content-Type': 'application/json'
    };
    //Retrieve artifact URLs
    var artifactUrls = [];
    if (inputType == "urllist") {
        var delimiter = tl.getInput('delimiter', false) || ',';
        artifactUrls = (_b = tl.getInput('artifactUrls', true)) === null || _b === void 0 ? void 0 : _b.split(delimiter);
        var _loop_1 = function (artifactUrlShort) {
            artifactUrlShort = Utils.encodeUrl(artifactUrlShort);
            var artifactUrl = "".concat(baseUrl, "/api/storage/").concat(artifactUrlShort); // Construct the complete URL
            Object.keys(properties).forEach(function (prop) {
                var queryParams = {
                    "properties": [prop] + '=' + properties[prop]
                };
                axios_1["default"].put(artifactUrl, null, {
                    params: queryParams,
                    headers: headers
                })
                    .then(function (response) {
                    console.log("Successfully set property '".concat(prop, "' on Artifact ").concat(artifactUrlShort));
                })["catch"](function (error) {
                    //test
                    console.log('Error while attempting to add property to Artifact:' + error);
                    // Handle errors here
                    process.exit(1); // Exiting with a non-zero code indicating an error
                });
            });
        };
        //add properties to each artifact
        for (var _i = 0, artifactUrls_1 = artifactUrls; _i < artifactUrls_1.length; _i++) {
            var artifactUrlShort = artifactUrls_1[_i];
            _loop_1(artifactUrlShort);
        }
    }
    else if (inputType == "build") {
        var buildName = tl.getInput('BuildName', true);
        var buildNumber = tl.getInput('BuildNumber', true);
        var projectName = tl.getInput('ProjectKey', true);
        var BuildStatus = tl.getInput('BuildStatus', false);
        var searchBody = __assign({ "buildName": buildName, "buildNumber": buildNumber, "project": projectName }, (BuildStatus !== null && { myProperty: BuildStatus }));
        var searchUrl = "".concat(baseUrl, "/api/search/buildArtifacts");
        axios_1["default"].post(searchUrl, JSON.stringify(searchBody), {
            headers: headers
        })
            .then(function (response) {
            console.log("Data received from build search API: " + JSON.stringify(response.data));
            artifactUrls = response.data.results.map(function (obj) {
                var downloadUri = obj.downloadUri;
                var trimmedUrl = downloadUri.replace("".concat(baseUrl, "/"), "");
                return trimmedUrl;
            });
            var _loop_2 = function (artifactUrlShort) {
                artifactUrlShort = Utils.encodeUrl(artifactUrlShort);
                var artifactUrl = "".concat(baseUrl, "/api/storage/").concat(artifactUrlShort); // Construct the complete URL
                Object.keys(properties).forEach(function (prop) {
                    var queryParams = {
                        "properties": [prop] + '=' + properties[prop]
                    };
                    setTimeout(function () {
                        return axios_1["default"].put(artifactUrl, null, {
                            params: queryParams,
                            headers: headers
                        })
                            .then(function (response) {
                            console.log("Successfully set property '".concat(prop, "' on Artifact ").concat(artifactUrlShort));
                            // Adding a delay between each API call
                        })["catch"](function (error) {
                            console.log('Error while attempting to add property to Artifact: ' + error);
                            // Handle errors here
                            process.exit(1); // Exiting with a non-zero code indicating an error
                        });
                    }, 1000);
                });
            };
            for (var _i = 0, artifactUrls_2 = artifactUrls; _i < artifactUrls_2.length; _i++) {
                var artifactUrlShort = artifactUrls_2[_i];
                _loop_2(artifactUrlShort);
            }
        })["catch"](function (error) {
            console.error('Error from Artifactory search builds API:', error.response ? error.response.data : error.message);
            process.exit(1);
        });
    }
}
exports.setProperties = setProperties;
