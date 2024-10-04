import React from 'react';
import { useLocation } from 'react-router-dom'; // Only import what you need
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faPlay } from '@fortawesome/free-solid-svg-icons';
import CreateTournament from './tournamentTools/CreateTournament'; // The new component we'll create

const TournamentTools = () => {
  const activeTournaments = []; // Mocked data or state for active tournaments
  const location = useLocation(); // Access the current URL

  // Parse query parameters
  const params = new URLSearchParams(location.search);
  const isCreatingTournament = params.get('create') === 'true';

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
                onClick={() => (window.location.href = '/tournament-tools?create=true')}
              >
                <FontAwesomeIcon icon={faPlusCircle} /> Create Tournament
              </button>
            </div>

            <div className="divider">
              <span>or</span>
            </div>

            <div className="active-tournaments">
              <h2>Resume Existing Tournament</h2>
              {activeTournaments.length > 0 ? (
                <div className="tournament-dropdown-container">
                  <select className="tournament-dropdown">
                    {activeTournaments.map((tournament) => (
                      <option key={tournament.id} value={tournament.id}>
                        {tournament.name} - {tournament.date}
                      </option>
                    ))}
                  </select>
                  <button className="tournament-dropdown-btn">
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
