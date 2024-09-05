const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.handler = async function (event, context) {
    const { searchValue } = JSON.parse(event.body);
    const url = 'http://actiondartl.web709.discountasp.net/Player/StatisticSearch';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `searchValue=${encodeURIComponent(searchValue)}&regionId=&lowRating=&highRating=`,
        });

        const html = await response.text();
        const $ = cheerio.load(html);

        let players = [];

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
                    rollingRating
                });
            }
        });

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

