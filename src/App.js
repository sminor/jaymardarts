import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './jaymar-logo.png';
import locationsData from './data/locations.json'; 
import eventsData from './data/events.json';
import About from './components/About';
import Locations from './components/Locations';
import Events from './components/Events';
import Leagues from './components/Leagues';

function App() {
  const [locations, setLocations] = useState([]);
  const [sortedEvents, setSortedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('news');
  const [showBackToTop, setShowBackToTop] = useState(false); // For back-to-top button
  const [activeNav, setActiveNav] = useState(''); // Active nav tracking
  const [mobileNavOpen, setMobileNavOpen] = useState(false); // State for mobile nav
  const [isMobile, setIsMobile] = useState(false); // State to track if it's mobile view
  const [accordionOpen, setAccordionOpen] = useState({}); // For managing accordion in mobile view

  // Load locations and events data
  useEffect(() => {
    setLocations(locationsData); // Load locations from JSON
    const sortedEventsData = eventsData.sort((a, b) => new Date(a.dateFormatted) - new Date(b.dateFormatted));
    setSortedEvents(sortedEventsData); // Load sorted events into state

    // Detect if the screen is mobile
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll behavior to update the active section and show back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.App-section');
      let currentSection = '';
      
	  const scrollPosition = window.pageYOffset;

      // Show the back-to-top button if scrolled more than 300px
      setShowBackToTop(scrollPosition > 300);
	  
	  // Determine if the user is at the top of the page (above the "About Us" section)
	  if (scrollPosition < sections[0].offsetTop - 70) {
        setActiveNav(''); // Clear the active nav when above the "About Us" section
        return;
      }

      // Determine active section based on scroll position
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (scrollPosition >= sectionTop - 70) {
          currentSection = section.getAttribute('id');
        }
      });

      setActiveNav(currentSection);

      // Close mobile nav on scroll
      if (mobileNavOpen) {
        setMobileNavOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      const nav = document.querySelector('.nav-links-mobile');
      if (nav && !nav.contains(event.target) && mobileNavOpen) {
        setMobileNavOpen(false); // Close mobile nav if clicked outside
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside); // Close nav when clicking outside

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
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
    setAccordionOpen((prevAccordionOpen) => ({
      ...prevAccordionOpen,
      [tab]: !prevAccordionOpen[tab],
    }));
  };

  // Handle mobile nav click - close the menu after clicking
  const handleMobileNavClick = (section) => {
    setActiveNav(section);
    setMobileNavOpen(false);
    document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
  };

  // Handle back-to-top button click
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="App">
	
      {/* Mobile Navigation */}
      <span className="mobile-nav-icon" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
        ☰
      </span>

      {mobileNavOpen && (
        <div className="nav-links-mobile">
          <a href="#about-section" className={activeNav === 'about' ? 'active' : ''} onClick={() => handleMobileNavClick('about')}>
            About Us
          </a>
          <a href="#locations-section" className={activeNav === 'locations' ? 'active' : ''} onClick={() => handleMobileNavClick('locations')}>
            Locations
          </a>
          <a href="#events-section" className={activeNav === 'events' ? 'active' : ''} onClick={() => handleMobileNavClick('events')}>
            Events
          </a>
          <a href="#leagues-section" className={activeNav === 'leagues' ? 'active' : ''} onClick={() => handleMobileNavClick('leagues')}>
            Leagues
          </a>
        </div>
      )}

      {/* Desktop Navigation */}
      <nav className="App-nav">
        <a href="#about-section" className={activeNav === 'about' ? 'active' : ''}>About Us</a>
        <a href="#locations-section" className={activeNav === 'locations' ? 'active' : ''}>Locations</a>
        <a href="#events-section" className={activeNav === 'events' ? 'active' : ''}>Events</a>
        <a href="#leagues-section" className={activeNav === 'leagues' ? 'active' : ''}>Leagues</a>
      </nav>

      {/* Header with logo and scroll indicator */}
      <header className="App-header">
        <img src={logo} className="App-logo" alt="JayMar Darts Logo" />
        <div className="scroll-indicator">
          <span className="arrows">↓ ↓</span>
        </div>
      </header>

      {/* About Us Section */}
	  <div id="about-section" style={{ paddingTop: '70px', marginTop: '-70px' }}></div>
      <About />

      {/* Locations Section */}
	  <div id="locations-section" style={{ paddingTop: '70px', marginTop: '-70px' }}></div>
      <Locations locations={locations} handleLocationClick={handleLocationClick} />

      {/* Events Section */}
	  <div id="events-section" style={{ paddingTop: '70px', marginTop: '-70px' }}></div>
      <Events sortedEvents={sortedEvents} />

      {/* Leagues Section */}
	  <div id="leagues-section" style={{ paddingTop: '70px', marginTop: '-70px' }}></div>
      <Leagues 
        isMobile={isMobile} 
        accordionOpen={accordionOpen} 
        toggleAccordion={toggleAccordion} 
        activeTab={activeTab} 
        handleTabClick={handleTabClick} 
      />

      {/* Back to top button */}
      <a href="#top" className={`back-to-top ${showBackToTop ? 'show' : ''}`} onClick={scrollToTop}>↑</a>
    </div>
  );
}

export default App;
