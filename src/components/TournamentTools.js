import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faPlay } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../supabaseClient';
import CreateTournament from './tournamentTools/CreateTournament';

const TournamentTools = () => {
  const [activeTournaments, setActiveTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const isCreatingTournament = params.get('create') === 'true';

  // Fetch active tournaments from Supabase
  useEffect(() => {
    const fetchActiveTournaments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('tournaments')
        .select('id, name')
        .eq('is_active', true);

      if (error) {
        setError('Error fetching active tournaments.');
        console.error('Error fetching active tournaments:', error);
      } else {
        setActiveTournaments(data);
      }
      setLoading(false);
    };

    fetchActiveTournaments();
  }, []);

  const handleTournamentSelect = (e) => {
    const selectedValue = e.target.value;
    setSelectedTournament(selectedValue);
    console.log(`Selected tournament: ${selectedValue}`); // Log the selected tournament
  };

  const handleResumeTournament = () => {
    if (selectedTournament) {
      console.log(`Navigating to /tournament-tools/${selectedTournament}`); // Log the navigation action
      navigate(`/tournament-tools/${selectedTournament}`);
    } else {
      console.log('No tournament selected.');
    }
  };

  return (
    <div className="tournament-tools-container">
      <header>
        <h1>JayMar Tournament Tools</h1>
      </header>

      <div className="tournament-options-section">
        {isCreatingTournament ? (
          <CreateTournament />
        ) : (
          <>
            <div className="start-tournament">
              <h2>Start New Tournament</h2>
              <button
                className="create-tournament-btn"
                onClick={() => navigate('/tournament-tools?create=true')}
              >
                <FontAwesomeIcon icon={faPlusCircle} /> Create Tournament
              </button>
            </div>

            <div className="divider">
              <span>or</span>
            </div>

            <div className="active-tournaments">
              <h2>Resume Existing Tournament</h2>

              {loading ? (
                <p>Loading tournaments...</p>
              ) : error ? (
                <p>{error}</p>
              ) : activeTournaments.length > 0 ? (
                <div className="tournament-dropdown-container">
                  <select
                    className="tournament-dropdown"
                    value={selectedTournament}
                    onChange={handleTournamentSelect}
                  >
                    <option value="">Select a tournament</option>
                    {activeTournaments.map((tournament) => (
                      <option key={tournament.id} value={tournament.id}>
                        {tournament.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="tournament-dropdown-btn"
                    onClick={handleResumeTournament}
                    disabled={!selectedTournament}
                  >
                    <FontAwesomeIcon icon={faPlay} />
                  </button>
                </div>
              ) : (
                <p>No active tournaments available</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TournamentTools;
