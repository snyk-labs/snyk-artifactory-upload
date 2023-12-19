import tl = require('azure-pipelines-task-lib/task');
import axios from 'axios';

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

  const baseUrl = tl.getEndpointUrl(serviceConnectionId, false);
  const artifactUrl: any = tl.getInput('artifactUrl', true);
  const url = `${baseUrl}/${artifactUrl}`; // Construct the complete URL
  console.log('Full URL: ' + url);
  const testURL = 'http://oshprengel.jfrog.io/artifactory/api/storage/docker-trial'

  const headers = {
    Authorization: `${authType} ${authToken}`,
    'Content-Type': 'application/json', // Set content type based on your requirements
  };

  axios
    .get(testURL, {
      headers: headers, // Pass headers as part of the request config
    })
    .then((response) => {
      // Handle successful response
      console.log('Response:', response.data);
    })
    .catch((error) => {
      // Handle error
      console.error('Error occurred:', error);
    });
}

  // for(let prop in Object.keys(properties)){
    //   axios.put(url + "?properties=" + prop + "=" + properties[prop], { headers })
    //   .then(response => {
    //     console.log('Response:', response.data);
    //     // Handle the response here
    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //     // Handle errors here
    //   });
    // }


// const url = 'http://oshprengel.jfrog.io/artifactory/api/storage/docker-trial';