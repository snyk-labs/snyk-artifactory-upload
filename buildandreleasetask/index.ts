import tl = require('azure-pipelines-task-lib/task');
import fs from 'fs'; // Import the Node.js file system module




// Function to read a file and print its contents
function readFileContents(filePath: string): void {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }
    console.log('File contents:');
    console.log(data); // Print the contents of the file
  });
}


const fileLocation: string | undefined = tl.getInput('scanresultslocation', true);

if (fileLocation) {
  readFileContents(fileLocation); // Only call function if fileLocation is defined
} else {
  console.error('File location is undefined or empty.');
}
