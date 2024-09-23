import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

const PlayerList = ({ addTournamentPlayer, registerResetFunction, tournamentPlayers }) => {
  const [searchTerm, setSearchTerm] = useState(() => {
    return localStorage.getItem('playerListSearchTerm') || '';
  });

  const [showAll, setShowAll] = useState(() => {
    return localStorage.getItem('playerListShowAll') === 'true';
  });

  const [players] = useState(() => {
    const storedParseResult = localStorage.getItem('parseResult');
    return storedParseResult ? JSON.parse(storedParseResult).players || [] : [];
  });

  const [selectedIndex, setSelectedIndex] = useState(0); // Track selected player in the filtered list
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' }); // Sorting configuration

  const reset = useCallback(() => {
    setSearchTerm('');
    setShowAll(false);
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    registerResetFunction(reset);
  }, [registerResetFunction, reset]);

  useEffect(() => {
    localStorage.setItem('playerListSearchTerm', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    localStorage.setItem('playerListShowAll', showAll.toString());
  }, [showAll]);

  // Handle sorting logic
  const sortedPlayers = React.useMemo(() => {
    let sortablePlayers = [...players];
    if (sortConfig !== null) {
      sortablePlayers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortablePlayers;
  }, [players, sortConfig]);

  // Function to filter players based on search term
  const filteredPlayers = sortedPlayers.filter((player) => {
    return player.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Filter out players already in the tournament
  const availablePlayers = filteredPlayers.filter(
    (player) => !tournamentPlayers.some((tPlayer) => tPlayer.name === player.name)
  );

  // Decide which players to display based on the showAll checkbox
  const playersToDisplay = showAll ? availablePlayers : (searchTerm ? availablePlayers : []);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, playersToDisplay.length - 1));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === 'Enter') {
      if (playersToDisplay.length > 0) {
        addTournamentPlayer(playersToDisplay[selectedIndex]);
      }
    }
  };

  const handlePlayerClick = (player) => {
    addTournamentPlayer(player);
  };

  return (
    <div className="player-list-container" tabIndex={0} onKeyDown={handleKeyDown}>
      <h2>Player List</h2>

      <div className="input-container">
        <input
          type="text"
          placeholder="Search..."
          className="add-player-input"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedIndex(0); // Reset the selected index on new search
          }}
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
            <th onClick={() => handleSort('name')}>
              Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />)}
            </th>
            <th onClick={() => handleSort('ppd')}>
              PPD {sortConfig.key === 'ppd' && (sortConfig.direction === 'ascending' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />)}
            </th>
            <th onClick={() => handleSort('mpr')}>
              MPR {sortConfig.key === 'mpr' && (sortConfig.direction === 'ascending' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />)}
            </th>
          </tr>
        </thead>
        <tbody>
          {playersToDisplay.map((player, index) => {
            const isSelected = index === selectedIndex && searchTerm;

            return (
              <tr key={player.name} onClick={() => handlePlayerClick(player)}>
                <td className={isSelected ? 'highlighted' : ''}>{player.name}</td>
                <td className={isSelected ? 'highlighted' : ''}>{player.ppd.toFixed(2)}</td>
                <td className={isSelected ? 'highlighted' : ''}>{player.mpr.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerList;
