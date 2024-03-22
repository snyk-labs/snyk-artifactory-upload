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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.addPipelineInfo = exports.processCode = exports.readFileContents = exports.findLocalReportFile = exports.encodeUrl = void 0;
var fs = require("fs");
var tl = require("azure-pipelines-task-lib/task");
var path = require("path");
function encodeUrl(subdirectory) {
    return subdirectory
        .split('')
        .map(function (char) { return (char === '/' ? char : encodeURIComponent(char)); })
        .join('');
}
exports.encodeUrl = encodeUrl;
function findLocalReportFile() {
    var givenDate = new Date();
    var directory = tl.getVariable('Agent.TempDirectory');
    var filesInDirectory = fs.readdirSync(directory);
    for (var _i = 0, filesInDirectory_1 = filesInDirectory; _i < filesInDirectory_1.length; _i++) {
        var file = filesInDirectory_1[_i];
        if (file.startsWith('report-') && file.endsWith('.json')) {
            var fileDateStr = file.replace('report-', '').replace('.json', '');
            var _a = fileDateStr.split(/[-T:]/), year = _a[0], month = _a[1], day = _a[2], hours = _a[3], minutes = _a[4], seconds = _a[5];
            var fileDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds));
            if (!isNaN(fileDate.getTime())) {
                var tenMinutesInMilliseconds = 10 * 60 * 1000; // 10 minutes in milliseconds
                var differenceInMilliseconds = Math.abs(givenDate.getTime() - fileDate.getTime());
                if (true) {
                    var filePath = path.join(directory, file);
                    console.log("Snyk report file found: " + filePath);
                    return filePath; // File found and within 10 minutes of the given date
                }
            }
        }
    }
    return null; // No suitable file found
}
exports.findLocalReportFile = findLocalReportFile;
function readFileContents(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fs.readFile(filePath, 'utf8', function (err, data) {
                        if (err) {
                            console.error('Error reading the file:', err);
                            reject(err); // Reject the promise if there's an error
                            return;
                        }
                        try {
                            var jsonObject = JSON.parse(data); // Parse the data as JSON
                            resolve(jsonObject); // Resolve the promise with the parsed JSON object
                        }
                        catch (parseError) {
                            console.error('Error parsing JSON:', parseError);
                            console.log("Contents of Snyk JSON file: " + data);
                            resolve(null); // Resolve with null if parsing fails
                            process.exit(1);
                        }
                    });
                })];
        });
    });
}
exports.readFileContents = readFileContents;
function processCode(codeOutput) {
    var _a, _b;
    var scanProperties = {
        snyk_sast_scan_status: 'Complete',
        snyk_sast_findings_present: false,
        snyk_sast_highest_severity_level: 'None',
        snyk_sast_high_severity_count: 0,
        snyk_sast_medium_severity_count: 0,
        snyk_sast_low_severity_count: 0,
        snyk_sast_project_link: 'None'
    };
    if (codeOutput && Array.isArray(codeOutput['runs'])) {
        var runs = codeOutput['runs'];
        for (var runIndex = 0; runIndex < runs.length; runIndex++) {
            var run = runs[runIndex];
            if (run && Array.isArray(run['results'])) {
                var results = run['results'];
                //filter through each issue
                for (var issueIndex = 0; issueIndex < results.length; issueIndex++) {
                    scanProperties.snyk_sast_scan_status = "complete";
                    //process each issue and amend the codeOutput object
                    var issue = results[issueIndex];
                    if (issue.level == 'info' || issue.level == 'note') {
                        scanProperties.snyk_sast_low_severity_count++;
                        if (scanProperties.snyk_sast_highest_severity_level == 'None') {
                            scanProperties.snyk_sast_highest_severity_level = 'low';
                        }
                        scanProperties.snyk_sast_findings_present = true;
                    }
                    else if (issue.level == 'warning') {
                        scanProperties.snyk_sast_medium_severity_count++;
                        if (scanProperties.snyk_sast_highest_severity_level == 'None' || scanProperties.snyk_sast_highest_severity_level == 'low') {
                            scanProperties.snyk_sast_highest_severity_level = 'medium';
                        }
                        scanProperties.snyk_sast_findings_present = true;
                    }
                    else if (issue.level == 'error') {
                        scanProperties.snyk_sast_high_severity_count++;
                        if (scanProperties.snyk_sast_highest_severity_level == 'None' || scanProperties.snyk_sast_highest_severity_level == 'low' || scanProperties.snyk_sast_highest_severity_level == 'medium') {
                            scanProperties.snyk_sast_highest_severity_level = 'high';
                        }
                        scanProperties.snyk_sast_findings_present = true;
                    }
                }
                //add report data
                if (typeof ((_b = (_a = run === null || run === void 0 ? void 0 : run.properties) === null || _a === void 0 ? void 0 : _a.uploadResult) === null || _b === void 0 ? void 0 : _b.reportUrl) === 'string') {
                    scanProperties.snyk_sast_project_link = run.properties.uploadResult.reportUrl;
                }
            }
        }
    }
    return scanProperties;
}
exports.processCode = processCode;
// Function to add pipeline info to an existing object
function addPipelineInfo(existingObj) {
    try {
        // Retrieve pipeline variables
        var projectName = tl.getVariable('System.TeamProject');
        var repoName = tl.getVariable('Build.Repository.Name');
        var sourceBranch = tl.getVariable('Build.SourceBranch');
        // Add pipeline info to the existing object
        var newObj = __assign(__assign({}, existingObj), { ado_project_name: projectName, code_repository_name: repoName, code_branch_name: sourceBranch });
        return newObj;
    }
    catch (error) {
        console.error('Error:', error);
        // Handle errors here or return the original object if an error occurs
        return existingObj;
    }
}
exports.addPipelineInfo = addPipelineInfo;
