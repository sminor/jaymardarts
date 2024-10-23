import React, { useState, useEffect, useCallback } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle, faTrash } from '@fortawesome/free-solid-svg-icons';
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

const ABCTriosDraw = ({ tournamentPlayers }) => {
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

  const [cPlayers, setCPlayers] = useState(() => {
    const saved = localStorage.getItem('cPlayers');
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

  const [activeShuffle, setActiveShuffle] = useState(null);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedStat', selectedStat);
    localStorage.setItem('aPlayers', JSON.stringify(aPlayers));
    localStorage.setItem('bPlayers', JSON.stringify(bPlayers));
    localStorage.setItem('cPlayers', JSON.stringify(cPlayers));
    localStorage.setItem('teamNames', JSON.stringify(teamNames));
    localStorage.setItem('pairedPlayers', JSON.stringify(pairedPlayers)); // Save paired players
  }, [selectedStat, aPlayers, bPlayers, cPlayers, teamNames, pairedPlayers]);

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

  // Divide players into A, B, and C groups based on the selected stat
  const dividePlayers = useCallback(() => {
    const sortedPlayers = [...tournamentPlayers].sort((a, b) => {
      const statA = getPlayerStat(a);
      const statB = getPlayerStat(b);
      return statB - statA;
    });

    const thirdIndex = Math.ceil(sortedPlayers.length / 3);
    const twoThirdsIndex = Math.ceil((sortedPlayers.length * 2) / 3);
    const newAPlayers = sortedPlayers.slice(0, thirdIndex);
    const newBPlayers = sortedPlayers.slice(thirdIndex, twoThirdsIndex);
    const newCPlayers = sortedPlayers.slice(twoThirdsIndex);

    setAPlayers(newAPlayers);
    setBPlayers(newBPlayers);
    setCPlayers(newCPlayers);
    generateTeamNames(newAPlayers, newBPlayers, newCPlayers);
    generatePairedPlayers(newAPlayers, newBPlayers, newCPlayers); // Generate player trios
  }, [tournamentPlayers, getPlayerStat]);

  // Generate team names by taking the first name from each player in A, B, and C groups
  const generateTeamNames = (aPlayersList, bPlayersList, cPlayersList) => {
    const teams = aPlayersList.map((aPlayer, index) => {
      const aFirstName = aPlayer.name.split(' ')[0];
      const bFirstName = bPlayersList[index]?.name.split(' ')[0] || '';
      const cFirstName = cPlayersList[index]?.name.split(' ')[0] || '';
      return `${aFirstName}, ${bFirstName}, and ${cFirstName}`.trim();
    });
    setTeamNames(teams);
  };

  // Generate paired player names from A, B, and C groups
  const generatePairedPlayers = (aPlayersList, bPlayersList, cPlayersList) => {
    const pairs = aPlayersList.map((aPlayer, index) => {
      const bPlayer = bPlayersList[index] || { name: '' };
      const cPlayer = cPlayersList[index] || { name: '' };
      return [aPlayer.name, bPlayer.name, cPlayer.name];
    });
    setPairedPlayers(pairs); // Store trios in state
  };

  // Swap players between the lists and update team names and paired players immediately
  const swapPlayers = (fromIndex, toIndex, fromListType, toListType) => {
    let updatedAPlayers = [...aPlayers];
    let updatedBPlayers = [...bPlayers];
    let updatedCPlayers = [...cPlayers];

    if (fromListType === toListType) {
      const listSetter = fromListType === 'aPlayers' ? setAPlayers : fromListType === 'bPlayers' ? setBPlayers : setCPlayers;
      const players = fromListType === 'aPlayers' ? updatedAPlayers : fromListType === 'bPlayers' ? updatedBPlayers : updatedCPlayers;
      [players[fromIndex], players[toIndex]] = [players[toIndex], players[fromIndex]];
      listSetter([...players]);
    } else {
      // Swap between A, B, and C lists
      const fromPlayers = fromListType === 'aPlayers' ? updatedAPlayers : fromListType === 'bPlayers' ? updatedBPlayers : updatedCPlayers;
      const toPlayers = toListType === 'aPlayers' ? updatedAPlayers : toListType === 'bPlayers' ? updatedBPlayers : updatedCPlayers;

      [fromPlayers[fromIndex], toPlayers[toIndex]] = [toPlayers[toIndex], fromPlayers[fromIndex]];

      setAPlayers([...updatedAPlayers]);
      setBPlayers([...updatedBPlayers]);
      setCPlayers([...updatedCPlayers]);
    }

    // Immediately update team names and paired players after swapping
    generateTeamNames(updatedAPlayers, updatedBPlayers, updatedCPlayers);
    generatePairedPlayers(updatedAPlayers, updatedBPlayers, updatedCPlayers);
  };

  const shufflePlayers = (groupSetter, players, groupType) => {
    setActiveShuffle(groupType);
    const shuffleTimes = 20;
    const intervalTime = 50;
    let shuffleCount = 0;
    let shuffled = [...players];

    const shuffleInterval = setInterval(() => {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      groupSetter([...shuffled]);
      shuffleCount++;

      if (shuffleCount >= shuffleTimes) {
        clearInterval(shuffleInterval);
        setActiveShuffle(null);
        generateTeamNames(
          groupType === 'aPlayers' ? shuffled : aPlayers,
          groupType === 'bPlayers' ? shuffled : bPlayers,
          groupType === 'cPlayers' ? shuffled : cPlayers
        );
        generatePairedPlayers(
          groupType === 'aPlayers' ? shuffled : aPlayers,
          groupType === 'bPlayers' ? shuffled : bPlayers,
          groupType === 'cPlayers' ? shuffled : cPlayers
        );
      }
    }, intervalTime);
  };

  const clearTeams = () => {
    setAPlayers([]);
    setBPlayers([]);
    setCPlayers([]);
    setTeamNames([]);
    setPairedPlayers([]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Stat selection and divide button */}
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

      <button onClick={dividePlayers}>
        Split Into Teams
      </button>

      <div className="players-group">
        {/* A Players List */}
        <div>
          <h4>A Players</h4>
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
          <FontAwesomeIcon 
            icon={faShuffle} 
            onClick={() => shufflePlayers(setAPlayers, aPlayers, 'aPlayers')} 
            className={`shuffle-icon ${activeShuffle === 'aPlayers' ? 'shuffling' : ''}`}
            title="Shuffle"
          />
        </div>

        {/* B Players List */}
        <div>
          <h4>B Players</h4>
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
          <FontAwesomeIcon 
            icon={faShuffle} 
            onClick={() => shufflePlayers(setBPlayers, bPlayers, 'bPlayers')} 
            className={`shuffle-icon ${activeShuffle === 'bPlayers' ? 'shuffling' : ''}`}
            title="Shuffle"
          />
        </div>

        {/* C Players List */}
        <div>
          <h4>C Players</h4>
          <ul className="droppable-area">
            {cPlayers.map((player, index) => (
              <PlayerCard
                key={player.name}
                player={player}
                index={index}
                swapPlayers={swapPlayers}
                listType="cPlayers"
                statValue={getPlayerStat(player)}
              />
            ))}
          </ul>
          <FontAwesomeIcon 
            icon={faShuffle} 
            onClick={() => shufflePlayers(setCPlayers, cPlayers, 'cPlayers')} 
            className={`shuffle-icon ${activeShuffle === 'cPlayers' ? 'shuffling' : ''}`}
            title="Shuffle"
          />
        </div>

        {/* Team Names */}
        <div>
          <h4>Teams</h4>
          <ul>
            {teamNames.map((team, index) => (
              <li key={index} className="team-card">
                {team}
              </li>
            ))}
          </ul>
          <FontAwesomeIcon 
            icon={faTrash}
            onClick={clearTeams}
            className="shuffle-icon"
            title="Clear Teams"
          />
        </div>
      </div>
      <TournamentHelper 
          teamData={{ 
            teams: teamNames, 
            players: pairedPlayers // Pass paired players here
          }} 
        />
    </DndProvider>
  );
};

export default ABCTriosDraw;
