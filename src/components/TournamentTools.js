import React, { useState, useEffect } from 'react';
import PlayerStatsUploader from './tournamentTools/PlayerStatsUploader';

const TournamentTools = () => {
  // Initialize authentication state based on session storage
  const [authenticated, setAuthenticated] = useState(() => {
    const authState = sessionStorage.getItem('authenticated');
    return authState === 'true';
  });

  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [info, setInfo] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (error || warning || info || success) {
      setFadeOut(false);
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setError(null);
          setWarning(null);
          setInfo(null);
          setSuccess(null);
        }, 1000); // Match the duration of the CSS transition
      }, 3000); // Display message for 3 seconds before fading out
      return () => clearTimeout(timer);
    }
  }, [error, warning, info, success]);

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

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    clearMessages();
    if (password === process.env.REACT_APP_OPERATOR_PASSWORD) {
      setAuthenticated(true);
      // Save authentication state to session storage
      sessionStorage.setItem('authenticated', 'true');
      handleMessage('Login successful!', 'success');
    } else {
      handleMessage('Incorrect password. Please try again.', 'error');
    }
  };

  const clearLocalStorage = () => {
    clearMessages();
    localStorage.clear();
    handleMessage('All settings have been cleared.', 'success');
  };

  return (
    <div className="tournament-tools-container">
      <h1>JayMar Tournament Tools</h1>
      
      <div className="messages-container">
        {error && <p className={`message error-message ${fadeOut ? 'fade-out' : ''}`}>{error}</p>}
        {warning && <p className={`message warning-message ${fadeOut ? 'fade-out' : ''}`}>{warning}</p>}
        {info && <p className={`message info-message ${fadeOut ? 'fade-out' : ''}`}>{info}</p>}
        {success && <p className={`message success-message ${fadeOut ? 'fade-out' : ''}`}>{success}</p>}
      </div>
      
      {!authenticated ? (
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
      ) : (
        <>
          <button onClick={clearLocalStorage} className="clear-storage-button">
            Clear All Settings
          </button>
  
          <div className="tournament-tools-sections top-row">
            <div className="section-container">
              <PlayerStatsUploader handleMessage={handleMessage} />
            </div>
            <div className="section-container">
              {/* Additional content can go here */}
            </div>
          </div>
  
          <div className="tournament-tools-sections bottom-row">
            <div className="section-container">
              {/* Additional content can go here */}
            </div>
            <div className="section-container">
              {/* Additional content can go here */}
            </div>
            <div className="section-container">
              {/* Additional content can go here */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TournamentTools;