import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import logo from './jaymar-logo.png';
import locationsData from './data/locations.json';
import eventsData from './data/events.json';
import About from './components/About';
import Locations from './components/Locations';
import Events from './components/Events';
import Leagues from './components/Leagues';
import Contact from './components/Contact';
import NotFound from './components/NotFound'; // Import the 404 page component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown } from '@fortawesome/free-solid-svg-icons';
import ReactGA from 'react-ga4';

ReactGA.initialize('G-LTMZ8CNWM8', { debug: true }); // Your GA ID
ReactGA.send("pageview");

function App() {
  const [locations, setLocations] = useState([]);
  const [sortedEvents, setSortedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('news');
  const [showBackToTop, setShowBackToTop] = useState(false); // Back-to-top button visibility
  const [activeNav, setActiveNav] = useState(''); // Active navigation tracking
  const [mobileNavOpen, setMobileNavOpen] = useState(false); // Mobile nav open state
  const [isMobile, setIsMobile] = useState(false); // Mobile view state
  const [accordionOpen, setAccordionOpen] = useState({}); // Accordion state for mobile view

  useEffect(() => {
    setLocations(locationsData);
    const sortedEventsData = eventsData.sort((a, b) => new Date(a.dateFormatted) - new Date(b.dateFormatted));
    setSortedEvents(sortedEventsData);

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.App-section');
      let currentSection = '';
      const scrollPosition = window.pageYOffset;

      setShowBackToTop(scrollPosition > 300);

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (scrollPosition >= sectionTop - 80) {
          currentSection = section.getAttribute('id');
        }
      });

      setActiveNav(currentSection);

      if (mobileNavOpen) {
        setMobileNavOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mobileNavOpen]);

  const handleLocationClick = (location) => {
    const locationsSection = document.getElementById('locations');
    if (locationsSection) {
      locationsSection.scrollIntoView({ behavior: 'smooth' });
    }
    if (window.mapComponentRef) {
      window.mapComponentRef.panToLocation(location);
    }
  };

  const handleTabClick = (tab) => setActiveTab(tab);

  const toggleAccordion = (tab) => {
    setAccordionOpen((prevAccordionOpen) => {
      const newAccordionState = {};

      Object.keys(prevAccordionOpen).forEach((key) => {
        newAccordionState[key] = false;
      });

      newAccordionState[tab] = !prevAccordionOpen[tab];

      return newAccordionState;
    });
  };

  const handleMobileNavClick = (section, event) => {
    event.preventDefault();
    setActiveNav(section);
    setMobileNavOpen(false);
    document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={
          <div className="App">
            {/* Mobile Navigation */}
            <span className="mobile-nav-icon" onClick={() => setMobileNavOpen(!mobileNavOpen)} />
            
            {mobileNavOpen && (
              <div className="nav-links-mobile">
                <a href="#about-section" className={activeNav === 'about' ? 'active' : ''} onClick={(e) => handleMobileNavClick('about', e)}>About Us</a>
                <a href="#locations-section" className={activeNav === 'locations' ? 'active' : ''} onClick={(e) => handleMobileNavClick('locations', e)}>Locations</a>
                <a href="#events-section" className={activeNav === 'events' ? 'active' : ''} onClick={(e) => handleMobileNavClick('events', e)}>Events</a>
                <a href="#leagues-section" className={activeNav === 'leagues' ? 'active' : ''} onClick={(e) => handleMobileNavClick('leagues', e)}>Leagues</a>
                <a href="#contact-section" className={activeNav === 'contact' ? 'active' : ''} onClick={(e) => handleMobileNavClick('contact', e)}>Contact Us</a>
              </div>
            )}

            {/* Desktop Navigation */}
            <nav className="App-nav">
              <a href="#about-section" className={activeNav === 'about' ? 'active' : ''}>About Us</a>
              <a href="#locations-section" className={activeNav === 'locations' ? 'active' : ''}>Locations</a>
              <a href="#events-section" className={activeNav === 'events' ? 'active' : ''}>Events</a>
              <a href="#leagues-section" className={activeNav === 'leagues' ? 'active' : ''}>Leagues</a>
              <a href="#contact-section" className={activeNav === 'contact' ? 'active' : ''}>Contact Us</a>
            </nav>

            {/* Header with logo */}
            <header className="App-header">
              <img src={logo} className="App-logo" alt="JayMar Darts Logo" />
              <div className="arrow-container">
                <div className="arrows">
                  <div className="arrow-wrapper">
                    <FontAwesomeIcon icon={faAnglesDown} />
                  </div>
                </div>
              </div>
            </header>

            {/* Main Page Sections */}
            <div id="about-section"></div>
            <About />

            <div id="locations-section"></div>
            <Locations locations={locations} handleLocationClick={handleLocationClick} />

            <div id="events-section"></div>
            <Events sortedEvents={sortedEvents} />

            <div id="leagues-section"></div>
            <Leagues
              isMobile={isMobile}
              accordionOpen={accordionOpen}
              toggleAccordion={toggleAccordion}
              activeTab={activeTab}
              handleTabClick={handleTabClick}
            />

            <div id="contact-section"></div>
            <Contact />

            <a href="#top" className={`back-to-top ${showBackToTop ? 'show' : ''}`} onClick={scrollToTop}>↑</a>
          </div>
        }/>

        {/* NotFound Route without other components */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
