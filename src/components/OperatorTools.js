import React, { useState, useEffect } from 'react';
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

  // Check for existing authentication status in sessionStorage on component mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('authenticated');
    if (authStatus === 'true') {
      setAuthenticated(true);
    }
  }, []);

  // Load tournament players from sessionStorage on mount
  useEffect(() => {
    const savedPlayers = sessionStorage.getItem('tournamentPlayers');
    if (savedPlayers) {
      setTournamentPlayers(JSON.parse(savedPlayers));
    }
  }, []);

  // Save tournament players to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('tournamentPlayers', JSON.stringify(tournamentPlayers));
  }, [tournamentPlayers]);

  // Function to fetch and parse the player stats
  const fetchPlayerStats = async () => {
    try {
      const response = await fetch('/.netlify/functions/parse-player-stats');
      const result = await response.json();
      if (response.ok) {
        setPlayers(result.players);
        setGeneratedDate(result.generatedDate || 'N/A');
      } else {
        console.error('Error fetching player stats:', result.error);
      }
    } catch (error) {
      console.error('Error fetching player stats:', error);
    }
  };

  // Handle adding a player to the tournament
  const addPlayerToTournament = (player) => {
    if (!tournamentPlayers.some(p => p.name === player.name)) {
      setTournamentPlayers([...tournamentPlayers, { ...player, paid: false }]);
    }
  };

  // Handle adding a new player directly
  const onAddNewPlayer = (newPlayer) => {
    setTournamentPlayers([...tournamentPlayers, newPlayer]);
  };

  // Handle removing a player from the tournament
  const removePlayerFromTournament = (player) => {
    setTournamentPlayers(tournamentPlayers.filter(p => p.name !== player.name));
  };

  // Toggle player's paid status
  const togglePaidStatus = (player) => {
    setTournamentPlayers(tournamentPlayers.map(p =>
      p.name === player.name ? { ...p, paid: !p.paid } : p
    ));
  };

  // Fetch player stats on component mount
  useEffect(() => {
    fetchPlayerStats();
  }, []);

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
  
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Data Upload Section */}
        <DataUpload generatedDate={generatedDate} onFileUpload={fetchPlayerStats} />
  
        {/* Tournament Money Section */}
        <TournamentMoney tournamentPlayers={tournamentPlayers} />
      </div>
  
      <div className="operator-tools-sections">
        {/* Player Roster Section */}
        <div className="section-container">
          <PlayerRoster players={players} onAddPlayer={addPlayerToTournament} />
        </div>
  
        {/* Tournament Players Section */}
        <div className="section-container">
          <TournamentPlayers
            players={tournamentPlayers}
            onRemovePlayer={removePlayerFromTournament}
            onTogglePaid={togglePaidStatus}
            onAddNewPlayer={onAddNewPlayer}
          />
        </div>
  
        {/* Tournament Settings Section */}
        <div className="section-container">
          <TournamentSettings tournamentPlayers={tournamentPlayers} />
        </div>
      </div>
    </div>
  );
};

export default OperatorTools;
