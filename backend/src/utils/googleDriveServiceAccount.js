// src/utils/googleDriveServiceAccount.js
const { google } = require('googleapis');
const path = require('path');

// Path to your service account credentials file
const SERVICE_ACCOUNT_KEY_PATH = path.join(__dirname, './mimics-454106-03060198c7b6.json');

// Initialize the Google Auth client with the service account
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_KEY_PATH,
  scopes: ['https://www.googleapis.com/auth/drive.readonly'], // Read-only access to Google Drive
});

// Initialize the Google Drive API client
const drive = google.drive({ version: 'v3', auth });

// Fetch list of files from Google Drive
const listFiles = async () => {
  let allFiles = [];
  let pageToken = null;

  try {
    let count = 0;
    do{
      const res = await drive.files.list({
        pageSize: 10, // Change this as per your requirement
        fields: 'nextPageToken, files(id, name, modifiedTime, webContentLink)',
        pageToken: pageToken,
      });
      console.log(count + ' token : ' + pageToken + '\n');

      allFiles = [...allFiles, ...res.data.files];
      pageToken = res.data.nextPageToken;
      console.log(count + ' next_token : ' + pageToken + '\n');
    }while(pageToken);

    return allFiles;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};
const downloadFile = async (fileId) => {
  try {
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, mimeType'
    });
    const res = await drive.files.get(
      { 
        fileId: fileId, 
        alt: 'media' 
      },
      { responseType: 'stream' }
    );
    return {
      fileStream: res.data,
      fileName: fileMetadata.data.name,
      mimeType: fileMetadata.data.mimeType
    };  // Returns the file as a stream
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

module.exports = {
  listFiles,
  downloadFile
};
