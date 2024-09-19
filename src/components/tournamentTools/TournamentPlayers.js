import React, { useState, useEffect, useCallback } from 'react';

const TournamentPlayers = ({ tournamentPlayers, setTournamentPlayers, removeTournamentPlayer, registerResetFunction }) => {
  const [newPlayer, setNewPlayer] = useState({ name: '', ppd: '', mpr: '', paid: false });

  const reset = useCallback(() => {
    setNewPlayer({ name: '', ppd: '', mpr: '', paid: false });
    setTournamentPlayers([]);
  }, [setTournamentPlayers]);

  useEffect(() => {
    registerResetFunction(reset);
  }, [registerResetFunction, reset]);

  // Load tournamentPlayers from localStorage on component mount
  useEffect(() => {
    const savedPlayers = localStorage.getItem('tournamentPlayers');
    if (savedPlayers) setTournamentPlayers(JSON.parse(savedPlayers));
  }, [setTournamentPlayers]); // Added setTournamentPlayers to the dependency array

  // Save tournamentPlayers to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tournamentPlayers', JSON.stringify(tournamentPlayers));
  }, [tournamentPlayers]);

  // Save newPlayer to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('newPlayer', JSON.stringify(newPlayer));
  }, [newPlayer]);

  // Handle input change for the new player
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlayer(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Add a new player to the tournament list
  const addPlayer = () => {
    if (newPlayer.name && newPlayer.ppd && newPlayer.mpr) {
      setTournamentPlayers(prevPlayers => [
        ...prevPlayers, 
        { 
          ...newPlayer, 
          ppd: parseFloat(newPlayer.ppd), // Convert ppd to a number
          mpr: parseFloat(newPlayer.mpr), // Convert mpr to a number
          paid: false 
        }
      ]);
      setNewPlayer({ name: '', ppd: '', mpr: '', paid: false });
    }
  };

  // Toggle the paid status of a player
  const togglePaidStatus = (index) => {
    const updatedPlayers = [...tournamentPlayers];
    updatedPlayers[index].paid = !updatedPlayers[index].paid;
    setTournamentPlayers(updatedPlayers);
  };

  return (
    <div className="tournament-players-container">
      <h2>Tournament Players</h2>

      {/* Input fields to add a new player */}
      <div className="input-container">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="add-player-input"
          value={newPlayer.name}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="ppd"
          placeholder="PPD"
          step="0.01"
          className="add-player-input-small"
          value={newPlayer.ppd}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="mpr"
          placeholder="MPR"
          step="0.01"
          className="add-player-input-small"
          value={newPlayer.mpr}
          onChange={handleInputChange}
        />
        <button onClick={addPlayer}>Add</button>
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
          {tournamentPlayers.map((player, index) => (
            <tr key={index}>
              <td onClick={() => removeTournamentPlayer(player)}>{player.name}</td>
              <td>{parseFloat(player.ppd).toFixed(2)}</td>
              <td>{parseFloat(player.mpr).toFixed(2)}</td>
              <td>
                <input
                  type="checkbox"
                  checked={player.paid || false}
                  onChange={() => togglePaidStatus(index)}
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
