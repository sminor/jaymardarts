import React from 'react';
import InteractiveMap from './InteractiveMap'; // Ensure the path is correct

const Locations = ({ locations, handleLocationClick }) => (
  <section id="locations" className="App-section">
    <div className="info-box">
      <h2>Our Locations</h2>
      <p className="locations-description">
        With 10 locations around the Portland metro area, JayMar Darts offers convenient spots for you to join the excitement of dart games, leagues, and tournaments. Click on a location to explore more!
      </p>
      <InteractiveMap locations={locations} />
      <div className="locations-grid">
        {locations.map((location, index) => (
          <div key={index} className="location-item" onClick={() => handleLocationClick(location)}>
            <h3>{location.name}</h3>
            <p>{location.address}</p>
            {location.isNew && <span className="new-badge">New!</span>}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Locations;
