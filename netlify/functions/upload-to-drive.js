// netlify/functions/upload-to-drive.js
const { google } = require('googleapis');
const stream = require('stream');
const fs = require('fs');

let serviceAccountKey;

try {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH) {
    // If the path is provided, read the key file
    const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;
    serviceAccountKey = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  } else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    // If the key is provided directly, parse it
    serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  } else {
    throw new Error('Google service account key not provided');
  }
} catch (error) {
  console.error("Error reading or parsing the service account key:", error);
}

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccountKey,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

// Initialize Google Drive API
const drive = google.drive({ version: 'v3', auth });

exports.handler = async (event) => {
  try {
    const { fileContent } = JSON.parse(event.body);
    const buffer = Buffer.from(fileContent, 'base64');

    // Create a readable stream from the buffer
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);

    const folderId = '1OYVqAn7HK65xncTxMu2Unj3ErS5W95Qg'; // Replace with your folder ID
    const fixedFileName = 'TournamentData.xlsx'; // Define the fixed file name here

    // Step 1: Check for existing file with the same name in the folder
    const existingFiles = await drive.files.list({
      q: `'${folderId}' in parents and name='${fixedFileName}' and trashed=false`,
      fields: 'files(id, name)',
    });

    // Step 2: If file exists, delete it
    if (existingFiles.data.files.length > 0) {
      const fileId = existingFiles.data.files[0].id;
      await drive.files.delete({ fileId });
    }

    // Step 3: Create file metadata with the fixed file name
    const fileMetadata = {
      name: fixedFileName,
      parents: [folderId],
    };

    // Media (file content)
    const media = {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      body: bufferStream, // Use the stream here
    };

    // Step 4: Upload the new file to Google Drive
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'File uploaded successfully', fileId: file.data.id }),
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
