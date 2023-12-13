import tl = require('azure-pipelines-task-lib/task');
import fs from 'fs'; // Import the Node.js file system module
import * as Utils from './helpers'
import * as types from './types'
const Artifactory = require('./artifactory-api-helpers');

const fileLocation: string | undefined = tl.getInput('scanresultslocation', true);

async function run() {
    if (fileLocation) {
        let codeResults = await Utils.readFileContents(fileLocation); // Only call function if fileLocation is defined
        console.log(Utils.processCode(codeResults))
      } else {
        console.error('File location is undefined or empty.');
      }
      console.log("testupdate");
      Artifactory.setProperties("balerg");
}

run()