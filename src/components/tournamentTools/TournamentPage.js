import React, { useState } from 'react';
import TournamentSettings from './TournamentSettings';
import TournamentPlayers from './TournamentPlayers';
import TournamentMoney from './TournamentMoney';

const TournamentPage = () => {
  const [activeTab, setActiveTab] = useState('Tournament'); // Track the active tab

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Tournament':
        return <TournamentPlayers />;
      case 'Money':
        return <TournamentMoney />;
      case 'Settings':
        return <TournamentSettings />;
      default:
        return <TournamentPlayers />;
    }
  };

  return (
    <div className="tournament-page-container">
      <header>  
        <h1>JayMar Tournament Tools</h1>
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
