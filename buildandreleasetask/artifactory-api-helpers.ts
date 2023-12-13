import tl = require('azure-pipelines-task-lib/task');

//Get auth details


export function setProperties(properties : any) : void {
    const serviceConnectionId : any = tl.getInput('artifactoryServiceConnection', true);
    console.log(serviceConnectionId)
    const auth = tl.getEndpointAuthorization(serviceConnectionId, false);
    console.log(auth?.parameters["username"].toString())
    console.log(auth?.parameters["password"].toString())

    console.log(JSON.stringify(auth))
}