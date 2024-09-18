const { google } = require('googleapis');

// Directly read the Google service account key from the environment variable
const serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccountKey,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

exports.handler = async (event) => {
  try {
    const folderId = '1OYVqAn7HK65xncTxMu2Unj3ErS5W95Qg'; // Replace with your folder ID
    const fileName = 'TournamentData.xlsx';

    const fileList = await drive.files.list({
      q: `'${folderId}' in parents and name='${fileName}' and trashed=false`,
      fields: 'files(id, name, modifiedTime)', // Include modifiedTime in the file list query
    });

    if (fileList.data.files.length === 0) {
      throw new Error('File not found');
    }

    const modifiedDate = fileList.data.files[0].modifiedTime;

    return {
      statusCode: 200,
      body: JSON.stringify({ modifiedDate }),
    };
  } catch (error) {
    console.error("Error fetching modified date:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
