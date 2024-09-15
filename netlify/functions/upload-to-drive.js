// netlify/functions/upload-to-drive.js
const { google } = require('googleapis');
const stream = require('stream');

const serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
console.log(serviceAccountKey.private_key);

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccountKey,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

// Initialize Google Drive API
const drive = google.drive({ version: 'v3', auth });

exports.handler = async (event) => {
  try {
    const { fileContent, fileName } = JSON.parse(event.body);
    const buffer = Buffer.from(fileContent, 'base64');

    // Create a readable stream from the buffer
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);

    // Create file metadata
    const fileMetadata = {
      name: fileName,
      parents: ['1OYVqAn7HK65xncTxMu2Unj3ErS5W95Qg'], // Replace with the actual folder ID
    };

    // Media (file content)
    const media = {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      body: bufferStream, // Use the stream here
    };

    // Upload the file to Google Drive
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
