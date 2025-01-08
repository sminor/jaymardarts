import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TournamentHelper from '../TournamentHelper';

const ItemType = 'PLAYER';

const PlayerCard = ({ player, index, swapPlayers, listType, statValue }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index, listType },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    drop(item) {
      if (item.index !== index || item.listType !== listType) {
        swapPlayers(item.index, index, item.listType, listType);
      }
    },
  });

  return (
    <li ref={(node) => ref(drop(node))} className="player-card" title={statValue.toFixed(2)}>
      {player.name}
    </li>
  );
};

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

  useEffect(() => {
    localStorage.setItem('selectedStat', selectedStat);
    localStorage.setItem('aPlayers', JSON.stringify(aPlayers));
    localStorage.setItem('bPlayers', JSON.stringify(bPlayers));
    localStorage.setItem('teamNames', JSON.stringify(teamNames));
    localStorage.setItem('pairedPlayers', JSON.stringify(pairedPlayers));
  }, [selectedStat, aPlayers, bPlayers, teamNames, pairedPlayers]);

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

  const generateTeams = useCallback(() => {
    const sortedPlayers = [...tournamentPlayers].sort((a, b) => {
      const statA = getPlayerStat(a);
      const statB = getPlayerStat(b);
      return statB - statA;
    });

    const middleIndex = Math.ceil(sortedPlayers.length / 2);
    const newAPlayers = sortedPlayers.slice(0, middleIndex);
    const newBPlayers = sortedPlayers.slice(middleIndex).reverse();

    setAPlayers(newAPlayers);
    setBPlayers(newBPlayers);
    generateTeamNames(newAPlayers, newBPlayers);
    generatePairedPlayers(newAPlayers, newBPlayers);
  }, [tournamentPlayers, getPlayerStat]);

  const generateTeamNames = (aPlayersList, bPlayersList) => {
    const teams = aPlayersList.map((aPlayer, index) => {
      const aFirstName = aPlayer.name.split(' ')[0];
      const bFirstName = bPlayersList[index]?.name.split(' ')[0] || '';
      return `${aFirstName} and ${bFirstName}`.trim();
    });
    setTeamNames(teams);
  };

  const generatePairedPlayers = (aPlayersList, bPlayersList) => {
    const pairs = aPlayersList.map((aPlayer, index) => {
      const bPlayer = bPlayersList[index] || { name: '' };
      return [aPlayer.name, bPlayer.name];
    });
    setPairedPlayers(pairs);
  };

  const swapPlayers = (fromIndex, toIndex, fromListType, toListType) => {
    let updatedAPlayers = [...aPlayers];
    let updatedBPlayers = [...bPlayers];

    if (fromListType === toListType) {
      const players = fromListType === 'aPlayers' ? updatedAPlayers : updatedBPlayers;
      [players[fromIndex], players[toIndex]] = [players[toIndex], players[fromIndex]];
    } else {
      const fromPlayers = fromListType === 'aPlayers' ? updatedAPlayers : updatedBPlayers;
      const toPlayers = toListType === 'aPlayers' ? updatedAPlayers : updatedBPlayers;

      [toPlayers[toIndex], fromPlayers[fromIndex]] = [fromPlayers[fromIndex], toPlayers[toIndex]];
    }

    setAPlayers([...updatedAPlayers]);
    setBPlayers([...updatedBPlayers]);
    generateTeamNames(updatedAPlayers, updatedBPlayers);
    generatePairedPlayers(updatedAPlayers, updatedBPlayers);
  };

  const clearTeams = () => {
    setAPlayers([]);
    setBPlayers([]);
    setTeamNames([]);
    setPairedPlayers([]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
        <div>
          <h4>Player 1</h4>
          <ul className="droppable-area">
            {aPlayers.map((player, index) => (
              <PlayerCard
                key={player.name}
                player={player}
                index={index}
                swapPlayers={swapPlayers}
                listType="aPlayers"
                statValue={getPlayerStat(player)}
              />
            ))}
          </ul>
        </div>

        <div>
          <h4>Player 2</h4>
          <ul className="droppable-area">
            {bPlayers.map((player, index) => (
              <PlayerCard
                key={player.name}
                player={player}
                index={index}
                swapPlayers={swapPlayers}
                listType="bPlayers"
                statValue={getPlayerStat(player)}
              />
            ))}
          </ul>
        </div>

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
