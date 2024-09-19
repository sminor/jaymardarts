const { google } = require('googleapis');
const cheerio = require('cheerio');

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

    const fileId = fileList.data.files[0].id;

    const fileBuffer = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );

    // Convert buffer to string and load into cheerio
    const fileContent = Buffer.from(fileBuffer.data).toString('utf8');
    const $ = cheerio.load(fileContent);

    // Extract the date
    let generatedDate = null;
    const reportDateNode = $('h2.report')[0].next;
    if (reportDateNode && reportDateNode.type === 'text') {
      const dateMatch = reportDateNode.data.trim().match(/Report Date:\s*(.*)/);
      if (dateMatch && dateMatch[1]) {
          generatedDate = dateMatch[1].trim();
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

    return {
      statusCode: 200,
      body: JSON.stringify({ generatedDate, players }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
