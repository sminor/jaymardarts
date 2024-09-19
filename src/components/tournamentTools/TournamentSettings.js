import React, { useState, useEffect, useCallback } from 'react';
import ABDraw from './tournamentTypes/ABDraw';

const TournamentSettings = ({ tournamentPlayers, registerResetFunction }) => {
  const [selectedType, setSelectedType] = useState('');

  const reset = useCallback(() => {
    setSelectedType('');
  }, []);

  useEffect(() => {
    registerResetFunction(reset);
  }, [registerResetFunction, reset]);

  // Load selectedType from localStorage on component mount
  useEffect(() => {
    const savedType = localStorage.getItem('selectedTournamentType');
    if (savedType) {
      setSelectedType(savedType);
    }
  }, []);

  // Save selectedType to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedTournamentType', selectedType);
  }, [selectedType]);

  // Handle the change in tournament type selection
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  return (
    <div className="tournament-settings-container">
      <h2>Tournament Settings</h2>

      {/* Select tournament type */}
      <div className="select-container">
        <label>Tournament Type:</label>
        <select onChange={handleTypeChange} value={selectedType}>
          <option value="">--- Please Select ---</option>
          <option value="abDraw">A/B Draw</option>
          {/* Add other tournament types here */}
        </select>
      </div>

      {/* Render selected tournament type */}
      {selectedType === 'abDraw' && (
        <ABDraw tournamentPlayers={tournamentPlayers} />
      )}

      {/* Add future tournament types as needed */}
    </div>
  );
};

export default TournamentSettings;
