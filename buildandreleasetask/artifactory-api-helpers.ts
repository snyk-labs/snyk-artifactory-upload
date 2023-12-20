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
  const url = `${baseUrl}/api/storage/${artifactUrl}`; // Construct the complete URL

  const headers = {
    Authorization: `${authType} ${authToken}`,
    'Content-Type': 'application/json', // Set content type based on your requirements
  };

  axios
    .get(url, {
      headers: headers, // Pass headers as part of the request config
    })
    .then((response) => {
      // Handle successful response
      // console.log('Response:', response.data);
    })
    .catch((error) => {
      // Handle error
      console.error('Error occurred:', error);
    });
    // console.log(properties)
    // console.log(Object.keys(properties))
    Object.keys(properties).forEach((prop) =>{
      // console.log(url + "?properties=" + prop + "=" + properties[prop])
    })
  }

      // axios.put(url + "?properties=" + prop + "=" + properties[prop], { headers })
      // .then(response => {
      //   console.log('Response:', response.data);
      //   // Handle the response here
      // })
      // .catch(error => {
      //   console.error('Error:', error);
      //   // Handle errors here
      // });
//     }
// }




// const url = 'http://oshprengel.jfrog.io/artifactory/api/storage/docker-trial';