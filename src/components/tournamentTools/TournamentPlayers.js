import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const TournamentPlayers = ({ tournamentPlayers, setTournamentPlayers, removeTournamentPlayer, registerResetFunction, handleMessage }) => {
  const [newPlayer, setNewPlayer] = useState(() => {
    const savedNewPlayer = localStorage.getItem('newPlayer');
    return savedNewPlayer ? JSON.parse(savedNewPlayer) : { name: '', ppd: '', mpr: '', paid: false };
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    const savedPlayers = localStorage.getItem('tournamentPlayers');
    if (savedPlayers && savedPlayers !== '[]') {
      setTournamentPlayers(JSON.parse(savedPlayers));
    }
  }, [setTournamentPlayers]);

  useEffect(() => {
    if (tournamentPlayers.length > 0) {
      localStorage.setItem('tournamentPlayers', JSON.stringify(tournamentPlayers));
    }
  }, [tournamentPlayers]);

  useEffect(() => {
    localStorage.setItem('newPlayer', JSON.stringify(newPlayer));
  }, [newPlayer]);

  const reset = useCallback(() => {
    setNewPlayer({ name: '', ppd: '', mpr: '', paid: false });
    setTournamentPlayers([]);
    localStorage.setItem('tournamentPlayers', JSON.stringify([]));
  }, [setTournamentPlayers]);

  useEffect(() => {
    registerResetFunction(reset);
  }, [registerResetFunction, reset]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlayer((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const addPlayer = () => {
    if (newPlayer.name && newPlayer.ppd && newPlayer.mpr) {
      setTournamentPlayers((prevPlayers) => {
        const updatedPlayers = [
          ...prevPlayers,
          {
            ...newPlayer,
            ppd: parseFloat(newPlayer.ppd),
            mpr: parseFloat(newPlayer.mpr),
            paid: false
          }
        ];
        localStorage.setItem('tournamentPlayers', JSON.stringify(updatedPlayers));
        return updatedPlayers;
      });
      setNewPlayer({ name: '', ppd: '', mpr: '', paid: false });
    }
  };

  const togglePaidStatus = (name) => {
    const updatedPlayers = tournamentPlayers.map((player) =>
      player.name === name ? { ...player, paid: !player.paid } : player
    );
    setTournamentPlayers(updatedPlayers);
    localStorage.setItem('tournamentPlayers', JSON.stringify(updatedPlayers));
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedPlayers = [...tournamentPlayers].sort((a, b) => {
    if (!sortConfig.key) return 0; // No sorting
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? (
        <FontAwesomeIcon icon={faSortUp} />
      ) : (
        <FontAwesomeIcon icon={faSortDown} />
      );
    }
    return null;
  };

  return (
    <div className="tournament-players-container">
      <h2>Tournament Players</h2>

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
        <button onClick={addPlayer} aria-label="Add Player">
          <FontAwesomeIcon icon={faUserPlus} />
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => requestSort('name')}>
              Name {getSortIcon('name')}
            </th>
            <th onClick={() => requestSort('ppd')}>
              PPD {getSortIcon('ppd')}
            </th>
            <th onClick={() => requestSort('mpr')}>
              MPR {getSortIcon('mpr')}
            </th>
            <th>Paid</th>
          </tr>
        </thead>
        <tbody>
          {[...sortedPlayers].reverse().map((player, index) => (
            <tr key={index}>
              <td onClick={() => removeTournamentPlayer(player)}>{player.name}</td>
              <td>{parseFloat(player.ppd).toFixed(2)}</td>
              <td>{parseFloat(player.mpr).toFixed(2)}</td>
              <td>
                <input
                  type="checkbox"
                  checked={player.paid || false}
                  onChange={() => togglePaidStatus(player.name)}
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
