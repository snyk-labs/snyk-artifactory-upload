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
Object.defineProperty(exports, "__esModule", { value: true });
const Utils = __importStar(require("./helpers"));
const Artifactory = require('./artifactory-api-helpers');
// const fileLocation: string | undefined = tl.getInput('scanresultslocation', true);
async function run() {
    let fileLocation = Utils.findReportFile();
    let codeJson = {};
    let scanData = {};
    // if location of json code file is passed then proccess the data
    if (fileLocation) {
        let codeJson = await Utils.readFileContents(fileLocation); // Only call function if fileLocation is defined
        scanData = Utils.processCode(codeJson);
    }
    else {
        console.error('File location is undefined or empty.');
    }
    //add build details to data
    scanData = Utils.addPipelineInfo(scanData);
    Artifactory.setProperties(scanData);
}
run();
