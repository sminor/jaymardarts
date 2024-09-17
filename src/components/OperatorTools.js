import React, { useState, useEffect, useCallback } from 'react';
import DataUpload from './DataUpload';
import TournamentMoney from './TournamentMoney';
import PlayerRoster from './PlayerRoster';
import TournamentPlayers from './TournamentPlayers';
import TournamentSettings from './TournamentSettings';

const OperatorTools = () => {
  const [players, setPlayers] = useState([]);
  const [tournamentPlayers, setTournamentPlayers] = useState([]);
  const [generatedDate, setGeneratedDate] = useState('N/A');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(null); // For displaying errors
  const [resetABDraw, setResetABDraw] = useState(() => () => {}); // Initialize with a no-op function

  // Number of retries and delay between them
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  // Helper function to delay execution
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Function to fetch and parse the player stats with retries
  const fetchPlayerStats = useCallback(async (retryCount = 0) => {
    try {
      // Fetch only the modified date first
      const modifiedDateResponse = await fetch('/.netlify/functions/parse-player-stats?dateOnly=true');
      const modifiedDateResult = await modifiedDateResponse.json();
      
      if (modifiedDateResponse.ok) {
        const modifiedDate = modifiedDateResult.modifiedDate;
        const storedModifiedDate = localStorage.getItem('fileModifiedDate');
  
        // Check if the file on Google Drive is newer
        if (storedModifiedDate !== modifiedDate) {
          // File is newer, fetch the full file
          const response = await fetch('/.netlify/functions/parse-player-stats');
          const result = await response.json();
          
          if (response.ok) {
            setPlayers(result.players);
            setGeneratedDate(result.generatedDate || 'N/A');
            localStorage.setItem('fileModifiedDate', modifiedDate); // Store the new modified date
            localStorage.setItem('players', JSON.stringify(result.players)); // Store players data
            localStorage.setItem('generatedDate', result.generatedDate || 'N/A'); // Store the generated date
          } else {
            console.error('Error fetching player stats:', result.error);
            setError('Error fetching player stats');
          }
        } else {
          // Load players from localStorage if no new updates
          const storedPlayers = localStorage.getItem('players');
          const storedGeneratedDate = localStorage.getItem('generatedDate');
          if (storedPlayers) {
            setPlayers(JSON.parse(storedPlayers));
            setGeneratedDate(storedGeneratedDate || 'N/A');
          }
        }
      } else {
        console.error('Error fetching modified date:', modifiedDateResult.error);
        setError('Error fetching modified date');
      }
    } catch (error) {
      console.error('Error fetching player stats:', error);
      if (retryCount < MAX_RETRIES) {
        // Retry fetching after a delay
        console.log(`Retrying fetch (${retryCount + 1}/${MAX_RETRIES})...`);
        await delay(RETRY_DELAY);
        await fetchPlayerStats(retryCount + 1);
      } else {
        setError('An error occurred while fetching player stats');
      }
    }
  }, []); // Use useCallback to prevent infinite loops

  // Check for existing authentication status and load tournamentPlayers from local storage
  useEffect(() => {
    const authStatus = sessionStorage.getItem('authenticated');
    if (authStatus === 'true') {
      setAuthenticated(true);
    }

    // Fetch player stats after checking authentication
    fetchPlayerStats();

    // Load tournamentPlayers from local storage
    const storedTournamentPlayers = localStorage.getItem('tournamentPlayers');
    if (storedTournamentPlayers) {
      setTournamentPlayers(JSON.parse(storedTournamentPlayers));
    }
  }, [fetchPlayerStats]); // Add fetchPlayerStats to dependencies

  // Save tournamentPlayers to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('tournamentPlayers', JSON.stringify(tournamentPlayers));
  }, [tournamentPlayers]);

  // Handle password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === process.env.REACT_APP_OPERATOR_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem('authenticated', 'true');
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  // Add player to tournamentPlayers
  const addPlayerToTournament = (player) => {
    if (!tournamentPlayers.some(p => p.name === player.name)) {
      setTournamentPlayers([...tournamentPlayers, player]);
    }
  };

  // Remove player from tournamentPlayers
  const removePlayerFromTournament = (player) => {
    setTournamentPlayers(tournamentPlayers.filter(p => p.name !== player.name));
  };

  // Toggle player's paid status
  const togglePaidStatus = (player) => {
    setTournamentPlayers(tournamentPlayers.map(p =>
      p.name === player.name ? { ...p, paid: !p.paid } : p
    ));
  };

  // Add new player directly
  const addNewPlayer = (newPlayer) => {
    setTournamentPlayers([...tournamentPlayers, newPlayer]);
  };

  // Clear all localStorage settings and refetch player stats
  const clearLocalStorage = () => {
    if (window.confirm('Are you sure you want to clear all settings? This action cannot be undone.')) {
      localStorage.clear();
      setTournamentPlayers([]); // Clear the tournament players in state
      setPlayers([]); // Clear the players in state
      setGeneratedDate('N/A'); // Reset the generated date
      resetABDraw(); // Call the reset function to clear ABDraw state
      fetchPlayerStats(); // Refetch player stats
      alert('All settings have been cleared and data has been reloaded.');
    }
  };

  if (!authenticated) {
    return (
      <div className="auth-container">
        <h2>Please enter the password to access this page</h2>
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }

  return (
    <div className="operator-tools-container">
      <h1>JayMar Tournament Operator Tools</h1>
      
      {/* Display error if any */}
      {error && <p className="error-message">{error}</p>}
      
      {/* Clear Local Storage Button */}
      <button onClick={clearLocalStorage} className="clear-storage-button">
        Clear All Settings
      </button>
  
      {/* Top Row: DataUpload and TournamentMoney */}
      <div className="operator-tools-sections top-row">
        {/* Data Upload Section */}
        <div className="section-container">
          <DataUpload generatedDate={generatedDate} onFileUpload={fetchPlayerStats} />
        </div>
  
        {/* Tournament Money Section */}
        <div className="section-container">
          <TournamentMoney tournamentPlayers={tournamentPlayers} />
        </div>
      </div>
  
      {/* Bottom Row: Player Roster, Tournament Players, and Tournament Settings */}
      <div className="operator-tools-sections bottom-row">
        {/* Player Roster Section */}
        <div className="section-container">
          <PlayerRoster players={players} onAddPlayer={addPlayerToTournament} />
        </div>
  
        {/* Tournament Players Section */}
        <div className="section-container">
          <TournamentPlayers 
            players={tournamentPlayers}
            onRemovePlayer={removePlayerFromTournament}
            onAddNewPlayer={addNewPlayer}
            onTogglePaid={togglePaidStatus}
          />
        </div>
  
        {/* Tournament Settings Section */}
        <div className="section-container">
          <TournamentSettings 
            tournamentPlayers={tournamentPlayers} 
            setResetABDraw={setResetABDraw} // Pass the reset function to the settings
          />
        </div>
      </div>
    </div>
  );
};

export default OperatorTools;
