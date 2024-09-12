import React, { useState } from 'react';

const PlayerStatSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSource, setSearchSource] = useState('adl'); // Default to 'adl'
  const [playerStats, setPlayerStats] = useState([]);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const searchPlayerStats = async (searchTerm) => {
    const response = await fetch('/.netlify/functions/player-stat-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchValue: searchTerm, searchSource }),
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
    setSearchSource(e.target.value);
    setPlayerStats([]);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPlayerStats = React.useMemo(() => {
    if (sortConfig.key) {
      const sortedData = [...playerStats].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      return sortedData;
    }
    return playerStats;
  }, [playerStats, sortConfig]);

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼';
    }
    return '';
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
      {sortedPlayerStats.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              {searchSource === 'adl' ? (
                <tr>
                  <th onClick={() => handleSort('name')}>
                    Name <span className="sort-indicator">{getSortIndicator('name')}</span>
                  </th>
                  <th onClick={() => handleSort('playerId')}>
                    Player ID <span className="sort-indicator">{getSortIndicator('playerId')}</span>
                  </th>
                  <th onClick={() => handleSort('games01')}>
                    01 Games <span className="sort-indicator">{getSortIndicator('games01')}</span>
                  </th>
                  <th onClick={() => handleSort('cricketGames')}>
                    Cricket Games <span className="sort-indicator">{getSortIndicator('cricketGames')}</span>
                  </th>
                  <th onClick={() => handleSort('avg01')}>
                    01 Avg <span className="sort-indicator">{getSortIndicator('avg01')}</span>
                  </th>
                  <th onClick={() => handleSort('cricketAvg')}>
                    Cricket Avg <span className="sort-indicator">{getSortIndicator('cricketAvg')}</span>
                  </th>
                  <th onClick={() => handleSort('rating01')}>
                    01 Rating <span className="sort-indicator">{getSortIndicator('rating01')}</span>
                  </th>
                  <th onClick={() => handleSort('cricketRating')}>
                    Cricket Rating <span className="sort-indicator">{getSortIndicator('cricketRating')}</span>
                  </th>
                  <th onClick={() => handleSort('rollingRating')}>
                    Rolling Rating <span className="sort-indicator">{getSortIndicator('rollingRating')}</span>
                  </th>
                </tr>
              ) : (
                <tr>
                  <th onClick={() => handleSort('firstName')}>
                    First Name <span className="sort-indicator">{getSortIndicator('firstName')}</span>
                  </th>
                  <th onClick={() => handleSort('lastName')}>
                    Last Name <span className="sort-indicator">{getSortIndicator('lastName')}</span>
                  </th>
                  <th onClick={() => handleSort('gamesPlayed')}>
                    Games Played <span className="sort-indicator">{getSortIndicator('gamesPlayed')}</span>
                  </th>
                  <th onClick={() => handleSort('marksPerRound')}>
                    Marks Per Round <span className="sort-indicator">{getSortIndicator('marksPerRound')}</span>
                  </th>
                  <th onClick={() => handleSort('pointsPerDart')}>
                    Points Per Dart <span className="sort-indicator">{getSortIndicator('pointsPerDart')}</span>
                  </th>
                  <th onClick={() => handleSort('rating')}>
                    Rating <span className="sort-indicator">{getSortIndicator('rating')}</span>
                  </th>
                  <th onClick={() => handleSort('nadoPoints')}>
                    NADO Points <span className="sort-indicator">{getSortIndicator('nadoPoints')}</span>
                  </th>
                </tr>
              )}
            </thead>
            <tbody>
              {sortedPlayerStats.map((player, index) => (
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
