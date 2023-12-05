"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const fs_1 = __importDefault(require("fs")); // Import the Node.js file system module
// Function to read a file and print its contents
function readFileContents(filePath) {
    fs_1.default.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
        console.log('File contents:');
        console.log(data); // Print the contents of the file
    });
}
const fileLocation = tl.getInput('scanresultslocation', true);
if (fileLocation) {
    readFileContents(fileLocation); // Only call function if fileLocation is defined
}
else {
    console.error('File location is undefined or empty.');
}
