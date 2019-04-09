//

const fs = require("fs");
const path = require("path");
const axios = require("axios");

const BASE_URL = "https://solc-bin.ethereum.org/bin/";
const RELEASE_LIST_JSON = "list.json";
const BASE_FOLDER_PATH = path.resolve(__dirname, "solidity_compiler_releases");

if (!fs.existsSync(BASE_FOLDER_PATH)) {
  fs.mkdirSync(BASE_FOLDER_PATH);
}

const downloadFile = async release => {
  try {
    const releaseFilePath = path.resolve(BASE_FOLDER_PATH, release);
    const doesFileAlreadyExist = await fs.state(releaseFilePath); 

    console.log(doesFileAlreadyExist); 

    if(doesFileAlreadyExist){
      const writer = fs.createWriteStream(releaseFilePath);

      const getFile = await axios({
        method: "get",
        url: `${BASE_URL}${release}`,
        responseType: "stream"
      });

      getFile.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    }
    else {
      console.log(releasePath); 
      console.log(doesFileAlreadyExist); 
      return true; 
    }


  } catch (err) {

  }

};

const fetchReleases = async () => {
  try {
    const allCompilerVersions = await axios.get(
      `${BASE_URL}${RELEASE_LIST_JSON}`
    );

    return allCompilerVersions.data.releases;
  } catch (error) {
    return error;
  }
};

const fetchAndStoreReleases = async () => {
  try {
    const releasesObject = await fetchReleases();
    const urlsList = [];

    for (let release in releasesObject) {
      const downloadStatus = await downloadFile(releasesObject[release]);
    }
  } catch (error) {
    console.log(error);
  }
};

fetchAndStoreReleases();
