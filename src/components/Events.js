import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faLocationDot, faClock, faDollarSign, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Events = ({ sortedEvents }) => {
  const [isCollapsedNewPlayer, setIsCollapsedNewPlayer] = useState(true);
  const [isCollapsedConduct, setIsCollapsedConduct] = useState(true);
  const [isCollapsedPastEvents, setIsCollapsedPastEvents] = useState(true); // State for past events

  // Detect if the user is on iPhone or Android
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

  // Get current date in Portland timezone
  const now = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });

  // Split events into upcoming and past
  const upcomingEvents = sortedEvents.filter(event => new Date(event.formattedDate) >= new Date(now));
  const pastEvents = sortedEvents.filter(event => new Date(event.formattedDate) < new Date(now));

  // Toggle collapsed state
  const toggleCollapseNewPlayer = (e) => {
    e.preventDefault(); // Prevent scroll to top
    setIsCollapsedNewPlayer(!isCollapsedNewPlayer);
  };
  const toggleCollapseConduct = (e) => {
    e.preventDefault(); // Prevent scroll to top
    setIsCollapsedConduct(!isCollapsedConduct);
  };
  const toggleCollapsePastEvents = (e) => {
    e.preventDefault(); // Prevent scroll to top
    setIsCollapsedPastEvents(!isCollapsedPastEvents);
  };

  return (
    <section id="events" className="App-section">
      <div className="info-box">
        <h2>Events</h2>
        <p>
          Whether you're a seasoned player or just starting out, our events are the perfect opportunity to connect with the dart community. We regularly host a variety of tournaments, social nights, and special events that bring together players of all skill levels.
        </p>
        <p>
          <em>All events are subject to change. Prizes will be determined based on the number of participants.</em>
        </p>

        {/* Collapsible Section for New Players */}
        <div className="new-player-info">
          <a href="#" role="button" onClick={toggleCollapseNewPlayer} className="toggle-link">
            New Player Information
            <FontAwesomeIcon icon={isCollapsedNewPlayer ? faChevronDown : faChevronUp} />
          </a>
          {!isCollapsedNewPlayer && (
            <div className="new-player-details">
              <p>Please arrive at least 30 minutes before sign-ups start to ensure a smooth experience.</p>
              <p>
                Make sure to download the Bullshooter app from the{' '}
                {isAndroid ? (
                  <a href="https://play.google.com/store/apps/details?id=com.arachnid.bslive" target="_blank" rel="noopener noreferrer">
                    Google Play Store
                  </a>
                ) : isIOS ? (
                  <a href="https://apps.apple.com/us/app/bullshooter-live/id717480327" target="_blank" rel="noopener noreferrer">
                    Apple App Store
                  </a>
                ) : (
                  <span> Apple App Store or Google Play Store.</span>
                )}
                {' '}and sign up for an account after downloading.
              </p>
              <p>
                You are welcome to bring your own soft tip darts, but please note that they should weigh 20 grams or less. If you don’t have your own darts, house darts will be available for you to use.
              </p>
              <p>
                Feel free to let others know if this is your first time or if you are new. Everyone is here to have a great time, so don’t worry—just have fun, win or lose!
              </p>
            </div>
          )}
        </div>

        {/* Collapsible Section for Code of Conduct */}
        <div className="code-of-conduct-info">
          <a href="#" role="button" onClick={toggleCollapseConduct} className="toggle-link">
            Code of Conduct & Tournament Etiquette
            <FontAwesomeIcon icon={isCollapsedConduct ? faChevronDown : faChevronUp} />
          </a>
          {!isCollapsedConduct && (
            <div className="code-of-conduct-details">
              <p>
                At our tournaments, we value fairness, respect, and fun. Our tournament operators are volunteers who work hard to ensure everything runs smoothly—please treat them with respect.
              </p>
              <p>
                We believe in fair play. Play by the rules, be a good sport whether you win or lose, and always show respect to your teammates and opponents.
              </p>
              <p>
                If any issues arise, our tournament operators will make decisions in the spirit of fair play. Their decisions are final and intended to keep the tournament fun for everyone.
              </p>
              <p>
                Failure to adhere to these guidelines may result in exclusion from future events, but we’re confident that with a positive attitude and good sportsmanship, everyone will have a great time!
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Events Section */}
        <h3>Upcoming Events</h3>
        <div className="events-grid">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, index) => (
              <div key={index} className="event-item">
                <div className="event-date">{event.date}</div>
                <div className="event-type">
                  <FontAwesomeIcon icon={faBullseye} className="event-icons" />
                  <span> Type: {event.type}</span>
                </div>
                <div className="event-location">
                  <FontAwesomeIcon icon={faLocationDot} className="event-icons" />
                  <span> Location: {event.location}</span>
                </div>
                <div className="event-signup">
                  <FontAwesomeIcon icon={faClock} className="event-icons" />
                  <span> Signups: {event.signupTime}</span>
                </div>
                <div className="event-fee">
                  <FontAwesomeIcon icon={faDollarSign} className="event-icons" />
                  <span> Entry Fee: {event.entryFee}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No upcoming events.</p>
          )}
        </div>

        {/* Collapsible Section for Past Events */}
        <div className="past-events-info">
          <h3>
            <a href="#" role="button" onClick={toggleCollapsePastEvents} className="toggle-link">
              Past Events
              <FontAwesomeIcon icon={isCollapsedPastEvents ? faChevronDown : faChevronUp} />
            </a>
          </h3>
          {!isCollapsedPastEvents && (
            <div className="events-grid past-events-grid">
              {pastEvents.length > 0 ? (
                pastEvents.map((event, index) => (
                  <div key={index} className="event-item past-event">
                    <div className="event-date strikethrough">{event.date}</div>
                    <div className="event-type">
                      <FontAwesomeIcon icon={faBullseye} className="event-icons" />
                      <span> Type: {event.type}</span>
                    </div>
                    <div className="event-location">
                      <FontAwesomeIcon icon={faLocationDot} className="event-icons" />
                      <span> Location: {event.location}</span>
                    </div>
                    <div className="event-signup">
                      <FontAwesomeIcon icon={faClock} className="event-icons" />
                      <span> Signups: {event.signupTime}</span>
                    </div>
                    <div className="event-fee">
                      <FontAwesomeIcon icon={faDollarSign} className="event-icons" />
                      <span> Entry Fee: {event.entryFee}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No past events.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Events;
