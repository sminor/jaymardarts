import React, { useState, useEffect, useCallback } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faShuffle, faTrash } from '@fortawesome/free-solid-svg-icons';
import LeagueManagementWindow from '../LeagueManagementWindow'; // Import LeagueManagementWindow

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
    <li ref={(node) => ref(drop(node))} className="player-card">
      {player.name} ({statValue.toFixed(2)})
    </li>
  );
};

const ABDraw = ({ tournamentPlayers }) => {
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

  const [pairedPlayers, setPairedPlayers] = useState([]); // New state for player pairs
  const [copySuccess, setCopySuccess] = useState(null);
  const [activeShuffle, setActiveShuffle] = useState(null);
  const [showLeagueWindow, setShowLeagueWindow] = useState(false); // New state for the LeagueManagementWindow

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedStat', selectedStat);
  }, [selectedStat]);

  useEffect(() => {
    localStorage.setItem('aPlayers', JSON.stringify(aPlayers));
    localStorage.setItem('bPlayers', JSON.stringify(bPlayers));
    localStorage.setItem('teamNames', JSON.stringify(teamNames));
  }, [aPlayers, bPlayers, teamNames]);

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

  // Divide players into A and B groups based on the selected stat
  const dividePlayers = useCallback(() => {
    const sortedPlayers = [...tournamentPlayers].sort((a, b) => {
      const statA = getPlayerStat(a);
      const statB = getPlayerStat(b);
      return statB - statA;
    });

    const middleIndex = Math.ceil(sortedPlayers.length / 2);
    const newAPlayers = sortedPlayers.slice(0, middleIndex);
    const newBPlayers = sortedPlayers.slice(middleIndex);

    setAPlayers(newAPlayers);
    setBPlayers(newBPlayers);
    generateTeamNames(newAPlayers, newBPlayers);
    generatePairedPlayers(newAPlayers, newBPlayers); // Generate player pairs
    setShowLeagueWindow(true); // Show the league window after players are divided
  }, [tournamentPlayers, getPlayerStat]);

  // Generate team names by taking the first name from each player in A and B groups
  const generateTeamNames = (aPlayersList, bPlayersList) => {
    const teams = aPlayersList.map((aPlayer, index) => {
      const aFirstName = aPlayer.name.split(' ')[0];
      const bFirstName = bPlayersList[index]?.name.split(' ')[0] || '';
      return `${aFirstName} and ${bFirstName}`.trim();
    });
    setTeamNames(teams);
  };

  // Generate paired player names from A and B groups
  const generatePairedPlayers = (aPlayersList, bPlayersList) => {
    const pairs = aPlayersList.map((aPlayer, index) => {
      const bPlayer = bPlayersList[index] || { name: '' };
      return [aPlayer.name, bPlayer.name];
    });
    setPairedPlayers(pairs); // Store pairs in state
  };

  // Swap players between the lists and update team names and paired players immediately
  const swapPlayers = (fromIndex, toIndex, fromListType, toListType) => {
    let updatedAPlayers = [...aPlayers];
    let updatedBPlayers = [...bPlayers];

    if (fromListType === toListType) {
      const listSetter = fromListType === 'aPlayers' ? setAPlayers : setBPlayers;
      const players = fromListType === 'aPlayers' ? updatedAPlayers : updatedBPlayers;
      [players[fromIndex], players[toIndex]] = [players[toIndex], players[fromIndex]];
      listSetter([...players]);
    } else {
      // Swap between A and B lists
      const fromPlayers = fromListType === 'aPlayers' ? updatedAPlayers : updatedBPlayers;
      const toPlayers = toListType === 'aPlayers' ? updatedAPlayers : updatedBPlayers;

      [fromPlayers[fromIndex], toPlayers[toIndex]] = [toPlayers[toIndex], fromPlayers[fromIndex]];

      setAPlayers([...updatedAPlayers]);
      setBPlayers([...updatedBPlayers]);
    }

    // Immediately update team names and paired players after swapping
    generateTeamNames(updatedAPlayers, updatedBPlayers);
    generatePairedPlayers(updatedAPlayers, updatedBPlayers);
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
          groupType === 'bPlayers' ? shuffled : bPlayers
        );
        generatePairedPlayers(
          groupType === 'aPlayers' ? shuffled : aPlayers,
          groupType === 'bPlayers' ? shuffled : bPlayers
        );
      }
    }, intervalTime);
  };

  const clearTeams = () => {
    setAPlayers([]);
    setBPlayers([]);
    setTeamNames([]);
    setPairedPlayers([]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess(text);
        setTimeout(() => setCopySuccess(null), 2000);
      },
      () => alert('Failed to copy!')
    );
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
        Divide Players
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

        {/* Team Names */}
        <div>
          <h4>Team Names</h4>
          <ul>
            {teamNames.map((team, index) => (
              <li key={index} className="team-card">
                {team}
                <FontAwesomeIcon 
                  icon={faCopy} 
                  onClick={() => copyToClipboard(team)} 
                  className="copy-icon"
                  title={copySuccess === team ? 'Copied!' : 'Copy'}
                />
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

      {/* Conditionally show LeagueManagementWindow after teams are generated */}
      {showLeagueWindow && (
        <LeagueManagementWindow 
          teamData={{ 
            teams: teamNames, 
            players: pairedPlayers // Pass paired players here
          }} 
        />
      )}
    </DndProvider>
  );
};

export default ABDraw;
