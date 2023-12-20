import fs from 'fs';
import path from 'path';

function findReportFile(directory: string, givenDate: Date): string | null {
  const filesInDirectory = fs.readdirSync(directory);

  for (const file of filesInDirectory) {
    if (file.startsWith('report-') && file.endsWith('.json')) {
      const fileDateStr = file.replace('report-', '').replace('.json', '');
      const [year, month, day, hours, minutes, seconds] = fileDateStr.split(/[-T:]/);
      const fileDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds));
      console.log("file date " + fileDate)
      if (!isNaN(fileDate.getTime())) {
        const tenMinutesInMilliseconds = 10 * 60 * 1000; // 10 minutes in milliseconds
        const differenceInMilliseconds = Math.abs(givenDate.getTime() - fileDate.getTime());

        if (differenceInMilliseconds <= tenMinutesInMilliseconds) {
          return path.join(directory, file); // File found and within 10 minutes of the given date
        }
      }
    }
  }

  return null; // No suitable file found
}

// Example usage:
const directoryPath = '/Users/olegshprengel/Desktop/artifactory-azure-extension'; // Replace this with the directory path
const givenDate = new Date(); // Replace this with the date you want to compare against
console.log("current time " + givenDate)
const foundFile = findReportFile(directoryPath, givenDate);
if (foundFile) {
  console.log(`Found report file: ${foundFile}`);
} else {
  console.log('No matching report file within 10 minutes found.');
}


// function getCurrentDateTime(): string {
//     const currentDate = new Date();
//     const year = currentDate.getFullYear();
//     const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
//     const day = ('0' + currentDate.getDate()).slice(-2);
//     const hours = ('0' + currentDate.getHours()).slice(-2);
//     const minutes = ('0' + currentDate.getMinutes()).slice(-2);
//     const seconds = ('0' + currentDate.getSeconds()).slice(-2);
  
//     return `report-${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
//   }
  
//   // Example usage:
//   const currentDateTime = getCurrentDateTime();
//   console.log('Current date and time:', currentDateTime);

//   console.log(getCurrentDateTime)