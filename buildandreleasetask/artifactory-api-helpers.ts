import tl = require('azure-pipelines-task-lib/task');
import axios from 'axios';

//Get auth details


export function setProperties(properties : any) : void {

    
    //get username/password details from service connection
    const serviceConnectionId : any = tl.getInput('artifactoryServiceConnection', true);
    const auth = tl.getEndpointAuthorization(serviceConnectionId, false);
    const username = auth?.parameters["username"]
    const password = auth?.parameters["password"]
    const url = 'http://oshprengel.jfrog.io/artifactory/api/storage/docker-trial';

    //setup client for artifactory
    const artifactUrl : any = tl.getInput('artifactUrl', true);
    const baseUrl = tl.getEndpointUrl(serviceConnectionId, false)
    console.log(`Base URL: ` + baseUrl)

    //
    const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');
    const headers = {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/json', // Set content type based on your requirements
    };
    
    axios.get(url, { headers })
      .then(response => {
        console.log('Response:', response.data);
        // Handle the response here
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle errors here
      });
}