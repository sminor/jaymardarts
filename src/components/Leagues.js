import React, { useState, useEffect } from 'react';
import PlayerStatSearch from './PlayerStatSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronRight, faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import rulesSections from './LeagueRules';
import leagueScheduleData from '../data/leagueSchedule.json';
import StandingsReport from './StandingsReport'; // Import the StandingsReport modal
import SubRescheduleForm from './SubRescheduleForm';


const Leagues = ({ isMobile, accordionOpen, toggleAccordion, activeTab, handleTabClick }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedFlight, setSelectedFlight] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [modalUrl, setModalUrl] = useState(''); // URL for standings
  const [isSubRescheduleModalOpen, setIsSubRescheduleModalOpen] = useState(false); // For Substitute/Reschedule

  // Fetch the JSON for League Schedules when the component mounts
  useEffect(() => {
    setScheduleData(leagueScheduleData);
    setLoading(false);
  }, []);

  const handleFlightChange = (event) => {
    setSelectedFlight(event.target.value);
    setSelectedWeek(''); // Reset week filter when flight changes
    setSelectedTeam(''); // Reset team filter when flight changes
  };

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
  };

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  // Modal handling for Standings with actual content fetch
  const openModal = (url) => {
    // Set the URL for the standings report
    setModalUrl(url);
    setIsModalOpen(true);

    // Get the width of the scrollbar
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Disable scrolling on the body and adjust padding to account for scrollbar width
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollBarWidth}px`;
  };

  const closeModal = () => {
    setIsModalOpen(false);

    // Clear the modal content (URL)
    setModalUrl('');

    // Re-enable scrolling on the body and remove the padding adjustment
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  };

  const renderFlightData = () => {
    if (!selectedFlight || !scheduleData) return null;
  
    const flight = scheduleData.schedules.find(f => f.flight === selectedFlight);
    if (!flight) return null;
  
    // Group matches by week
    const matchesByWeek = flight.matches.reduce((acc, match) => {
      acc[match.week] = acc[match.week] || [];
      acc[match.week].push(match);
      return acc;
    }, {});

    // Filter matches by selected week and team
    const filteredMatches = Object.keys(matchesByWeek).reduce((acc, week) => {
      if (selectedWeek && week !== selectedWeek) return acc;

      const filteredWeekMatches = matchesByWeek[week].filter(match => {
        if (selectedTeam && match.home_team !== selectedTeam && match.away_team !== selectedTeam) {
          return false;
        }
        return true;
      });

      if (filteredWeekMatches.length > 0) {
        acc[week] = filteredWeekMatches;
      }

      return acc;
    }, {});

    return (
      <>
        {/* Flight name, day, and time */}
        <h3>{flight.flight} - {flight.day} {flight.time}</h3>

        {/* Add Standings Report Link */}
        {flight.reportlink && (
          <p>
            <button onClick={() => openModal(flight.reportlink)}>
              View Standings
            </button>
          </p>
        )}

        {/* Dropdowns for filtering */}
        <div>
          <label htmlFor="weekSelect">Filter by Week:</label>
          <select id="weekSelect" value={selectedWeek} onChange={handleWeekChange}>
            <option value="">All Weeks</option>
            {Object.keys(matchesByWeek).map(week => (
              <option key={week} value={week}>Week {week}</option>
            ))}
          </select>

          <label htmlFor="teamSelect">Filter by Team:</label>
          <select id="teamSelect" value={selectedTeam} onChange={handleTeamChange}>
            <option value="">All Teams</option>
            {flight.teams.map((team, index) => (
              <option key={index} value={team.team_name}>{team.team_name}</option>
            ))}
          </select>
        </div>

        {/* Teams Section */}
        <div className="table-container">
          <h4>Teams</h4>
          <table className="teams-table">
            <thead>
              <tr>
                <th>Team Name</th>
                <th>Players</th>
              </tr>
            </thead>
            <tbody>
              {flight.teams.map((team, index) => (
                <tr key={index}>
                  <td>{team.team_name}</td>
                  <td>{team.players.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Schedule Section */}
          <h4>Schedule</h4>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Home Team</th>
                <th>Away Team</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(filteredMatches).length === 0 ? (
                <tr>
                  <td colSpan="4">No matches found for the selected filters</td>
                </tr>
              ) : (
                Object.keys(filteredMatches).map(week => (
                  <React.Fragment key={week}>
                    {/* Row that spans the whole table for the week label */}
                    <tr>
                      <td colSpan="4" className="week-heading"><strong>Week {week}</strong></td>
                    </tr>
                    {filteredMatches[week].map((match, index) => (
                      <tr key={index}>
                        <td>{match.date}</td>
                        <td>{match.home_team}</td>
                        <td>{match.away_team}</td>
                        <td>{match.location}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const handleNextSection = () => {
    if (currentSection < rulesSections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSectionChange = (e) => {
    setCurrentSection(Number(e.target.value));
  };

  // Smooth scrolling when opening accordion sections
  const toggleAccordionWithScroll = (tab) => {
    toggleAccordion(tab);
    setTimeout(() => {
      const section = document.getElementById(tab);
      if (section) {
        const yOffset = -70;  // Adjust for fixed navbar if needed
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 200);
  };

  const renderContent = (section) => {
    switch (section) {
      case 'schedule':
        return (
          <>
            <h3>Schedules & Standings</h3>
            <p>
              If you need to submit a substitute player or reschedule a match, 
              please <button 
                        className='button2link'
                        onClick={() => setIsSubRescheduleModalOpen(true)} 
                      >
                        click here
                      </button> 
              &nbsp;to provide the necessary details. We will respond as quickly as possible to confirm your request. 
              Please note that changes are not finalized until you have received a confirmation from us.
            </p>
            {loading ? (
              <p>Loading schedule...</p>
            ) : (
              <>
                <label htmlFor="flightSelect">Select a Flight:</label>
                <select id="flightSelect" value={selectedFlight} onChange={handleFlightChange}>
                  <option value="">-- Select a Flight --</option>
                  {scheduleData.schedules.map((flight, index) => (
                    <option key={index} value={flight.flight}>{flight.flight}</option>
                  ))}
                </select>
                {renderFlightData()}
              </>
            )}
            
            {/* Render SubReschduleForm as a modal if isSubRescheduleModalOpen is true */}
            {isSubRescheduleModalOpen && (
              <div className="modal-overlay">
                <SubRescheduleForm onClose={() => setIsSubRescheduleModalOpen(false)} />
              </div>
            )}
            
            {/* Standings Report Modal */}
            {isModalOpen && (
              <div className="modal-overlay">
                <StandingsReport statsUrl={modalUrl} onClose={() => setIsModalOpen(false)} />
              </div>
            )}
          </>
        );


        case 'news':
          return (
            <>
              <img src="/action-dart-logo.png" alt="Action Dart League Logo" style={{ width: '200px', height: 'auto', display: 'block', marginBottom: '20px' }} />
              <h3 className="league-heading">Spring 2025 League is Here!</h3>
              <p>The new season is upon us, and it's time to sharpen those skills and bring your A-game to the dartboard! We're excited to kick off the Spring 2025 League.</p>
              <p>Whether you're a returning champion or a fresh face in the league, this season promises thrilling matches, tight competition, and loads of fun.</p>
              <p>Every match is a chance to rise through the ranks and make your mark. Bring your best, enjoy the camaraderie, and soak in the community spirit that makes our league truly special.</p>
              <p>As a league participant, you'll qualify for events with organizations like:</p>
              <ul>
                <li>
                  <a href="http://www.actiondartleague.com/" className="qualified-orgs" target="_blank" rel="noopener noreferrer">Action Dart League (ADL)</a>
                </li>
                <li>
                  <a href="https://www.ndadarts.com/" className="qualified-orgs" target="_blank" rel="noopener noreferrer">National Dart Association (NDA)</a>
                </li>
                <li>
                  <a href="https://www.nado.net/" className="qualified-orgs" target="_blank" rel="noopener noreferrer">North American Dart Organization (NADO)</a>
                </li>
              </ul>
              <p>Let's make this Spring 2025 season our best one yet—good luck and shoot well!</p>
            </>
          );

      case 'signup':
        return (
          <>
            <h3 className="sign-up-heading">Sign-Up Forms</h3>
            <p>Ready to join one of the most exciting dart leagues? Choose your preferred sign-up method below:</p>
            <ul>
              <li>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSeewJgE286xZwP9MIWO9UbqzFFtnJAiroVyUK98EaOGWsf4Og/viewform" target="_blank" rel="noopener noreferrer" className="sign-up-link">
                  <strong>Spring 2025 ADL Sign-up (Google Form)</strong>
                </a>
              </li>
            </ul>
          </>
        );

      case 'fees':
        return (
          <>
            <h3 className="fees-heading">Fees</h3>
            <p>Here are the fees associated with joining the league:</p>
            <h4 className="fee-details-heading">Sign-Up Fees</h4>
            <ul>
              <li>$50 per person for OPEN LEAGUE</li>
              <li>$25 per person for ALL CAPPED LEAGUES</li>
              <li>+ $10 for NDA sanctioning <em>(if you did not play last season)</em></li>
            </ul>
            <h4 className="fee-details-heading">Payment Methods</h4>
            <ul>
              <li>Venmo: <a href="https://venmo.com/jay-phillips-36" target="_blank" rel="noopener noreferrer"><strong>@jay-phillips-36</strong></a></li>
              <li>Paypal: <a href="https://paypal.me/jayphillips1528" target="_blank" rel="noopener noreferrer"><strong>@jayphillips1528</strong></a> <em>(Friends & Family)</em></li>
            </ul>
            <h4 className="fee-details-heading">Important</h4>
            <ul>
              <li>Entire team fees are due at the time of sign-up. Please pay the total amount for both players.</li>
              <li><strong>No refunds after sign-ups close.</strong></li>
            </ul>
          </>
        );

      case 'rules':
        return (
          <>
            <h3 id="rules-heading">Rules</h3>
            <p>Ensure you're familiar with the official rules of the league.</p>
            <label htmlFor="sectionSelect">Jump to Section:</label>
            <select id="sectionSelect" value={currentSection} onChange={handleSectionChange}>
              {rulesSections.map((section, index) => (
                <option key={index} value={index}>{section.title}</option>
              ))}
            </select>
            <div className="rules-section">
              <h4>{rulesSections[currentSection].title}</h4>
              <div dangerouslySetInnerHTML={{ __html: rulesSections[currentSection].content }} />
            </div>
            <div className="navigation-buttons">
              <FontAwesomeIcon icon={faCircleChevronLeft} onClick={handlePreviousSection} className={currentSection === 0 ? 'disabled' : ''} />
              <FontAwesomeIcon icon={faCircleChevronRight} onClick={handleNextSection} className={currentSection === rulesSections.length - 1 ? 'disabled' : ''} />
            </div>
          </>
        );

      case 'stats':
        return (
          <>
            <h3>Search Player Statistics</h3>
            <PlayerStatSearch />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <section id="leagues" className="App-section">
      <div className="info-box">
        <h2>Leagues</h2>
        <p>Interested in joining a league? We offer competitive and recreational leagues for players of all skill levels.</p>

        {isMobile ? (
          <div>
            <button className="accordion" data-tab="news" onClick={() => toggleAccordionWithScroll('news')}>News & Updates</button>
            <div id="news" className="accordion-content" style={{ display: accordionOpen['news'] ? 'block' : 'none', minHeight: '100vh' }}>
              {renderContent('news')}
            </div>

            <button className="accordion" data-tab="signup" onClick={() => toggleAccordionWithScroll('signup')}>Sign-Up Forms</button>
            <div id="signup" className="accordion-content" style={{ display: accordionOpen['signup'] ? 'block' : 'none', minHeight: '100vh' }}>
              {renderContent('signup')}
            </div>

            <button className="accordion" data-tab="fees" onClick={() => toggleAccordionWithScroll('fees')}>Fees</button>
            <div id="fees" className="accordion-content" style={{ display: accordionOpen['fees'] ? 'block' : 'none', minHeight: '100vh' }}>
              {renderContent('fees')}
            </div>

            <button className="accordion" data-tab="rules" onClick={() => toggleAccordionWithScroll('rules')}>Rules</button>
            <div id="rules" className="accordion-content" style={{ display: accordionOpen['rules'] ? 'block' : 'none', minHeight: '100vh' }}>
              {renderContent('rules')}
            </div>

            <button className="accordion" data-tab="schedule" onClick={() => toggleAccordionWithScroll('schedule')}>Schedules & Standings</button>
            <div id="schedule" className="accordion-content" style={{ display: accordionOpen['schedule'] ? 'block' : 'none', minHeight: '100vh' }}>
              {renderContent('schedule')}
            </div>

            <button className="accordion" data-tab="stats" onClick={() => toggleAccordionWithScroll('stats')}>Player Stats</button>
            <div id="stats" className="accordion-content" style={{ display: accordionOpen['stats'] ? 'block' : 'none', minHeight: '100vh' }}>
              {renderContent('stats')}
            </div>
          </div>
        ) : (
          <>
            <div className="tab-navigation">
              <button className={`tab-button ${activeTab === 'news' ? 'active' : ''}`} onClick={() => handleTabClick('news')}>News & Updates</button>
              <button className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => handleTabClick('signup')}>Sign-Up Forms</button>
              <button className={`tab-button ${activeTab === 'fees' ? 'active' : ''}`} onClick={() => handleTabClick('fees')}>Fees</button>
              <button className={`tab-button ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => handleTabClick('rules')}>Rules</button>
              <button className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => handleTabClick('schedule')}>Schedules & Standings</button>
              <button className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => handleTabClick('stats')}>Player Stats</button>
            </div>

            <div className="tab-content">
              {renderContent(activeTab)}
            </div>
          </>
        )}

        {/* Modal for Standings Report */}
        {isModalOpen && <StandingsReport statsUrl={modalUrl} onClose={closeModal} />}
      </div>
    </section>
  );
};

export default Leagues;
