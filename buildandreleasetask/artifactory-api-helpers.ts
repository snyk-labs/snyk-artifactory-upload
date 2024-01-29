import tl = require('azure-pipelines-task-lib/task');
import axios from 'axios';
import * as Utils from './helpers'
import { json } from 'stream/consumers';



export function setProperties(properties: any): void {
  const inputType = tl.getInput("InputType", true)?.toLowerCase()
  // get username/password details from service connection
  const serviceConnectionId: any = tl.getInput('artifactoryServiceConnection', true);
  const auth = tl.getEndpointAuthorization(serviceConnectionId, false);
  let authType: any = tl.getEndpointAuthorizationScheme(serviceConnectionId, false);
  let authToken: any = '';
  if (authType == 'UsernamePassword') {
    const username = auth?.parameters['username'];
    const password = auth?.parameters['password'];
    authToken = Buffer.from(`${username}:${password}`).toString('base64');
    authType = 'Basic';
  } else if (authType == 'Token') {
    authToken = auth?.parameters['apitoken'];
    authType = 'Bearer';
  }
  const baseUrl = tl.getEndpointUrl(serviceConnectionId, true);

  //set API headers
  const headers = {
    Authorization: `${authType} ${authToken}`,
    'Content-Type': 'application/json', // Set content type based on your requirements
  };
  //Retrieve artifact URLs
  let artifactUrls: any = []
  console.log(inputType)
  if (inputType == "urllist"){
    const delimiter: any = tl.getInput('delimiter', false) || ','
    artifactUrls = tl.getInput('artifactUrls', true)?.split(delimiter);
  }else if (inputType == "build"){

    const buildName = tl.getInput('BuildName', true)
    const buildNumber = tl.getInput('BuildNumber', true)
    const projectName = tl.getInput('ProjectName', true)
    const BuildStatus = tl.getInput('BuildStatus', false)
    // tl.getInput('BuildStatus', false) ? {"buildStatus":tl.getInput('BuildStatus', false)
    const searchBody = {
      "buildName": buildName,
      "buildNumber": buildNumber,
      "project" : projectName,
      ...(BuildStatus !== null && { myProperty: BuildStatus }),
     }

  

  console.log("search body" + JSON.stringify(searchBody))
  const searchUrl = `${baseUrl}/api/search/buildArtifacts`
  axios.post(searchUrl, JSON.stringify(searchBody), {
    headers: headers,
  })
    .then((response) => {
      artifactUrls = response.data.results.map((obj: any) => {
        const { downloadUri } = obj;
        console.log("download URI" + downloadUri)
        const trimmedUrl = downloadUri.replace(`${baseUrl}/`, "");
        console.log("trimmed URL is" + trimmedUrl)
        return trimmedUrl;
      }
    );

    console.log("urls are " + artifactUrls)
    for (let artifactUrlShort of artifactUrls) {
      artifactUrlShort = Utils.encodeUrl(artifactUrlShort);
      console.log(artifactUrlShort)
      const artifactUrl = `${baseUrl}/api/storage/${artifactUrlShort}`; // Construct the complete URL
      
      Object.keys(properties).forEach((prop) => {
        const queryParams = {
            "properties": [prop] + '=' + properties[prop], // Assuming 'prop' and 'properties' are defined elsewhere
        };
        axios.put(artifactUrl, null, {
            params: queryParams,
            headers: headers,
        })
            .then(response => {
            console.log(response.data)
        })
            .catch(error => {
            console.log('Error while attempting to add property to artifact: response', error.response.data);
            // Handle errors here
            process.exit(1); // Exiting with a non-zero code indicating an error
        });
    });
  }
  })
  .catch((error) => {
    console.error('Error from Artifactory search builds API:', error.response ? error.response.data : error.message);
  });
}

  //add properties to each artifact
  for (let artifactUrlShort of artifactUrls) {
      artifactUrlShort = Utils.encodeUrl(artifactUrlShort);
      console.log(artifactUrlShort)
      const artifactUrl = `${baseUrl}/artifactory/api/storage/${artifactUrlShort}`; // Construct the complete URL
      
      Object.keys(properties).forEach((prop) => {
        const queryParams = {
            "properties": [prop] + '=' + properties[prop], // Assuming 'prop' and 'properties' are defined elsewhere
        };
        axios.put(artifactUrl, null, {
            params: queryParams,
            headers: headers,
        })
            .then(response => {
            console.log(response.data)
        })
            .catch(error => {
            console.log('Error while attempting to add property to artifact: response', error.response.data);
            // Handle errors here
            process.exit(1); // Exiting with a non-zero code indicating an error
        });
    });
  }
}
