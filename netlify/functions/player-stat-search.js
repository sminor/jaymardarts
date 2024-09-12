const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.handler = async function (event, context) {
  console.log("Incoming request body:", event.body);

  const { searchValue, searchSource } = JSON.parse(event.body);

  console.log("Search Source:", searchSource);

  // Check if the searchSource is valid
  if (!searchSource || !['adl', 'nado'].includes(searchSource)) {
    console.log("Invalid search source received:", searchSource);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid search source provided.' }),
    };
  }

  const urls = {
    adl: 'http://actiondartl.web709.discountasp.net/Player/StatisticSearch',
    nado: `https://api.nado.net/v2/franchiseePlayers/JayMar-Entertainment`,
  };

  try {
    let players = [];

    // ADL Search Logic
    if (searchSource === 'adl') {
      const response = await fetch(urls.adl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `searchValue=${encodeURIComponent(searchValue)}&regionId=&lowRating=&highRating=`,
      });

      const html = await response.text();
      const $ = cheerio.load(html);

      $('tr').each((i, el) => {
        const name = $(el).find('.rowTitleRoster').text().trim();
        const playerId = $(el).find('.row1Roster').eq(1).text().trim();
        const games01 = $(el).find('.row1Roster').eq(2).text().trim();
        const cricketGames = $(el).find('.row1Roster').eq(3).text().trim();
        const avg01 = $(el).find('.row1Roster').eq(4).text().trim();
        const cricketAvg = $(el).find('.row1Roster').eq(5).text().trim();
        const rating01 = $(el).find('.row1Roster').eq(6).text().trim();
        const cricketRating = $(el).find('.row1Roster').eq(7).text().trim();
        const rollingRating = $(el).find('.row1Roster').eq(8).text().trim();

        if (name) {
          players.push({
            name,
            playerId,
            games01,
            cricketGames,
            avg01,
            cricketAvg,
            rating01,
            cricketRating,
            rollingRating,
          });
        }
      });
    }

    // NADO Search Logic
    if (searchSource === 'nado') {
      const response = await fetch(urls.nado, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();

      players = json.filter(player =>
        `${player.firstName} ${player.lastName}`.toLowerCase().includes(searchValue.toLowerCase())
      ).map(player => ({
        firstName: player.firstName,
        lastName: player.lastName,
        gamesPlayed: player.gamesPlayed,
        marksPerRound: player.marksPerRound,
        pointsPerDart: player.pointsPerDart,
        rating: player.actualRating,
        nadoPoints: player.points.cappedPoints,
      }));
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ players }),
    };

  } catch (error) {
    console.error('Error fetching player stats:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred. Please try again.' }),
    };
  }
};
