import React, { useEffect, useState, useCallback } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faShuffle, faEraser } from '@fortawesome/free-solid-svg-icons';

const ItemType = 'PLAYER';

const PlayerCard = ({ player, index, swapPlayers, statValue }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    drop(item) {
      if (item.index !== index) {
        swapPlayers(item.index, index);
      }
    },
  });

  return (
    <li ref={(node) => ref(drop(node))} className="player-card">
      {player.name} ({statValue.toFixed(2)}) {/* Display stat value */}
    </li>
  );
};

const ABDraw = ({ tournamentPlayers, selectedStat, setDividePlayersFunc }) => {
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
  const [copySuccess, setCopySuccess] = useState(null);
  const [activeShuffle, setActiveShuffle] = useState(null); // Tracks which shuffle icon is active

  // Save state to local storage whenever it changes
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
        return player.ppd; // Default to PPD
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
  }, [tournamentPlayers, getPlayerStat]);

  // Generate team names by taking the first name from each player in A and B groups
  const generateTeamNames = (aPlayersList, bPlayersList) => {
    const teams = aPlayersList.map((aPlayer, index) => {
      const aFirstName = aPlayer.name.split(' ')[0];
      const bFirstName = bPlayersList[index]?.name.split(' ')[0] || '';
      return `${aFirstName} & ${bFirstName}`.trim();
    });
    setTeamNames(teams);
  };

  // Use useEffect to set the dividePlayers function when the component mounts
  useEffect(() => {
    setDividePlayersFunc(() => dividePlayers);
  }, [setDividePlayersFunc, dividePlayers]);

  // Function to swap players directly
  const swapPlayers = (listSetter, players, fromIndex, toIndex) => {
    const updatedPlayers = [...players];
    [updatedPlayers[fromIndex], updatedPlayers[toIndex]] = [updatedPlayers[toIndex], updatedPlayers[fromIndex]];
    listSetter(updatedPlayers);
    generateTeamNames(
      listSetter === setAPlayers ? updatedPlayers : aPlayers,
      listSetter === setBPlayers ? updatedPlayers : bPlayers
    );
  };

  // Function to shuffle players with animation
  const shufflePlayers = (groupSetter, players, groupType) => {
    setActiveShuffle(groupType); // Set the active shuffle icon
    const shuffleTimes = 10; // Number of shuffles
    const intervalTime = 300; // Time per shuffle
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
        setActiveShuffle(null); // Reset the active shuffle icon
        generateTeamNames(
          groupType === 'aPlayers' ? shuffled : aPlayers,
          groupType === 'bPlayers' ? shuffled : bPlayers
        );
      }
    }, intervalTime);
  };

  // Clear all players and teams
  const clearTeams = () => {
    if (window.confirm('This will clear all names and teams. Are you sure?')) {
      setAPlayers([]);
      setBPlayers([]);
      setTeamNames([]);
    }
  };

  // Copy team name to clipboard
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
                swapPlayers={(fromIndex, toIndex) => swapPlayers(setAPlayers, aPlayers, fromIndex, toIndex)}
                statValue={getPlayerStat(player)} // Pass the calculated stat value
              />
            ))}
          </ul>
          <FontAwesomeIcon 
            icon={faShuffle} 
            onClick={() => shufflePlayers(setAPlayers, aPlayers, 'aPlayers')} 
            className={`shuffle-icon ${activeShuffle === 'aPlayers' ? 'shuffling' : ''}`} // Apply shaking class if active
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
                swapPlayers={(fromIndex, toIndex) => swapPlayers(setBPlayers, bPlayers, fromIndex, toIndex)}
                statValue={getPlayerStat(player)} // Pass the calculated stat value
              />
            ))}
          </ul>
          <FontAwesomeIcon 
            icon={faShuffle} 
            onClick={() => shufflePlayers(setBPlayers, bPlayers, 'bPlayers')} 
            className={`shuffle-icon ${activeShuffle === 'bPlayers' ? 'shuffling' : ''}`} // Apply shaking class if active
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
          {/* Eraser Icon */}
          <FontAwesomeIcon 
            icon={faEraser}
            onClick={clearTeams}
            className="shuffle-icon" // Using shuffle-icon class for consistent styling
            title="Clear Teams"
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default ABDraw;
