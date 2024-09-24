import React, { useState, useEffect, useRef, useCallback } from 'react';
import PlayerStatsUploader from './tournamentTools/PlayerStatsUploader';
import PlayerList from './tournamentTools/PlayerList';
import TournamentPlayers from './tournamentTools/TournamentPlayers';
import TournamentSettings from './tournamentTools/TournamentSettings';
import TournamentMoney from './tournamentTools/TournamentMoney';

const TournamentTools = () => {
  const resetFunctionsRef = useRef([]);

  const isTesting = false;
  const [authenticated, setAuthenticated] = useState(() => isTesting || sessionStorage.getItem('authenticated') === 'true');
  const [password, setPassword] = useState('');

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    clearMessages();
    if (isTesting) {
      setAuthenticated(true);
      sessionStorage.setItem('authenticated', 'true');
      handleMessage('Authentication bypassed for testing.', 'success');
    } else if (password === 'your-password') {
      setAuthenticated(true);
      sessionStorage.setItem('authenticated', 'true');
      handleMessage('Login successful!', 'success');
    } else {
      handleMessage('Incorrect password. Please try again.', 'error');
    }
  };

  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [info, setInfo] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);

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

  useEffect(() => {
    if (error || warning || info || success) {
      setFadeOut(false);
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(clearMessages, 1000);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, warning, info, success]);

  const [tournamentPlayers, setTournamentPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem('tournamentPlayers');
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });

  const addTournamentPlayer = useCallback((player) => {
    setTournamentPlayers((prevPlayers) => {
      if (!prevPlayers.some((p) => p.name === player.name)) {
        const updatedPlayers = [...prevPlayers, player];
        localStorage.setItem('tournamentPlayers', JSON.stringify(updatedPlayers));
        return updatedPlayers;
      }
      return prevPlayers;
    });
  }, []);

  const removeTournamentPlayer = useCallback((player) => {
    setTournamentPlayers((prevPlayers) => {
      const updatedPlayers = prevPlayers.filter((p) => p.name !== player.name);
      localStorage.setItem('tournamentPlayers', JSON.stringify(updatedPlayers));
      return updatedPlayers;
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('tournamentPlayers', JSON.stringify(tournamentPlayers));
  }, [tournamentPlayers]);

  const [parseResult, setParseResult] = useState(() => {
    const savedData = localStorage.getItem('parseResult');
    return savedData ? JSON.parse(savedData) : null;
  });

  const clearLocalStorage = () => {
    clearMessages();
    const parseResultData = localStorage.getItem('parseResult');
    const parseDateData = localStorage.getItem('parseDate');
    localStorage.clear();
    resetFunctionsRef.current.forEach(reset => reset());

    if (parseResultData) {
      localStorage.setItem('parseResult', parseResultData);
      setParseResult(JSON.parse(parseResultData));
    }
    if (parseDateData) {
      localStorage.setItem('parseDate', parseDateData);
    }

    handleMessage('All settings have been cleared.', 'success');
  };

  const registerResetFunction = (resetFunction) => {
    resetFunctionsRef.current.push(resetFunction);
  };

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

  const renderTools = () => (
    <>
      <button onClick={clearLocalStorage} className="clear-storage-button">
        Clear All Settings
      </button>

      <div className="tournament-tools-sections">
        <div className="section-container">
          <PlayerStatsUploader handleMessage={handleMessage} parseResult={parseResult} />
        </div>
        <div className="section-container">
          <TournamentMoney handleMessage={handleMessage} tournamentPlayers={tournamentPlayers} registerResetFunction={registerResetFunction} />
        </div>

        <div className="section-container">
          <PlayerList handleMessage={handleMessage} addTournamentPlayer={addTournamentPlayer} tournamentPlayers={tournamentPlayers} registerResetFunction={registerResetFunction} />
        </div>
        <div className="section-container">
          <TournamentPlayers handleMessage={handleMessage} tournamentPlayers={tournamentPlayers} setTournamentPlayers={setTournamentPlayers} addTournamentPlayer={addTournamentPlayer} removeTournamentPlayer={removeTournamentPlayer} registerResetFunction={registerResetFunction} />
        </div>
        <div className="section-container">
          <TournamentSettings handleMessage={handleMessage} tournamentPlayers={tournamentPlayers} registerResetFunction={registerResetFunction} />
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
