import React from 'react';
import PlayerStatSearch from './PlayerStatSearch'; // Ensure the path is correct

const Leagues = ({ isMobile, accordionOpen, toggleAccordion, activeTab, handleTabClick }) => {

  const toggleAccordionWithScroll = (tab) => {
    // Toggle the accordion first
    toggleAccordion(tab);

    // Update the accordion buttons to switch between + and -
    const accordionButtons = document.querySelectorAll('.accordion');
    accordionButtons.forEach((button) => {
      const dataTab = button.getAttribute('data-tab');
      if (dataTab === tab && !button.classList.contains('active')) {
        // If the clicked button isn't active, make it active
        button.classList.add('active');
      } else {
        // Remove active class from all other buttons
        button.classList.remove('active');
      }
    });

    // Delay scrolling slightly to ensure state has updated
    setTimeout(() => {
      const section = document.getElementById(tab);
      if (section) {
        const yOffset = -70; // Offset to keep the accordion header visible
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 200); // Slight delay for smooth transition
  };

  // Shared content renderer
  const renderContent = (section) => {
    switch (section) {
      case 'news':
        return (
          <>
            <h3>ADL Fall League Sign-Ups Now Open!</h3>
            <p>Get ready for an exciting season! Sign up today and secure your spot in the ADL Fall League.</p>
            <p>Sign-up ends October 5, 2024, and leagues begin October 20.</p>
          </>
        );
      case 'signup':
        return (
          <>
            <h3>Sign-Up Forms</h3>
            <ul>
              <li><a href="http://jaymardarts.com/files/adl-fall-2024.pdf" target="_blank" rel="noopener noreferrer"><strong>ADL Sign-up Form (PDF)</strong></a></li>
              <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSddRe3f9NtdgFtbHksuwZx4ZKFygXZZd6gM7ABOeVPprBwHgA/viewform" target="_blank" rel="noopener noreferrer"><strong>Fall 2024 Sign-up (Google Form)</strong></a></li>
            </ul>
          </>
        );
      case 'rules':
        return (
          <>
            <h3>Rules</h3>
            <p>Ensure you're familiar with the official rules of the league.</p>
          </>
        );
      case 'fees':
        return (
          <>
            <h3>Fees</h3>
            <p>Here are the fees associated with joining the league and participating in tournaments.</p>
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
          // Accordion for mobile view
          <div>
            <button className="accordion" data-tab="news" onClick={() => toggleAccordionWithScroll('news')}>News & Updates</button>
            <div id="news" className="accordion-content" style={{ display: accordionOpen['news'] ? 'block' : 'none', minHeight: '100vh' }}>
              {renderContent('news')}
            </div>

            <button className="accordion" data-tab="signup" onClick={() => toggleAccordionWithScroll('signup')}>Sign-Up Forms</button>
            <div id="signup" className="accordion-content" style={{ display: accordionOpen['signup'] ? 'block' : 'none', minHeight: '100vh' }}>
              {renderContent('signup')}
            </div>

            <button className="accordion" data-tab="rules" onClick={() => toggleAccordionWithScroll('rules')}>Rules</button>
            <div id="rules" className="accordion-content" style={{ display: accordionOpen['rules'] ? 'block' : 'none', minHeight: '100vh' }}>
              {renderContent('rules')}
            </div>

            <button className="accordion" data-tab="fees" onClick={() => toggleAccordionWithScroll('fees')}>Fees</button>
            <div id="fees" className="accordion-content" style={{ display: accordionOpen['fees'] ? 'block' : 'none', minHeight: '100vh' }}>
              {renderContent('fees')}
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
          // Tabs for desktop view
          <>
            <div className="tab-navigation">
              <button className={`tab-button ${activeTab === 'news' ? 'active' : ''}`} onClick={() => handleTabClick('news')}>News & Updates</button>
              <button className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => handleTabClick('signup')}>Sign-Up Forms</button>
              <button className={`tab-button ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => handleTabClick('rules')}>Rules</button>
              <button className={`tab-button ${activeTab === 'fees' ? 'active' : ''}`} onClick={() => handleTabClick('fees')}>Fees</button>
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

export default Leagues;
