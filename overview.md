# Snyk Artifactory Upload

## Overview

This Azure DevOps task provides functionality to take Snyk vulnerability report details and upload them as properties onto Artifactory artifacts. It supports three main operations: `copy`, `process`, and `copyandprocess`. The task interacts with a Snyk vulnerability report file generated by a preceding task (Snyk Vulnerability Scan Task).

## Features

- **Copy Operation:**
  - Uploads the Snyk vulnerability report file to a user-specified directory (`snykFilePath` input).

- **Process Operation:**
  - Retrieves the Snyk report from the specified directory (`snykFilePath` input).
  - Sets properties from the report file onto designated Artifactory artifacts.
  - Artifacts can be specified either by providing a list of artifact URLs or build details (build name, number, and project name).
    - When using the url list option you can call multiple URL's seperated by a delimter (which can be configured to be a custom in the task, by default it is <,>)
    - Url's can be specific artifacts or folders, the task will set properties as long as the path is valid.
    - Do not include initial slash in URL list, example of a valid list > "path/to/some/artifact, path/to/some/folder"