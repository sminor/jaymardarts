import React, { useState } from 'react';
import PlayerStatSearch from './PlayerStatSearch'; // Ensure the path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronRight, faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import rulesSections from './LeagueRules'; // Correct import

const Leagues = ({ isMobile, accordionOpen, toggleAccordion, activeTab, handleTabClick }) => {
  const [currentSection, setCurrentSection] = useState(0);

  const scrollToContent = () => {
    const target = document.getElementById('rules-heading');
    if (target) {
	  setTimeout(() => {
      if (isMobile) {
        // For mobile, scroll directly to the rules heading
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // For desktop, account for the fixed navbar with an offset
        const yOffset = -70; // Adjust this value to match your navbar height
        const yPosition = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: yPosition, behavior: 'smooth' });
      }
	  }, 50); // Adjust timeout as needed
    }
  };

  const handleNextSection = () => {
    if (currentSection < rulesSections.length - 1) {
      setCurrentSection(currentSection + 1);
	  scrollToContent(); 
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
	  scrollToContent(); 
    }
  };

  const handleSectionChange = (e) => {
    setCurrentSection(Number(e.target.value));
  };

  const toggleAccordionWithScroll = (tab) => {
    toggleAccordion(tab);
    setTimeout(() => {
      const section = document.getElementById(tab);
      if (section) {
        const yOffset = -70;
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 200);
  };

  const renderContent = (section) => {
    switch (section) {
      case 'news':
        return (
          <>
            <img 
              src="/action-dart-logo.png" 
              alt="Action Dart League Logo" 
              style={{ width: '200px', height: 'auto', display: 'block', marginBottom: '20px' }}
            />
            <h3 className="league-heading">ADL Fall League Sign-Ups Now Open!</h3>
            <p>Get ready for an exciting season! Sign up today and secure your spot in the ADL Fall League.</p>
      
            <p className="league-dates">
              <span className="important-date">Sign-up ends October 5, 2024</span>, and <span className="important-date">leagues begin October 20</span>.
            </p>
      
            <p>
              By playing in our league, you'll qualify for events in organizations such as the 
              <a href="http://www.actiondartleague.com/" className="qualified-orgs" target="_blank" rel="noopener noreferrer"> Action Dart League (ADL)</a>, 
              <a href="https://www.ndadarts.com/" className="qualified-orgs" target="_blank" rel="noopener noreferrer"> National Dart Association (NDA)</a>, and the 
              <a href="https://www.nado.net/" className="qualified-orgs" target="_blank" rel="noopener noreferrer"> North American Dart Organization (NADO)</a>. 
              The league runs for 15 weeks, giving you plenty of time to improve your skills and enjoy the game.
            </p>
      
            <p>
              As a participant, you'll also have the chance to qualify for <span className="important-event">Team Dart in Las Vegas</span>, one of the most prestigious events in the darting world!
            </p>
      
            <p className="cta">Don't miss your chance to be part of this exciting season—start your journey to Vegas with us!</p>
          </>
        );

	  case 'signup':
	  return (
		  <>
		  <h3 className="sign-up-heading">Sign-Up Forms</h3>
		  <p>Ready to join one of the most exciting dart leagues? Choose your preferred sign-up method below:</p>
		  
		  <ul>
			  <li>
			  <a href="https://docs.google.com/forms/d/e/1FAIpQLSddRe3f9NtdgFtbHksuwZx4ZKFygXZZd6gM7ABOeVPprBwHgA/viewform" target="_blank" rel="noopener noreferrer" className="sign-up-link">
				  <strong>Fall 2024 Sign-up (Google Form)</strong>
			  </a>
			  <p>Complete your registration online in just a few minutes.</p>
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

            {/* Section dropdown */}
            <label htmlFor="sectionSelect">Jump to Section:</label>
            <select id="sectionSelect" value={currentSection} onChange={handleSectionChange}>
              {rulesSections.map((section, index) => (
                <option key={index} value={index}>
                  {section.title}
                </option>
              ))}
            </select>

            {/* Display the current section with HTML rendering */}
			
            <div className="rules-section">
              <h4>{rulesSections[currentSection].title}</h4>
              <div dangerouslySetInnerHTML={{ __html: rulesSections[currentSection].content }} />
            </div>

            {/* Navigation buttons (fixed position) */}
			<div className="navigation-buttons">
			  <FontAwesomeIcon 
			 	 icon={faCircleChevronLeft} 
			 	 onClick={handlePreviousSection} 
			 	 className={currentSection === 0 ? 'disabled' : ''}
			 	 disabled={currentSection === 0}
			  />
			  <FontAwesomeIcon 
			 	 icon={faCircleChevronRight} 
			 	 onClick={handleNextSection} 
			 	 className={currentSection === rulesSections.length - 1 ? 'disabled' : ''}
			 	 disabled={currentSection === rulesSections.length - 1}
			  />
			</div>
          </>
        );

      case 'schedule':
        return (
          <>
            <h3>Schedules</h3>
            <p>Here you can find the schedule for the upcoming league matches.</p>
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

            <button className="accordion" data-tab="schedule" onClick={() => toggleAccordionWithScroll('schedule')}>Schedules</button>
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
              <button className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => handleTabClick('schedule')}>Schedules</button>
              <button className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => handleTabClick('stats')}>Player Stats</button>
            </div>

            <div className="tab-content">
              {renderContent(activeTab)}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Leagues
