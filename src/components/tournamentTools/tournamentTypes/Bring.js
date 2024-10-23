import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
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
      {player.name} {/* Ensure we render the name string */}
    </li>
  );
};

const Bring = ({ tournamentPlayers }) => {
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

  // Generate teams, alternating between Player 1 and Player 2
  const generateTeams = useCallback(() => {
    const player1Temp = [];
    const player2Temp = [];
    const teamsTemp = [];

    tournamentPlayers.forEach((player, index) => {
      if (index % 2 === 0) {
        player1Temp.push(player);
      } else {
        player2Temp.push(player);
      }
    });

    while (player2Temp.length < player1Temp.length) {
      player2Temp.push({ name: '' }); // Ensure Player 2 list matches Player 1 length
    }

    player1Temp.forEach((player1, index) => {
      const player2 = player2Temp[index];
      teamsTemp.push(`${player1.name.split(' ')[0]} and ${player2.name.split(' ')[0]}`.trim());
    });

    setPlayer1List(player1Temp);
    setPlayer2List(player2Temp);
    setTeamNames(teamsTemp);
    setPairedPlayers(player1Temp.map((player, index) => [player.name, player2Temp[index].name]));
  }, [tournamentPlayers]);

  // Swap players between lists and update team names
  const swapPlayers = (fromIndex, toIndex, fromListType, toListType) => {
    const updatedPlayer1List = [...player1List];
    const updatedPlayer2List = [...player2List];

    if (fromListType === toListType) {
      // Swap within the same list
      const list = fromListType === 'player1List' ? updatedPlayer1List : updatedPlayer2List;
      [list[fromIndex], list[toIndex]] = [list[toIndex], list[fromIndex]];
    } else {
      // Swap between Player 1 and Player 2 lists
      if (fromListType === 'player1List') {
        [updatedPlayer1List[fromIndex], updatedPlayer2List[toIndex]] = [
          updatedPlayer2List[toIndex],
          updatedPlayer1List[fromIndex],
        ];
      } else {
        [updatedPlayer2List[fromIndex], updatedPlayer1List[toIndex]] = [
          updatedPlayer1List[toIndex],
          updatedPlayer2List[fromIndex],
        ];
      }
    }

    setPlayer1List(updatedPlayer1List);
    setPlayer2List(updatedPlayer2List);
    generateTeamsAndPairs(updatedPlayer1List, updatedPlayer2List);
  };

  // Generate team names and paired players
  const generateTeamsAndPairs = (player1List, player2List) => {
    const teams = [];
    const pairs = [];

    player1List.forEach((player1, index) => {
      const player2 = player2List[index] || { name: '' };
      teams.push(`${player1.name.split(' ')[0]} and ${player2.name.split(' ')[0]}`.trim());
      pairs.push([player1.name, player2.name]);
    });

    setTeamNames(teams);
    setPairedPlayers(pairs);
  };

  const clearTeams = () => {
    setPlayer1List([]);
    setPlayer2List([]);
    setTeamNames([]);
    setPairedPlayers([]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <button onClick={generateTeams}>Generate Teams</button>

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
          players: pairedPlayers, // Pass paired players here
        }}
      />
    </DndProvider>
  );
};

export default Bring;
