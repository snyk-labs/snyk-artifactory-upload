#!/bin/bash

# Define variables
organization="oshprengel"
project="test"
pat="hm2fw5aq5snbzmuujlautt3usiajkhfkowu2udqwe3sqb6j65woq" # You need a Personal Access Token (PAT) with appropriate permissions

# Base64 encode the Personal Access Token (PAT)
token="$(echo -n ":$pat" | base64)"

# Get service connections
url="https://dev.azure.com/$organization/$project/_apis/serviceendpoint/endpoints/14fa6044-2751-4491-b929-79ab9cc999f6?api-version=6.0-preview.4"

# Make REST API call to get service connections
response=$(curl -s -H "Authorization: Basic $token" -X GET $url)

# Display Service Connection IDs
echo "$response" 

if [ "$count" -gt 0 ]; then
    echo "Service Connections:"
    echo "$response" | jq -r '.value[] | "Service Connection Name: \(.name), ID: \(.id)"'
else
    echo "No service connections found."
fi

