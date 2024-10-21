import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // Supabase client
import TournamentSettings from './TournamentSettings';
import TournamentPlayers from './TournamentPlayers';
import TournamentMoney from './TournamentMoney';

const TournamentPage = () => {
  const { id } = useParams(); // Capture the tournament ID from the URL
  const [activeTab, setActiveTab] = useState('Tournament'); // Track the active tab
  const [tournamentName, setTournamentName] = useState(''); // State to store tournament name
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for handling errors

  // Fetch the tournament details
  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('tournaments')
          .select('name')
          .eq('id', id)
          .single();

        if (error) throw error;
        setTournamentName(data.name); // Set the tournament name
      } catch (error) {
        setError('Error fetching tournament details');
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentDetails();
  }, [id]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Tournament':
        return <TournamentPlayers tournamentId={id} />;
      case 'Money':
        return <TournamentMoney tournamentId={id} />;
      case 'Settings':
        return <TournamentSettings tournamentId={id} />;
      default:
        return <TournamentPlayers tournamentId={id} />;
    }
  };

  if (loading) return <p>Loading tournament details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="tournament-page-container">
      <header>
        <h1>JayMar Tournament Tools</h1>
        <h2>{tournamentName}</h2> {/* Display the tournament name */}
      </header>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'Tournament' ? 'active' : ''}`}
          onClick={() => setActiveTab('Tournament')}
        >
          Tournament
        </button>
        <button
          className={`tab-button ${activeTab === 'Money' ? 'active' : ''}`}
          onClick={() => setActiveTab('Money')}
        >
          Money
        </button>
        <button
          className={`tab-button ${activeTab === 'Settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('Settings')}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TournamentPage;
