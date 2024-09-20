import React, { useState, useEffect, useCallback } from 'react';
import ABDraw from './tournamentTypes/ABDraw';

const TournamentSettings = ({ tournamentPlayers, registerResetFunction }) => {
  // Initialize selectedType from localStorage or fallback to an empty string
  const [selectedType, setSelectedType] = useState(() => {
    const savedType = localStorage.getItem('selectedTournamentType');
    return savedType ? savedType : ''; // If no saved type, set to empty string
  });

  // Reset function to reset selectedType
  const reset = useCallback(() => {
    setSelectedType(''); // Reset the selection
  }, []);

  // Register the reset function on component mount
  useEffect(() => {
    registerResetFunction(reset);
  }, [registerResetFunction, reset]);

  // Save selectedType to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedTournamentType', selectedType);
  }, [selectedType]);

  // Handle change in tournament type
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
