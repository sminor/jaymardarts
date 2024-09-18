import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // Import the main CSS file
import logo from './jaymar-logo.png'; // Import the JayMar Darts logo
import locationsData from './data/locations.json'; // Import the locations data
import eventsData from './data/events.json'; // Import the events data
import About from './components/About'; // Import the About component
import Locations from './components/Locations'; // Import the Locations component
import Events from './components/Events'; // Import the Events component
import Leagues from './components/Leagues'; // Import the Leagues component
import Contact from './components/Contact'; // Import the Contact component
import TournamentTools from './components/TournamentTools'; // Import the Tournament Tools component
import NotFound from './components/NotFound'; // Import the 404 page component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown, faBars } from '@fortawesome/free-solid-svg-icons'; // Import hamburger icon
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
  const [backToTopPosition, setBackToTopPosition] = useState(20); // Dynamic positioning for Back-to-top
  const [hamburgerPosition, setHamburgerPosition] = useState(20); // Dynamic position for hamburger menu
  const [fadeButtons, setFadeButtons] = useState(false); // State to control fading
  
  useEffect(() => {
    let fadeTimeout;
  
    const handleScrollFade = () => {
      // Clear any existing timeout when scrolling starts
      clearTimeout(fadeTimeout);
      
      // Fade the buttons back in when the user scrolls
      setFadeButtons(false);
  
      // Set a timeout to fade the buttons out after 2 seconds of inactivity
      fadeTimeout = setTimeout(() => {
        setFadeButtons(true); // Fade out the buttons
      }, 2000); // Adjust the time as needed
    };
  
    window.addEventListener('scroll', handleScrollFade);
  
    return () => {
      window.removeEventListener('scroll', handleScrollFade);
      clearTimeout(fadeTimeout);
    };
  }, []);  

  useEffect(() => {
    setLocations(locationsData);
    const sortedEventsData = eventsData.sort((a, b) => new Date(a.dateFormatted) - new Date(b.dateFormatted));
    setSortedEvents(sortedEventsData);

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Function to update the position of the back-to-top button and hamburger button
  useEffect(() => {
    const updateButtonPositions = () => {
      const appSection = document.querySelector('.App-section');
      if (appSection) {
        const appSectionRight = window.innerWidth - appSection.getBoundingClientRect().right;
        setBackToTopPosition(appSectionRight); // Offset from the right edge of the section for back to top
        setHamburgerPosition(appSectionRight); // Offset from the right edge of the section for the hamburger menu
      }
    };

    // Update on load and resize
    updateButtonPositions();
    window.addEventListener('resize', updateButtonPositions);
    window.addEventListener('scroll', updateButtonPositions);

    return () => {
      window.removeEventListener('resize', updateButtonPositions);
      window.removeEventListener('scroll', updateButtonPositions);
    };
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
    event.preventDefault(); // Prevent default anchor behavior
    setActiveNav(section); // Set active section
    setMobileNavOpen(false); // Close mobile nav
    const targetSection = document.getElementById(`${section}-section`);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to section
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

return (
  <Router>
    <>
      <div className="App">
        <Routes>
          <Route exact path="/" element={
            <>
              {/* Mobile Navigation Hamburger Button */}
              <button
                className={`mobile-nav-button fade-button ${fadeButtons ? 'fade-out' : ''}`}
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                style={{ right: `${hamburgerPosition}px` }} // Dynamically calculated right position
                aria-label="Open navigation"
              >
                <FontAwesomeIcon icon={faBars} />
              </button>

              {mobileNavOpen && (
                <div className="nav-links-mobile">
                  <span className={activeNav === 'about' ? 'active' : ''} onClick={(e) => handleMobileNavClick('about', e)}>About Us</span>
                  <span className={activeNav === 'locations' ? 'active' : ''} onClick={(e) => handleMobileNavClick('locations', e)}>Locations</span>
                  <span className={activeNav === 'events' ? 'active' : ''} onClick={(e) => handleMobileNavClick('events', e)}>Events</span>
                  <span className={activeNav === 'leagues' ? 'active' : ''} onClick={(e) => handleMobileNavClick('leagues', e)}>Leagues</span>
                  <span className={activeNav === 'contact' ? 'active' : ''} onClick={(e) => handleMobileNavClick('contact', e)}>Contact Us</span>
                </div>
              )}

              {/* Desktop Navigation */}
              <nav className="App-nav">
                <span className={activeNav === 'about' ? 'active' : ''} onClick={(e) => handleMobileNavClick('about', e)}>About Us</span>
                <span className={activeNav === 'locations' ? 'active' : ''} onClick={(e) => handleMobileNavClick('locations', e)}>Locations</span>
                <span className={activeNav === 'events' ? 'active' : ''} onClick={(e) => handleMobileNavClick('events', e)}>Events</span>
                <span className={activeNav === 'leagues' ? 'active' : ''} onClick={(e) => handleMobileNavClick('leagues', e)}>Leagues</span>
                <span className={activeNav === 'contact' ? 'active' : ''} onClick={(e) => handleMobileNavClick('contact', e)}>Contact Us</span>
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

              {/* Back to Top Button */}
              <button
                className={`back-to-top fade-button ${showBackToTop ? 'show' : ''} ${fadeButtons ? 'fade-out' : ''}`}
                onClick={scrollToTop}
                aria-label="Back to top"
                style={{ right: `${backToTopPosition}px` }} // Dynamically calculated right position
              >
                ↑
              </button>
            </>
          }/>
		  
		  {/* Hidden route for the Tournament Tools page */}
          <Route path="/tournament-tools" element={<TournamentTools />} />

          {/* NotFound Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* Footer is now outside of the App wrapper */}
      <footer>
        <p>© 2024 JayMar Darts. All rights reserved.</p>
      </footer>
    </>
  </Router>
);

}

export default App;
