const cheerio = require('cheerio');

const validateFile = (filePath, fileContent) => {

  // Validate file extension using string operations
  const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();

  if (ext !== '.xls' && ext !== '.xlsx') {
    return {
      valid: false,
      message: 'Invalid file type. Only XLS and XLSX files are allowed.',
    };
  }

  // Parse the file content using cheerio
  const $ = cheerio.load(fileContent);

  // Validate <h2>Player Standings Report for MASTER</h2> tag content
  const reportHeader = $('h2.report').text().trim();
  if (!reportHeader.includes('Player Standings Report for MASTER')) {
    return {
      valid: false,
      message: 'Invalid file content. Please upload a valid Player Standings Report for MASTER file.',
    };
  }

  // Validate presence of "Report Date"
  const reportDateNode = $('h2.report')[0].next;
  if (reportDateNode && reportDateNode.type === 'text') {
    const reportDateText = reportDateNode.data.trim();
    if (!reportDateText.includes('Report Date:')) {
      return {
        valid: false,
        message: 'Invalid file content. Report Date not found.',
      };
    }
  } else {
    return {
      valid: false,
      message: 'Invalid file content. Report Date not found.',
    };
  }

  // Validate presence of player data table
  const playerTable = $('table.report');
  if (playerTable.length === 0) {
    return {
      valid: false,
      message: 'Invalid file content. Player data table not found.',
    };
  }

  // Validate that the file has all appropriate closing tags
  const closingTags = ['</html>', '</body>', '</table>'];
  for (const tag of closingTags) {
    if (!fileContent.includes(tag)) {
      return {
        valid: false,
        message: 'Invalid file content. Incomplete file.',
      };
    }
  }

  return {
    valid: true,
    message: 'File is valid',
  };
};

module.exports = validateFile;