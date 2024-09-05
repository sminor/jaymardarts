import React from 'react';
import PlayerStatSearch from './PlayerStatSearch'; // Ensure the path is correct

const Leagues = ({ isMobile, accordionOpen, toggleAccordion, activeTab, handleTabClick }) => {
  return (
    <section id="leagues" className="App-section">
      <div className="info-box">
        <h2>Leagues</h2>
        <p>
          Interested in joining a league? We offer competitive and recreational leagues for players of all skill levels. Sign up for one of our leagues to improve your skills, compete with others, and be a part of our dart community.
        </p>

        {isMobile ? (
          // Accordion for mobile view
          <div>
            <button className="accordion" onClick={() => toggleAccordion('news')}>
              News & Updates
            </button>
            <div className="accordion-content" style={{ display: accordionOpen['news'] ? 'block' : 'none' }}>
              <h3>ADL Fall League Sign-Ups Now Open!</h3>
              <p>Get ready for an exciting season! Sign up today and secure your spot in the ADL Fall League.</p>
              <p>Sign-up ends October 5, 2024, and leagues begin October 20.</p>
            </div>

            <button className="accordion" onClick={() => toggleAccordion('signup')}>
              Sign-Up Forms
            </button>
            <div className="accordion-content" style={{ display: accordionOpen['signup'] ? 'block' : 'none' }}>
              <ul>
                <li>
                  <a href="http://jaymardarts.com/files/adl-fall-2024.pdf" target="_blank" rel="noopener noreferrer">
                    <strong>ADL Sign-up Form (PDF)</strong>
                  </a>
                </li>
                <li>
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLSddRe3f9NtdgFtbHksuwZx4ZKFygXZZd6gM7ABOeVPprBwHgA/viewform" target="_blank" rel="noopener noreferrer">
                    <strong>Fall 2024 Sign-up (Google Form)</strong>
                  </a>
                </li>
              </ul>
            </div>

            <button className="accordion" onClick={() => toggleAccordion('rules')}>
              Rules
            </button>
            <div className="accordion-content" style={{ display: accordionOpen['rules'] ? 'block' : 'none' }}>
              <p>Ensure you're familiar with the official rules of the league.</p>
            </div>

            <button className="accordion" onClick={() => toggleAccordion('fees')}>
              Fees
            </button>
            <div className="accordion-content" style={{ display: accordionOpen['fees'] ? 'block' : 'none' }}>
              <p>Here are the fees associated with joining the league and participating in tournaments.</p>
            </div>

            <button className="accordion" onClick={() => toggleAccordion('schedule')}>
              Schedules
            </button>
            <div className="accordion-content" style={{ display: accordionOpen['schedule'] ? 'block' : 'none' }}>
              <p>Here you can find the schedule for the upcoming league matches.</p>
            </div>

            <button className="accordion" onClick={() => toggleAccordion('stats')}>
              Player Stats
            </button>
            <div className="accordion-content" style={{ display: accordionOpen['stats'] ? 'block' : 'none' }}>
              <PlayerStatSearch />
            </div>
          </div>
        ) : (
          // Tabs for desktop view
          <>
            <div className="tab-navigation">
              <button className={`tab-button ${activeTab === 'news' ? 'active' : ''}`} onClick={() => handleTabClick('news')}>
                News & Updates
              </button>
              <button className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => handleTabClick('signup')}>
                Sign-Up Forms
              </button>
              <button className={`tab-button ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => handleTabClick('rules')}>
                Rules
              </button>
              <button className={`tab-button ${activeTab === 'fees' ? 'active' : ''}`} onClick={() => handleTabClick('fees')}>
                Fees
              </button>
              <button className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => handleTabClick('schedule')}>
                Schedules
              </button>
              <button className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => handleTabClick('stats')}>
                Player Stats
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'news' && (
                <div className="news-updates">
                  <h3>ADL Fall League Sign-Ups Now Open!</h3>
                  <p>Get ready for an exciting season! Sign up today and secure your spot in the ADL Fall League.</p>
                  <p>Sign-up ends October 5, 2024, and leagues begin October 20.</p>
                </div>
              )}

              {activeTab === 'signup' && (
                <div className="signup-forms">
                  <h3>Sign-Up Forms</h3>
                  <ul>
                    <li>
                      <a href="http://jaymardarts.com/files/adl-fall-2024.pdf" target="_blank" rel="noopener noreferrer">
                        <strong>ADL Sign-up Form (PDF)</strong>
                      </a>
                    </li>
                    <li>
                      <a href="https://docs.google.com/forms/d/e/1FAIpQLSddRe3f9NtdgFtbHksuwZx4ZKFygXZZd6gM7ABOeVPprBwHgA/viewform" target="_blank" rel="noopener noreferrer">
                        <strong>Fall 2024 Sign-up (Google Form)</strong>
                      </a>
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="rules">
                  <h3>Rules</h3>
                  <p>Ensure you're familiar with the official rules of the league.</p>
                </div>
              )}

              {activeTab === 'fees' && (
                <div className="fees">
                  <h3>Fees</h3>
                  <p>Here are the fees associated with joining the league and participating in tournaments.</p>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="schedules">
                  <h3>Schedules</h3>
                  <p>Here you can find the schedule for the upcoming league matches.</p>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="player-stat-search">
                  <h3>Search Player Statistics</h3>
                  <PlayerStatSearch />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Leagues;
