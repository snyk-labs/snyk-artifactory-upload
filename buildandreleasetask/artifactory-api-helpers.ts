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
      artifactUrlShort = Utils.encodeUrl(artifactUrlShort);

      const artifactUrl = `${baseUrl}artifactory/api/storage/${artifactUrlShort}`; // Construct the complete URL

      Object.keys(properties).forEach((prop) => {
        const queryParams = {
            "properties": [prop] + '=' + properties[prop], // Assuming 'prop' and 'properties' are defined elsewhere
        };
        axios.put(artifactUrl, null, {
            params: queryParams,
            headers: headers,
        })
            .then(response => {
            // Handle the response here
        })
            .catch(error => {
            console.log('Error while attempting to add property to artifact: response', error.response.data);
            // Handle errors here
            process.exit(1); // Exiting with a non-zero code indicating an error
        });
    });
  }
}
