import tl = require('azure-pipelines-task-lib/task');
import fs from 'fs'; // Import the Node.js file system module
import * as Utils from './helpers'
import * as types from './types'
const Artifactory = require('./artifactory-api-helpers');

const fileLocation: string | undefined = tl.getInput('scanresultslocation', true);

async function run() {
  let scanData = {}

  //if location of json code file is passed then proccess the data
  if (fileLocation) {
      let codeJson = await Utils.readFileContents(fileLocation); // Only call function if fileLocation is defined
      scanData = Utils.processCode(codeJson)
    } else {
      console.error('File location is undefined or empty.');
    }

    //add build details to data
    scanData = Utils.addPipelineInfo(scanData)
    console.log(scanData)
    Artifactory.setProperties(scanData);
}

run()