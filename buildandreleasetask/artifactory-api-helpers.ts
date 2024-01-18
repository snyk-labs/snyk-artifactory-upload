import tl = require('azure-pipelines-task-lib/task');
import axios from 'axios';
import * as Utils from './helpers'



export function setProperties(properties: any): void {
  
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

  //Retrieve artifact URLs
  const delimiter: any = tl.getInput('delimiter', false) || ','
  const artifactUrls: any = tl.getInput('artifactUrls', true)?.split(delimiter);
  //set API headers
  const headers = {
    Authorization: `${authType} ${authToken}`,
    'Content-Type': 'application/json', // Set content type based on your requirements
  };

  //add properties to each artifact
  for (let artifactUrlShort of artifactUrls) {
    try {
      artifactUrlShort = Utils.encodeUrl(artifactUrlShort);

      const artifactUrl = `${baseUrl}artifactory/api/storage/${artifactUrlShort}`; // Construct the complete URL

      const queryParams = Object.keys(properties).map(prop => `${prop}=12${properties[prop]}`);
      const axiosConfig = {
        params: { properties: queryParams },
        headers: headers,
      };

      const response = axios.put(artifactUrl, null, axiosConfig);

    } catch (error: any) {
      console.error(`Error adding properties to artifact ${artifactUrlShort}. Error shown below:`);

      if (error.response) {
        console.error(error.response.data);
      } else {
        console.error(error.message);
      }

      // Handle errors here
      process.exit(1); // Exiting with a non-zero code indicating an error
  }
        // Handle the response here
        console.log("Successfully added properties to artifact: " + artifactUrlShort);
  }
}
