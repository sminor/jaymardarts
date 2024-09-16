import React, { useState } from 'react';

const TournamentSettings = ({ tournamentPlayers }) => {
  const [selectedStat, setSelectedStat] = useState('ppd'); // State to track the selected stat
  const [aPlayers, setAPlayers] = useState([]);
  const [bPlayers, setBPlayers] = useState([]);
  const [teamNames, setTeamNames] = useState([]);

  // Divide players into A and B groups based on the selected stat
  const dividePlayers = () => {
    const sortedPlayers = [...tournamentPlayers].sort((a, b) => b[selectedStat] - a[selectedStat]);
    const middleIndex = Math.ceil(sortedPlayers.length / 2);
    const newAPlayers = sortedPlayers.slice(0, middleIndex);
    const newBPlayers = sortedPlayers.slice(middleIndex);
    setAPlayers(newAPlayers);
    setBPlayers(newBPlayers);
    generateTeamNames(newAPlayers, newBPlayers);
  };

  // Randomize the players in a group and update the team names
  const randomizePlayers = (groupSetter, groupA, groupB) => {
    groupSetter((players) => {
      const shuffled = [...players];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      // After randomizing, update the corresponding group and team names
      if (groupSetter === setAPlayers) {
        generateTeamNames(shuffled, groupB);
      } else {
        generateTeamNames(groupA, shuffled);
      }
      return shuffled;
    });
  };

  // Generate team names by taking the first name from each player in A and B groups
  const generateTeamNames = (aPlayersList, bPlayersList) => {
    const teams = aPlayersList.map((aPlayer, index) => {
      const aFirstName = aPlayer.name.split(' ')[0]; // Extract the first name from A player
      const bFirstName = bPlayersList[index]?.name.split(' ')[0] || ''; // Extract the first name from B player if available
      return `${aFirstName} & ${bFirstName}`.trim();
    });
    setTeamNames(teams);
  };

  return (
    <div className="tournament-settings-container">
      <h3>Tournament Settings</h3>

      {/* Select tournament type */}
      <div className="select-container">
        <label>Tournament Type:</label>
        <select>
          <option value="abDraw">A/B Draw</option>
          {/* Add other tournament types here as needed */}
        </select>
      </div>

      {/* Radio buttons to select the stat and 'Divide Players' button */}
      <div className="divide-players-container">
        <div className="radio-container">
          <label>Stat to Use:</label>
          <input
            type="radio"
            name="stat"
            value="ppd"
            checked={selectedStat === 'ppd'}
            onChange={() => setSelectedStat('ppd')}
          /> PPD
          <input
            type="radio"
            name="stat"
            value="mpr"
            checked={selectedStat === 'mpr'}
            onChange={() => setSelectedStat('mpr')}
          /> MPR
        </div>
        <button onClick={dividePlayers}>Divide Players</button>
      </div>

      {/* Display A, B groups and Team Names */}
      <div className="players-group">
        <div>
          <h4>A Players</h4>
          <ul>
            {aPlayers.map((player, index) => (
              <li key={index}>{player.name}</li>
            ))}
          </ul>
          <button onClick={() => randomizePlayers(setAPlayers, aPlayers, bPlayers)}>Randomize</button>
        </div>
        <div>
          <h4>B Players</h4>
          <ul>
            {bPlayers.map((player, index) => (
              <li key={index}>{player.name}</li>
            ))}
          </ul>
          <button onClick={() => randomizePlayers(setBPlayers, aPlayers, bPlayers)}>Randomize</button>
        </div>
        <div>
          <h4>Team Names</h4>
          <ul>
            {teamNames.map((team, index) => (
              <li key={index}>{team}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TournamentSettings;
