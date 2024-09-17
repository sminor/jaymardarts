import React, { useState } from 'react';

const TournamentPlayers = ({ players, onRemovePlayer, onAddNewPlayer, onTogglePaid }) => {
  const [newPlayer, setNewPlayer] = useState({ name: '', ppd: '', mpr: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlayer({
      ...newPlayer,
      [name]: value,
    });
  };

  const handleAddNewPlayer = () => {
    if (newPlayer.name && newPlayer.ppd && newPlayer.mpr) {
      onAddNewPlayer({
        name: newPlayer.name,
        ppd: parseFloat(newPlayer.ppd),
        mpr: parseFloat(newPlayer.mpr),
        paid: false, // Initialize new players with paid set to false
      });
      setNewPlayer({ name: '', ppd: '', mpr: '' });
    }
  };

  const handleRemovePlayer = (player) => {
    if (!player.paid) {
      onRemovePlayer(player);
    } else {
      alert("Cannot remove a player who has paid.");
    }
  };

  return (
    <div className="tournament-players-container">
      <h3>Tournament Players</h3>

      {/* Flex container to align inputs in a single row */}
      <div className="input-container">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newPlayer.name}
          onChange={handleInputChange}
          className="add-player-input"
        />
        <input
          type="number"
          name="ppd"
          placeholder="PPD"
          value={newPlayer.ppd}
          onChange={handleInputChange}
          step="0.01"
          className="add-player-input-small"
        />
        <input
          type="number"
          name="mpr"
          placeholder="MPR"
          value={newPlayer.mpr}
          onChange={handleInputChange}
          step="0.01"
          className="add-player-input-small"
        />
        <button onClick={handleAddNewPlayer}>Add</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>PPD</th>
            <th>MPR</th>
            <th>Paid</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.name}>
              <td onClick={() => handleRemovePlayer(player)} style={{ cursor: 'pointer' }}>
                {player.name}
              </td>
              <td>{player.ppd}</td>
              <td>{player.mpr}</td>
              <td>
                <input
                  type="checkbox"
                  checked={player.paid}
                  onChange={() => onTogglePaid(player)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TournamentPlayers;
