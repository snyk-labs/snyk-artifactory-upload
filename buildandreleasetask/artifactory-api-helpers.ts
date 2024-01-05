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

  //Retrieve artifact URLs
  const baseUrl = tl.getEndpointUrl(serviceConnectionId, true);
  const artifactUrls: any = tl.getInput('artifactUrls', true)?.split(',');
  const delimiter: any = tl.getInput('delimiter', false) || ','

  console.log(artifactUrls)

  //set API headers
  const headers = {
    Authorization: `${authType} ${authToken}`,
    'Content-Type': 'application/json', // Set content type based on your requirements
  };

  //add properties to each artifact
  for(let artifactUrl of artifactUrls){


  artifactUrl = `${baseUrl}artifactory/api/storage/${artifactUrl}`; // Construct the complete URL
    axios
    .get(artifactUrl, {
      headers: headers, // Pass headers as part of the request config
    })
    .then((response) => {
      // Handle successful response
      console.log('Response from get URL:', response.data);
    })
    .catch((error) => {
      // Handle error
      console.error('Error get URL:', error);
      process.exit()
    });



    // Object.keys(properties).forEach((prop) =>{
    //   const queryParams = {
    //     "properties": [prop] + '=' +properties[prop], // Assuming 'prop' and 'properties' are defined elsewhere
    //   };
    //   axios.put(artifactUrl, null, {
    //     params: queryParams,
    //     headers: headers,
    //   })
    //     .then(response => {
    //       console.log('Response from put url:', response.data);
    //       // Handle the response here
    //     })
    //     .catch(error => {
    //       console.log('Error from put URL data: response', error.response.data)


    //       // Handle errors here
    //       process.exit(1); // Exiting with a non-zero code indicating an error
    //     });
    //   })
  }
}