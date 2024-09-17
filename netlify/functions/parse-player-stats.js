const { google } = require('googleapis');
const fs = require('fs');
const cheerio = require('cheerio');

let serviceAccountKey;

try {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH) {
    const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;
    serviceAccountKey = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  } else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
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

    const fileId = fileList.data.files[0].id;
    const modifiedDate = fileList.data.files[0].modifiedTime;

    // If only the modified date is requested
    if (event.queryStringParameters && event.queryStringParameters.dateOnly === 'true') {
      return {
        statusCode: 200,
        body: JSON.stringify({ modifiedDate }),
      };
    }

    // Continue with fetching the file if the full data is requested
    const fileBuffer = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );

    // Convert buffer to string and load into cheerio
    const fileContent = Buffer.from(fileBuffer.data).toString('utf8');
    const $ = cheerio.load(fileContent);

    // Extract the date
    let generatedDate = 'Date not found';
    const reportHeader = $('h2.report').next().text().trim();
    if (reportHeader.includes('Report Date:')) {
      generatedDate = reportHeader.split('Report Date:')[1].trim();
    } else {
      // Try finding the text node directly after the h2
      const reportDateNode = $('h2.report')[0].next;
      if (reportDateNode && reportDateNode.type === 'text') {
        const dateMatch = reportDateNode.data.trim().match(/Report Date:\s*(.*)/);
        if (dateMatch && dateMatch[1]) {
          generatedDate = dateMatch[1].trim();
        }
      }
    }

    // Extract player data
    const players = [];
    $('table.report tr').each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length > 0) {
        const name = $(cells[0]).text().trim();
        const ppd = parseFloat($(cells[5]).text());
        const mpr = parseFloat($(cells[6]).text());

        if (name) {
          players.push({ name, ppd, mpr });
        }
      }
    });

    console.log('Extracted Date:', generatedDate);
    return {
      statusCode: 200,
      body: JSON.stringify({ generatedDate, players, modifiedDate }), // Include the modifiedDate
    };
  } catch (error) {
    console.error('Error parsing player stats:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
