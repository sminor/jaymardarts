import React from 'react';

const Events = ({ sortedEvents }) => (
  <section id="events" className="App-section">
    <div className="info-box">
      <h2>Events</h2>
      <p>
        Whether you're a seasoned player or just starting out, our events are the perfect opportunity to connect with the dart community. We regularly host a variety of tournaments, social nights, and special events that bring together players of all skill levels.
      </p>
      <div className="events-grid">
        {sortedEvents.map((event, index) => (
          <div key={index} className="event-item">
            <div className="event-date">{event.date}</div>
            <div className="event-type">{event.type}</div>
            <div className="event-location">{event.location}</div>
            <div className="event-signup">Signups: {event.signupTime}</div>
            <div className="event-fee">Entry Fee: {event.entryFee}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Events;
