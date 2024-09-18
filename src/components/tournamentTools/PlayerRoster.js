import React, { useState, useEffect } from 'react';

const PlayerRoster = ({ players, onAddPlayer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false); // State to track the checkbox

  // Load search term and show all state from sessionStorage on mount
  useEffect(() => {
    const savedSearchTerm = sessionStorage.getItem('playerRosterSearchTerm');
    const savedShowAll = sessionStorage.getItem('playerRosterShowAll');

    if (savedSearchTerm) {
      setSearchTerm(savedSearchTerm);
    }

    if (savedShowAll) {
      setShowAll(JSON.parse(savedShowAll));
    }
  }, []);

  // Save search term and show all state to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('playerRosterSearchTerm', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    sessionStorage.setItem('playerRosterShowAll', showAll);
  }, [showAll]);

  // Filter players based on search term
  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine which players to display
  const playersToDisplay = showAll || searchTerm ? filteredPlayers : [];

  return (
    <div className="player-roster-container">
      <h3>Player Roster</h3>

      {/* Flex container to align the search input and checkbox */}
      <div className="input-container">
        <input
          type="text"
          placeholder="Search..."
          className="add-player-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
          />
          Show All
        </label>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>PPD</th>
            <th>MPR</th>
          </tr>
        </thead>
        <tbody>
          {playersToDisplay.map((player, index) => (
            <tr key={index} onClick={() => onAddPlayer(player)}>
              <td>{player.name}</td>
              <td>{player.ppd}</td>
              <td>{player.mpr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerRoster;