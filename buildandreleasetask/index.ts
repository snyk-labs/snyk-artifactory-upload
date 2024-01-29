import tl = require('azure-pipelines-task-lib/task');
import fs from 'fs'; // Import the Node.js file system module
import * as Utils from './helpers'
import * as types from './types'
const Artifactory = require('./artifactory-api-helpers');
import * as path from 'path';

async function run() {
  const operation = tl.getInput('Operation', true);
  const snykFilePath : any = tl.getInput('SnykDirectory');
  if (operation == "Copy"){
    
    //get file location from temp directory
    let fileLocation: string | null = ""
    try{
      fileLocation = Utils.findLocalReportFile()
      if (fileLocation == null){
        console.log("Failed to find Snyk report file")
        process.exit(1)
      }
    }catch (err) {
      console.log("Error retrieving Snyk report file: " + err)
      process.exit(1)
    }

    //create scan data object
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

    //copy to filesystem
    try{
      const jsonFilePath = `${snykFilePath}SnykReport.json`
      tl.writeFile(jsonFilePath, JSON.stringify(scanData))
      console.log(`Wrote Snyk vulnerability data to ${jsonFilePath} `)

      //DEPRECATED, upload snyk report to azure artifact
      // const artifactName = 'SnykReport';
      // const artifactType = 'filepath'; 
      // const artifactPath = jsonFilePath;

      // tl.command('artifact.upload', { artifactname: artifactName, type: artifactType }, artifactPath);
    }catch (err: any) {
      tl.setResult(tl.TaskResult.Failed, err.message);
    }
    
  }else if (operation == "Process"){
    console.log("Reading snyk data data from: " + snykFilePath)
    
    let scanData = fs.readFileSync(`${snykFilePath}SnykReport.json`, 'utf-8');
    scanData = JSON.parse(scanData)
    console.log(scanData)
    

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
    try{
        Artifactory.setProperties(scanData);
    }catch (err){
      console.log("Error setting properties on artifact: " + err)
  }
  }//add error handling for no operation here TODO
}
run()