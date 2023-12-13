"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCode = exports.readFileContents = void 0;
const fs_1 = __importDefault(require("fs")); // Import the Node.js file system module
async function readFileContents(filePath) {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading the file:', err);
                reject(err); // Reject the promise if there's an error
                return;
            }
            try {
                const jsonObject = JSON.parse(data); // Parse the data as JSON
                resolve(jsonObject); // Resolve the promise with the parsed JSON object
            }
            catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                resolve(null); // Resolve with null if parsing fails
            }
        });
    });
}
exports.readFileContents = readFileContents;
function processCode(codeOutput) {
    let scanProperties = {
        snyk_sast_scan_status: 'Error',
        snyk_sast_findings_present: false,
        snyk_sast_highest_severity_level: 'None',
        snyk_sast_high_severity_count: 0,
        snyk_sast_medium_severity_count: 0,
        snyk_sast_low_severity_count: 0
    };
    if (codeOutput && Array.isArray(codeOutput['runs'])) {
        const runs = codeOutput['runs'];
        for (let runIndex = 0; runIndex < runs.length; runIndex++) {
            const run = runs[runIndex];
            if (run && Array.isArray(run['results'])) {
                const results = run['results'];
                //filter through each issue
                for (let issueIndex = 0; issueIndex < results.length; issueIndex++) {
                    scanProperties.snyk_sast_scan_status = "complete";
                    //process each issue and amend the codeOutput object
                    const issue = results[issueIndex];
                    if (issue.level == 'info' || issue.level == 'note') {
                        scanProperties.snyk_sast_low_severity_count++;
                        if (scanProperties.snyk_sast_highest_severity_level == 'None') {
                            scanProperties.snyk_sast_highest_severity_level = 'low';
                        }
                        scanProperties.snyk_sast_findings_present = true;
                    }
                    else if (issue.level == 'warning') {
                        scanProperties.snyk_sast_medium_severity_count++;
                        if (scanProperties.snyk_sast_highest_severity_level == 'None' || scanProperties.snyk_sast_highest_severity_level == 'low') {
                            scanProperties.snyk_sast_highest_severity_level = 'medium';
                        }
                        scanProperties.snyk_sast_findings_present = true;
                    }
                    else if (issue.level == 'error') {
                        scanProperties.snyk_sast_high_severity_count++;
                        if (scanProperties.snyk_sast_highest_severity_level == 'None' || scanProperties.snyk_sast_highest_severity_level == 'low' || scanProperties.snyk_sast_highest_severity_level == 'medium') {
                            scanProperties.snyk_sast_highest_severity_level = 'high';
                        }
                        scanProperties.snyk_sast_findings_present = true;
                    }
                }
            }
        }
    }
    return scanProperties;
}
exports.processCode = processCode;
