import InteractiveMap from './InteractiveMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';

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
            <div className="location-name">
              <h3>{location.name}</h3>
              <FontAwesomeIcon icon={faMapLocationDot} className="map-icon" />
            </div>
			<div className="location-details">
              <p>{location.details}</p>
            </div>
            <div className="location-address">
              <p>{location.address}</p>
            </div>
            {location.isNew && <span className="new-badge">New!</span>}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Locations;

