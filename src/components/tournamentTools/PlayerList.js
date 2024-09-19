import React, { useState, useEffect, useCallback } from 'react';

const PlayerList = ({ addTournamentPlayer, registerResetFunction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [players, setPlayers] = useState([]);

  const reset = useCallback(() => {
    setSearchTerm('');
    setShowAll(false);
  }, []);

  useEffect(() => {
    registerResetFunction(reset);
  }, [registerResetFunction, reset]);

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedSearchTerm = localStorage.getItem('playerListSearchTerm');
    const savedShowAll = localStorage.getItem('playerListShowAll');
    const storedParseResult = localStorage.getItem('parseResult');

    if (savedSearchTerm) setSearchTerm(savedSearchTerm);
    if (savedShowAll) setShowAll(savedShowAll === 'true');

    // Parse the stored parseResult and set players
    if (storedParseResult) {
      const parsedResult = JSON.parse(storedParseResult);
      setPlayers(parsedResult.players || []); // Ensure players is an array
    }
  }, []); // Run only once on mount

  // Save searchTerm and showAll to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('playerListSearchTerm', searchTerm);
    localStorage.setItem('playerListShowAll', showAll);
  }, [searchTerm, showAll]);

  // Function to filter players based on search term
  const filteredPlayers = players.filter((player) => {
    return player.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Decide which players to display based on the showAll checkbox
  const playersToDisplay = showAll ? filteredPlayers : (searchTerm ? filteredPlayers : []);

  return (
    <div className="player-list-container">
      <h2>Player List</h2>

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
          {playersToDisplay.map(player => (
            <tr key={player.name}>
              <td 
                onClick={() => {
                  addTournamentPlayer(player);
                }}
              >
                {player.name}
              </td>
              <td>{player.ppd.toFixed(2)}</td>
              <td>{player.mpr.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default PlayerList;
