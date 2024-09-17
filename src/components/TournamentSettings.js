import React, { useState, useEffect } from 'react';
import ABDraw from './tournamentTypes/ABDraw';

const TournamentSettings = ({ tournamentPlayers }) => {
  const [selectedStat, setSelectedStat] = useState('combo'); // Default to combo
  const [selectedTournamentType, setSelectedTournamentType] = useState('abDraw');
  const [dividePlayersFunc, setDividePlayersFunc] = useState(null); // Store the divide function

  // Load settings from sessionStorage on component mount
  useEffect(() => {
    const savedStat = sessionStorage.getItem('selectedStat');
    const savedTournamentType = sessionStorage.getItem('selectedTournamentType');
    
    if (savedStat) setSelectedStat(savedStat);
    if (savedTournamentType) setSelectedTournamentType(savedTournamentType);
  }, []);

  // Save settings to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('selectedStat', selectedStat);
    sessionStorage.setItem('selectedTournamentType', selectedTournamentType);
  }, [selectedStat, selectedTournamentType]);

  // Render the appropriate tournament type component
  const renderTournamentType = () => {
    switch (selectedTournamentType) {
      case 'abDraw':
        return (
          <ABDraw
            tournamentPlayers={tournamentPlayers}
            selectedStat={selectedStat}
            setDividePlayersFunc={setDividePlayersFunc} // Pass the setter function
          />
        );
      // Add cases for other tournament types as needed
      default:
        return null;
    }
  };

  return (
    <div className="tournament-settings-container">
      <h3>Tournament Settings</h3>

      {/* Select tournament type */}
      <div className="select-container">
        <label>Tournament Type:</label>
        <select value={selectedTournamentType} onChange={(e) => setSelectedTournamentType(e.target.value)}>
          <option value="abDraw">A/B Draw</option>
          {/* Add other tournament types here */}
        </select>
      </div>

      {/* Radio buttons to select the stat */}
      <div className="radio-container">
        <label>Stat to Use:</label>
        <input
          type="radio"
          name="stat"
          value="combo"
          checked={selectedStat === 'combo'}
          onChange={() => setSelectedStat('combo')}
        /> Combo
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

      {/* Divide Players Button */}
      <button onClick={dividePlayersFunc}>Divide Players</button>

      {/* Render selected tournament type */}
      {renderTournamentType()}
    </div>
  );
};

export default TournamentSettings;
