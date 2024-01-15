import tl = require('azure-pipelines-task-lib/task');
import fs from 'fs'; // Import the Node.js file system module
import * as Utils from './helpers'
import * as types from './types'
const Artifactory = require('./artifactory-api-helpers');

async function run() {

  //get snyk report file
  let fileLocation: string | null = ""
  try{
    fileLocation = Utils.findReportFile()
  }catch (err) {
    console.log("Error retrieving Snyk report file: " + err)
    process.exit(1)
  }

  // if location of json code file is passed then proccess the data
  let scanData = {}
  if (fileLocation) {
    try{
      let codeJson = await Utils.readFileContents(fileLocation); // Only call function if fileLocation is defined
      scanData = Utils.processCode(codeJson)
    }catch (err){
      console.log("Error processing code results: " + err)
    }
    } else {
      console.error('File location is undefined or empty.');
      process.exit(1)
    }

    //add build details to data
    try{
      scanData = Utils.addPipelineInfo(scanData)
      console.log("Sucessfully retrieved build and snyk properties, properties to be added are: " + JSON.stringify(scanData))
    }catch (err){
      console.log("Error processing pipeline build data: " + err)
      process.exit(1)
    }

    //set properties in artifactory
    try{
      Artifactory.setProperties(scanData);
    }catch (err){
      console.log("Error setting properties on artifact: " + err)
    }
}
run()