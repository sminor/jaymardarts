const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const { url } = JSON.parse(event.body);

  console.log("Received URL:", url);  // Log the URL being received

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing URL' }),
    };
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch from URL: ${response.statusText}`);
    }

    const data = await response.text();
    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    console.error('Error fetching standings:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch standings data' }),
    };
  }
};
