import React, { useState } from 'react';

const TournamentPlayers = ({ players, onRemovePlayer, onTogglePaid, onAddNewPlayer }) => {
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
      });
      setNewPlayer({ name: '', ppd: '', mpr: '' });
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
          {players.map((player, index) => (
            <tr key={index}>
              <td onClick={() => onRemovePlayer(player)}>{player.name}</td>
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
