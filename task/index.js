"use strict";
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
var tl = require("azure-pipelines-task-lib/task");
var fs = require("fs");
var Utils = require("./helpers");
var Artifactory = require('./artifactory-api-helpers');
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var os, slash, operation, snykFilePath, fileLocation, scanData, codeJson, err_1, jsonFilePath, scanData, scanData_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    os = process.env.AGENT_OS;
                    if (os === 'Windows_NT') {
                        slash = '\\'; // Backslash for Windows
                    }
                    else {
                        slash = '/'; // Forward slash for Linux and macOS
                    }
                    operation = tl.getInput('Operation', true);
                    snykFilePath = tl.getInput('SnykDirectory') + slash;
                    if (!(operation == "Copy" || operation == "CopyAndProcess")) return [3 /*break*/, 7];
                    fileLocation = "";
                    try {
                        console.log("Attempting to retrieve Snyk report file from location: " + snykFilePath);
                        fileLocation = Utils.findLocalReportFile();
                        if (fileLocation == null) {
                            console.log("Failed to find Snyk report file");
                            process.exit(1);
                        }
                    }
                    catch (err) {
                        console.log("Error retrieving Snyk report file: " + err);
                        process.exit(1);
                    }
                    scanData = {};
                    if (!fileLocation) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Utils.readFileContents(fileLocation)];
                case 2:
                    codeJson = _a.sent();
                    scanData = Utils.processCode(codeJson);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.log("Error processing code results: " + err_1);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    console.error('File location is undefined or empty.');
                    process.exit(1);
                    _a.label = 6;
                case 6:
                    //copy to filesystem
                    try {
                        jsonFilePath = "".concat(snykFilePath, "SnykReport.json");
                        tl.writeFile(jsonFilePath, JSON.stringify(scanData));
                        console.log("Wrote Snyk vulnerability data to ".concat(jsonFilePath, " "));
                    }
                    catch (err) {
                        console.error("Failed to upload Snyk report to path: " + snykFilePath);
                        console.log(err);
                        process.exit(1);
                    }
                    _a.label = 7;
                case 7:
                    if (operation == "Process" || operation == "CopyAndProcess") {
                        scanData = {};
                        console.log("Proccesing Snyk data from: " + snykFilePath);
                        try {
                            scanData_1 = fs.readFileSync("".concat(snykFilePath, "SnykReport.json"), 'utf-8');
                            scanData_1 = JSON.parse(scanData_1);
                            console.log("Successfully retrieved scan data: " + JSON.stringify(scanData_1));
                            //set properties in artifactory with scan data
                            try {
                                Artifactory.setProperties(scanData_1);
                            }
                            catch (err) {
                                console.log("Error setting properties on artifact: " + err);
                                process.exit(1);
                            }
                        }
                        catch (err) {
                            console.error("Error while attempting to retrieve scan data: " + err);
                            process.exit(1);
                        }
                        //test
                    }
                    return [2 /*return*/];
            }
        });
    });
}
run();
