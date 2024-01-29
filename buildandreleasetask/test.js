const baseUrl = "http://localhost:8081";

const arrayOfObjects = [
  { url: "http://localhost:8081/artifactory/api/storage/libs-release-local/org/jfrog/build-info-api/1.3.1/build-info-api-1.3.1.jar" },
  { url: "http://localhost:8081/artifactory/api/storage/libs-relelocal/o/jfrog/build-inf" },
  { url: "http://localhost:8081/artifactory/api/storage/libs-rele-local/org/jfrog/build-info-api/1.3build-info-api-1.3.1.jar" },
  // Add more objects as needed
];

const  arrayOfUrls = arrayOfObjects.map((obj) => {
  const { url } = obj;
  const trimmedUrl = url.replace(`${baseUrl}/artifactory/api/storage/`, "");
  return trimmedUrl;
});

console.log(arrayOfUrls);