import React, { useState } from 'react';

const PlayerStatSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSource, setSearchSource] = useState('adl'); // Default to 'adl'
  const [playerStats, setPlayerStats] = useState([]);
  const [error, setError] = useState('');

  const searchPlayerStats = async (searchTerm) => {
    const response = await fetch('/.netlify/functions/player-stat-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchValue: searchTerm, searchSource }), // Include searchSource in the body
    });
    const data = await response.json();

    if (response.ok) {
      setPlayerStats(data.players);
      setError('');
    } else {
      setError(data.error || 'An error occurred.');
      setPlayerStats([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      searchPlayerStats(searchTerm);
    }
  };

  const handleSourceChange = (e) => {
    setSearchSource(e.target.value); // Update search source
    setPlayerStats([]); // Clear the player stats when switching source
  };

  return (
    <div>
      {/* Radio buttons to select ADL or NADO */}
      <div className="radio-group">
        <input
          type="radio"
          value="adl"
          checked={searchSource === 'adl'}
          onChange={handleSourceChange}
          id="adl-radio"
        />
        <label htmlFor="adl-radio">ADL</label>

        <input
          type="radio"
          value="nado"
          checked={searchSource === 'nado'}
          onChange={handleSourceChange}
          id="nado-radio"
        />
        <label htmlFor="nado-radio">NADO</label>
      </div>

      <form onSubmit={handleSubmit} className="player-search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter player name"
        />
        <button type="submit">Search</button>
      </form>

      {error && <p>{error}</p>}
      {playerStats.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              {searchSource === 'adl' ? (
                <tr>
                  <th>Name</th>
                  <th>Player ID</th>
                  <th>01 Games</th>
                  <th>Cricket Games</th>
                  <th>01 Avg</th>
                  <th>Cricket Avg</th>
                  <th>01 Rating</th>
                  <th>Cricket Rating</th>
                  <th>Rolling Rating</th>
                </tr>
              ) : (
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Games Played</th>
                  <th>Marks Per Round</th>
                  <th>Points Per Dart</th>
                  <th>Rating</th>
                  <th>NADO Points</th>
                </tr>
              )}
            </thead>
            <tbody>
              {playerStats.map((player, index) => (
                <tr key={index}>
                  {searchSource === 'adl' ? (
                    <>
                      <td>{player.name}</td>
                      <td>{player.playerId}</td>
                      <td>{player.games01}</td>
                      <td>{player.cricketGames}</td>
                      <td>{player.avg01}</td>
                      <td>{player.cricketAvg}</td>
                      <td>{player.rating01}</td>
                      <td>{player.cricketRating}</td>
                      <td>{player.rollingRating}</td>
                    </>
                  ) : (
                    <>
                      <td>{player.firstName}</td>
                      <td>{player.lastName}</td>
                      <td>{player.gamesPlayed}</td>
                      <td>{player.marksPerRound}</td>
                      <td>{player.pointsPerDart}</td>
                      <td>{player.rating}</td>
                      <td>{player.nadoPoints}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlayerStatSearch;
