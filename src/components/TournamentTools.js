import React, { useState, useEffect, useRef, useCallback } from 'react';
import PlayerStatsUploader from './tournamentTools/PlayerStatsUploader';
import PlayerList from './tournamentTools/PlayerList';
import TournamentPlayers from './tournamentTools/TournamentPlayers';
import TournamentSettings from './tournamentTools/TournamentSettings';
import TournamentMoney from './tournamentTools/TournamentMoney';

const TournamentTools = () => {
  const resetFunctionsRef = useRef([]);

  // Authentication state
  const [authenticated, setAuthenticated] = useState(() => {
    const authState = sessionStorage.getItem('authenticated');
    return authState === 'true';
  });
  const [password, setPassword] = useState('');

  // State to manage players added to the current tournament
  const [tournamentPlayers, setTournamentPlayers] = useState([]);

  // State to manage parse result
  const [parseResult, setParseResult] = useState(() => {
    const savedData = localStorage.getItem('parseResult');
    return savedData ? JSON.parse(savedData) : null;
  });

  // Message handling state
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [info, setInfo] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);

  // Handle message fade out effect
  useEffect(() => {
    if (error || warning || info || success) {
      setFadeOut(false);
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          clearMessages();
        }, 1000);
      }, 3000); // Display message for 3 seconds before fading out
      return () => clearTimeout(timer);
    }
  }, [error, warning, info, success]);

  // Add a player to the tournament list if not already added
  const addTournamentPlayer = useCallback((player) => {
    setTournamentPlayers((prevPlayers) => {
      const playerExists = prevPlayers.some((p) => p.name === player.name);
      if (!playerExists) {
        const updatedPlayers = [...prevPlayers, player];
        localStorage.setItem('tournamentPlayers', JSON.stringify(updatedPlayers));
        return updatedPlayers;
      }
      return prevPlayers;
    });
  }, []);

  // Remove a player from the tournament list
  const removeTournamentPlayer = useCallback((player) => {
    setTournamentPlayers((prevPlayers) => {
      const updatedPlayers = prevPlayers.filter((p) => p.name !== player.name);
      localStorage.setItem('tournamentPlayers', JSON.stringify(updatedPlayers));
      return updatedPlayers;
    });
  }, []);

  // Handle messaging
  const clearMessages = () => {
    setError(null);
    setWarning(null);
    setInfo(null);
    setSuccess(null);
  };

  const handleMessage = (text, type) => {
    switch (type) {
      case 'error':
        setError(text);
        break;
      case 'warning':
        setWarning(text);
        break;
      case 'info':
        setInfo(text);
        break;
      case 'success':
        setSuccess(text);
        break;
      default:
        setInfo(text);
    }
  };

  // Handle authentication
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    clearMessages();
    if (password === process.env.REACT_APP_OPERATOR_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem('authenticated', 'true');
      handleMessage('Login successful!', 'success');
    } else {
      handleMessage('Incorrect password. Please try again.', 'error');
    }
  };

  // Clear local storage except player data and reset state
  const clearLocalStorage = () => {
    clearMessages();

    // Retrieve the parseResult and parseDate data
    const parseResultData = localStorage.getItem('parseResult');
    const parseDateData = localStorage.getItem('parseDate');

    // Clear all localStorage items
    localStorage.clear();

    // Call each reset function directly
    resetFunctionsRef.current.forEach(reset => reset());

    // Restore the parseResult data back to localStorage
    if (parseResultData) {
      localStorage.setItem('parseResult', parseResultData);
      setParseResult(JSON.parse(parseResultData)); // Update the parseResult state
    } else {
      setParseResult(null); // Clear the parse result state if not found
    }

    // Restore the parseDate back to localStorage
    if (parseDateData) {
      localStorage.setItem('parseDate', parseDateData);
    }

    handleMessage('All settings have been cleared.', 'success');
  };

  // Register reset function
  const registerResetFunction = (resetFunction) => {
    resetFunctionsRef.current.push(resetFunction);
  };


  // Render the authentication form
  const renderAuthForm = () => (
    <div className="auth-container">
      <h2>Please enter the password to access this page</h2>
      <form onSubmit={handlePasswordSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearMessages();
          }}
          placeholder="Password"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );

  // Render the main tools
  const renderTools = () => (
    <>
      <button onClick={clearLocalStorage} className="clear-storage-button">
        Clear All Settings
      </button>

      <div className="tournament-tools-sections top-row">
        <div className="section-container">
          <PlayerStatsUploader 
            handleMessage={handleMessage} 
            parseResult={parseResult}
          />
        </div>
        <div className="section-container">
          <TournamentMoney
            handleMessage={handleMessage}
            tournamentPlayers={tournamentPlayers}
            registerResetFunction={registerResetFunction}
          />
        </div>
      </div>

      <div className="tournament-tools-sections bottom-row">
        <div className="section-container">
          <PlayerList 
            handleMessage={handleMessage} 
            addTournamentPlayer={addTournamentPlayer}
            registerResetFunction={registerResetFunction} 
          />
        </div>
        <div className="section-container">
          <TournamentPlayers 
            handleMessage={handleMessage} 
            tournamentPlayers={tournamentPlayers}
            setTournamentPlayers={setTournamentPlayers} 
            addTournamentPlayer={addTournamentPlayer}
            removeTournamentPlayer={removeTournamentPlayer}
            registerResetFunction={registerResetFunction}
          />
        </div>
        <div className="section-container">
          <TournamentSettings 
            handleMessage={handleMessage} 
            tournamentPlayers={tournamentPlayers}
            registerResetFunction={registerResetFunction}
          />
        </div>
      </div>
    </>
  );

  return (
    <div className="tournament-tools-container">
      <h1>JayMar Tournament Tools</h1>
      
      <div className="messages-container">
        {error && <p className={`message error-message ${fadeOut ? 'fade-out' : ''}`}>{error}</p>}
        {warning && <p className={`message warning-message ${fadeOut ? 'fade-out' : ''}`}>{warning}</p>}
        {info && <p className={`message info-message ${fadeOut ? 'fade-out' : ''}`}>{info}</p>}
        {success && <p className={`message success-message ${fadeOut ? 'fade-out' : ''}`}>{success}</p>}
      </div>
      
      {!authenticated ? renderAuthForm() : renderTools()}
    </div>
  );
};

export default TournamentTools;
