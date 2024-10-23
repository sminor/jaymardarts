import React, { useState, useEffect, useCallback } from 'react';
import ABDraw from './tournamentTypes/ABDraw';
import BlindDraw from './tournamentTypes/BlindDraw';
import ABCTriosDraw from './tournamentTypes/ABCTriosDraw';
import Bring from './tournamentTypes/Bring';
import Parity from './tournamentTypes/Parity';

const TournamentSettings = ({ tournamentPlayers, registerResetFunction }) => {
  const [selectedType, setSelectedType] = useState(() => {
    const savedType = localStorage.getItem('selectedTournamentType');
    return savedType ? savedType : ''; 
  });

  const reset = useCallback(() => {
    setSelectedType(''); 
  }, []);

  useEffect(() => {
    registerResetFunction(reset);
  }, [registerResetFunction, reset]);

  useEffect(() => {
    localStorage.setItem('selectedTournamentType', selectedType);
  }, [selectedType]);

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
          <option value="blindDraw">Blind Draw</option>
          <option value="abcTriosDraw">A/B/C Trios Draw</option>
          <option value="bring">Partner Bring</option>
          <option value="parity">Parity/Low Player Pick</option>
        </select>
      </div>

      {/* Render selected tournament type */}
      {selectedType === 'abDraw' && (
        <ABDraw tournamentPlayers={tournamentPlayers} />
      )}
      {selectedType === 'blindDraw' && (
        <BlindDraw tournamentPlayers={tournamentPlayers} />
      )}
      {selectedType === 'abcTriosDraw' && (
        <ABCTriosDraw tournamentPlayers={tournamentPlayers} />
      )}
      {selectedType === 'bring' && (
        <Bring tournamentPlayers={tournamentPlayers} />
      )}
      {selectedType === 'parity' && (
        <Parity tournamentPlayers={tournamentPlayers} />
      )}
    </div>
  );
};

export default TournamentSettings;
