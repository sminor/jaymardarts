import React, { useState, useEffect, useCallback } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import TournamentHelper from '../TournamentHelper';

const ItemType = 'PLAYER';

const PlayerCard = ({ player, index, swapPlayers, listType }) => {
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
      {player.name}
    </li>
  );
};

const BlindDraw = ({ tournamentPlayers }) => {
  const [player1List, setPlayer1List] = useState(() => {
    const saved = localStorage.getItem('player1List');
    return saved ? JSON.parse(saved) : [];
  });

  const [player2List, setPlayer2List] = useState(() => {
    const saved = localStorage.getItem('player2List');
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
    localStorage.setItem('player1List', JSON.stringify(player1List));
    localStorage.setItem('player2List', JSON.stringify(player2List));
    localStorage.setItem('teamNames', JSON.stringify(teamNames));
    localStorage.setItem('pairedPlayers', JSON.stringify(pairedPlayers));
  }, [player1List, player2List, teamNames, pairedPlayers]);

  // Shuffle players and divide into two lists
  const generateTeams = useCallback(() => {
    const shuffledPlayers = [...tournamentPlayers];
    for (let i = shuffledPlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
    }

    const middleIndex = Math.ceil(shuffledPlayers.length / 2);
    const newPlayer1List = shuffledPlayers.slice(0, middleIndex);
    const newPlayer2List = shuffledPlayers.slice(middleIndex);

    setPlayer1List(newPlayer1List);
    setPlayer2List(newPlayer2List);
    generateTeamsAndPairs(newPlayer1List, newPlayer2List);
  }, [tournamentPlayers]);

  // Generate team names and paired players (just like ABDraw)
  const generateTeamsAndPairs = (player1List, player2List) => {
    const teams = [];
    const pairs = [];

    for (let i = 0; i < player1List.length; i++) {
      const player1Name = player1List[i]?.name || ''; // Full name
      const player2Name = player2List[i]?.name || ''; // Full name

      teams.push(`${player1Name.split(' ')[0]} and ${player2Name.split(' ')[0]}`);
      pairs.push([player1Name, player2Name]); // Full names
    }

    setTeamNames(teams);
    setPairedPlayers(pairs);
  };

  // Swap players between the lists and update team names
  const swapPlayers = (fromIndex, toIndex, fromListType, toListType) => {
    let updatedPlayer1List = [...player1List];
    let updatedPlayer2List = [...player2List];

    if (fromListType === toListType) {
      const listSetter = fromListType === 'player1List' ? setPlayer1List : setPlayer2List;
      const players = fromListType === 'player1List' ? updatedPlayer1List : updatedPlayer2List;
      [players[fromIndex], players[toIndex]] = [players[toIndex], players[fromIndex]];
      listSetter([...players]);
    } else {
      // Swap between Player1 and Player2 lists
      const fromPlayers = fromListType === 'player1List' ? updatedPlayer1List : updatedPlayer2List;
      const toPlayers = toListType === 'player1List' ? updatedPlayer1List : updatedPlayer2List;

      [fromPlayers[fromIndex], toPlayers[toIndex]] = [toPlayers[toIndex], fromPlayers[fromIndex]];

      setPlayer1List([...updatedPlayer1List]);
      setPlayer2List([...updatedPlayer2List]);
    }

    generateTeamsAndPairs(updatedPlayer1List, updatedPlayer2List);
  };

  const clearTeams = () => {
    setPlayer1List([]);
    setPlayer2List([]);
    setTeamNames([]);
    setPairedPlayers([]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <button onClick={generateTeams}>
        Generate Teams
      </button>

      <div className="players-group">
        {/* Player 1 List */}
        <div>
          <h4>Player 1</h4>
          <ul className="droppable-area">
            {player1List.map((player, index) => (
              <PlayerCard
                key={player.name}
                player={player}
                index={index}
                swapPlayers={swapPlayers}
                listType="player1List"
              />
            ))}
          </ul>
        </div>

        {/* Player 2 List */}
        <div>
          <h4>Player 2</h4>
          <ul className="droppable-area">
            {player2List.map((player, index) => (
              <PlayerCard
                key={player.name}
                player={player}
                index={index}
                swapPlayers={swapPlayers}
                listType="player2List"
              />
            ))}
          </ul>
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

export default BlindDraw;
