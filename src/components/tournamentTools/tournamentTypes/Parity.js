import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TournamentHelper from '../TournamentHelper';

const Parity = ({ tournamentPlayers }) => {
  const [selectedStat, setSelectedStat] = useState(() => {
    const savedStat = localStorage.getItem('selectedStat');
    return savedStat || 'combo';
  });

  const [aPlayers, setAPlayers] = useState(() => {
    const saved = localStorage.getItem('aPlayers');
    return saved ? JSON.parse(saved) : [];
  });

  const [bPlayers, setBPlayers] = useState(() => {
    const saved = localStorage.getItem('bPlayers');
    return saved ? JSON.parse(saved) : [];
  });

  const [teamNames, setTeamNames] = useState(() => {
    const saved = localStorage.getItem('teamNames');
    return saved ? JSON.parse(saved) : [];
  });

  const [pairedPlayers, setPairedPlayers] = useState(() => {
    const saved = localStorage.getItem('pairedPlayers');
    return saved ? JSON.parse(saved) : [];
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedStat', selectedStat);
    localStorage.setItem('aPlayers', JSON.stringify(aPlayers));
    localStorage.setItem('bPlayers', JSON.stringify(bPlayers));
    localStorage.setItem('teamNames', JSON.stringify(teamNames));
    localStorage.setItem('pairedPlayers', JSON.stringify(pairedPlayers));
  }, [selectedStat, aPlayers, bPlayers, teamNames, pairedPlayers]);

  // Calculate the stat value based on the selected stat
  const getPlayerStat = useCallback((player) => {
    switch (selectedStat) {
      case 'combo':
        return player.ppd + player.mpr * 10;
      case 'ppd':
        return player.ppd;
      case 'mpr':
        return player.mpr;
      default:
        return player.ppd + player.mpr * 10;
    }
  }, [selectedStat]);

  // Pair players: best with lowest, second best with second lowest, etc.
  const generateTeams = useCallback(() => {
    // Sort players by selected stat
    const sortedPlayers = [...tournamentPlayers].sort((a, b) => {
      const statA = getPlayerStat(a);
      const statB = getPlayerStat(b);
      return statB - statA;
    });

    const middleIndex = Math.ceil(sortedPlayers.length / 2);
    const newAPlayers = sortedPlayers.slice(0, middleIndex); // Best players
    const newBPlayers = sortedPlayers.slice(middleIndex).reverse(); // Lowest players

    setAPlayers(newAPlayers);
    setBPlayers(newBPlayers);
    generateTeamNames(newAPlayers, newBPlayers);
    generatePairedPlayers(newAPlayers, newBPlayers);
  }, [tournamentPlayers, getPlayerStat]);

  // Generate team names: best player with lowest player
  const generateTeamNames = (aPlayersList, bPlayersList) => {
    const teams = aPlayersList.map((aPlayer, index) => {
      const aFirstName = aPlayer.name.split(' ')[0];
      const bFirstName = bPlayersList[index]?.name.split(' ')[0] || '';
      return `${aFirstName} and ${bFirstName}`.trim();
    });
    setTeamNames(teams);
  };

  // Pair players: match best with lowest
  const generatePairedPlayers = (aPlayersList, bPlayersList) => {
    const pairs = aPlayersList.map((aPlayer, index) => {
      const bPlayer = bPlayersList[index] || { name: '' };
      return [aPlayer.name, bPlayer.name];
    });
    setPairedPlayers(pairs);
  };

  const clearTeams = () => {
    setAPlayers([]);
    setBPlayers([]);
    setTeamNames([]);
    setPairedPlayers([]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Stat selection */}
      <div className="radio-container">
        <label>Stat to Use:</label>
        <input
          type="radio"
          name="stat"
          value="combo"
          checked={selectedStat === 'combo'}
          onChange={(e) => setSelectedStat(e.target.value)}
        /> Combo
        <input
          type="radio"
          name="stat"
          value="ppd"
          checked={selectedStat === 'ppd'}
          onChange={(e) => setSelectedStat(e.target.value)}
        /> PPD
        <input
          type="radio"
          name="stat"
          value="mpr"
          checked={selectedStat === 'mpr'}
          onChange={(e) => setSelectedStat(e.target.value)}
        /> MPR
      </div>

      <button onClick={generateTeams}>Generate Teams</button>

      <div className="players-group">
        {/* Player 1 List */}
        <div>
          <h4>Player 1</h4>
          <ul>
            {aPlayers.map((player, index) => (
              <li key={player.name} title={getPlayerStat(player).toFixed(2)}>
                {player.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Player 2 List */}
        <div>
          <h4>Player 2</h4>
          <ul>
            {bPlayers.map((player, index) => (
              <li key={player.name} title={getPlayerStat(player).toFixed(2)}>
                {player.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Team Names */}
        <div>
          <h4>Teams</h4>
          <ul>
            {teamNames.map((team, index) => (
              <li key={index} className="team-card">{team}</li>
            ))}
          </ul>
          <button onClick={clearTeams}>Clear Teams</button>
        </div>
      </div>

      <TournamentHelper 
        teamData={{
          teams: teamNames,
          players: pairedPlayers
        }} 
      />
    </DndProvider>
  );
};

export default Parity;
