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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const fs_1 = __importDefault(require("fs")); // Import the Node.js file system module
const Utils = __importStar(require("./helpers"));
const Artifactory = require('./artifactory-api-helpers');
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        //determine whether to use forward or backslash depending on OS
        const os = process.env.AGENT_OS;
        console.log("agent os is" + os);
        let slash;
        if (os === 'Windows_NT') {
            slash = '\\'; // Backslash for Windows
        }
        else {
            slash = '/'; // Forward slash for Linux and macOS
        }
        const operation = tl.getInput('Operation', true);
        const snykFilePath = tl.getInput('SnykDirectory') + slash;
        if (operation == "Copy") {
            //get file location from temp directory
            let fileLocation = "";
            try {
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
            //create scan data object
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
            //copy to filesystem
            try {
                const jsonFilePath = `${snykFilePath}SnykReport.json`;
                tl.writeFile(jsonFilePath, JSON.stringify(scanData));
                console.log(`Wrote Snyk vulnerability data to ${jsonFilePath} `);
                //DEPRECATED, upload snyk report to azure artifact
                // const artifactName = 'SnykReport';
                // const artifactType = 'filepath'; 
                // const artifactPath = jsonFilePath;
                // tl.command('artifact.upload', { artifactname: artifactName, type: artifactType }, artifactPath);
            }
            catch (err) {
                tl.setResult(tl.TaskResult.Failed, err.message);
            }
        }
        else if (operation == "Process") {
            console.log("Reading snyk data data from: " + snykFilePath);
            let scanData = fs_1.default.readFileSync(`${snykFilePath}SnykReport.json`, 'utf-8');
            scanData = JSON.parse(scanData);
            console.log(scanData);
            // if (downloadOption == 'local'){
            //   //get snyk report file
            // let fileLocation: string | null = ""
            // try{
            //   fileLocation = Utils.findLocalReportFile()
            //   if (fileLocation == null){
            //     console.log("Failed to find Snyk report file")
            //     process.exit(1)
            //   }
            // }catch (err) {
            //   console.log("Error retrieving Snyk report file: " + err)
            //   process.exit(1)
            // }
            // // if location of json code file is passed then proccess the data
            // if (fileLocation) {
            //   try{
            //     let codeJson = await Utils.readFileContents(fileLocation); // Only call function if fileLocation is defined
            //     scanData = Utils.processCode(codeJson)
            //   }catch (err){
            //     console.log("Error processing code results: " + err)
            //   }
            //   } else {
            //     console.error('File location is undefined or empty.');
            //     process.exit(1)
            //   }
            //   //add build details to data
            //   try{
            //     scanData = Utils.addPipelineInfo(scanData)
            //     console.log("Sucessfully retrieved build and snyk properties, properties to be added are: " + JSON.stringify(scanData))
            //   }catch (err){
            //     console.log("Error processing pipeline build data: " + err)
            //     process.exit(1)
            //   }
            // }else{
            //   const pipelineWorkspace = tl.getVariable("Agent.BuildDirectory") || '';
            //   const artifactRelativePath = 'SnykReport.json';
            //   const artifactPath = path.join(pipelineWorkspace, artifactRelativePath);
            //   try {
            //     // Read the content of the downloaded artifact file
            //     const artifactContent = fs.readFileSync(artifactPath, 'utf-8');
            //     // Log the content to the console
            //     console.log('Artifact Content:', artifactContent);
            //     scanData = JSON.parse(artifactContent);
            //   } catch (error: any) {
            //     console.error('Error reading or logging artifact:', error.message);
            //   }
            // }
            //set properties in artifactory
            try {
                Artifactory.setProperties(scanData);
            }
            catch (err) {
                console.log("Error setting properties on artifact: " + err);
            }
        } //add error handling for no operation here TODO
    });
}
run();
