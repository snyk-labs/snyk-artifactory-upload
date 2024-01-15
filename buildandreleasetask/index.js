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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utils = __importStar(require("./helpers"));
const Artifactory = require('./artifactory-api-helpers');
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        //get snyk report file
        let fileLocation = "";
        try {
            fileLocation = Utils.findReportFile();
        }
        catch (err) {
            console.log("Error retrieving Snyk report file: " + err);
            process.exit(1);
        }
        // if location of json code file is passed then proccess the data
        let scanData = {};
        if (fileLocation) {
            try {
                let codeJson = yield Utils.readFileContents(fileLocation); // Only call function if fileLocation is defined
                scanData = Utils.processCode(codeJson);
            }
            catch (err) {
                console.log("Error processing code results: " + err);
            }
        }
        else {
            console.error('File location is undefined or empty.');
            process.exit(1);
        }
        //add build details to data
        try {
            scanData = Utils.addPipelineInfo(scanData);
            console.log("Sucessfully retrieved build and snyk properties, properties to be added are: " + scanData);
        }
        catch (err) {
            console.log("Error processing pipeline build data: " + err);
            process.exit(1);
        }
        //set properties in artifactory
        try {
            Artifactory.setProperties(scanData);
        }
        catch (err) {
            console.log("Error setting properties on artifact: " + err);
        }
    });
}
run();
