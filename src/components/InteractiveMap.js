import React, { useRef, useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute } from '@fortawesome/free-solid-svg-icons';
import ReactGA from 'react-ga4';

// Declare libraries array as a constant outside the component to avoid re-render issues
const libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 45.5122, // Center of Portland, OR
  lng: -122.6587,
};

function InteractiveMap({ locations }) {
  const mapRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [infoWindowVisible, setInfoWindowVisible] = useState(false); // InfoWindow visibility
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);

  // Fetch location details such as photos
  const fetchLocationDetails = useCallback((location) => {
    const service = new window.google.maps.places.PlacesService(mapRef.current);
    const request = {
      query: location.name,
      fields: ['photos'],
    };

    service.findPlaceFromQuery(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0]) {
        const place = results[0];
        setSelectedLocation((prev) => ({
          ...prev,
          photos: place.photos,
        }));
      }
    });
  }, []);

  const handleMarkerClick = useCallback((location) => {
    // Fetch details immediately to avoid delay
    setSelectedLocation({
      name: location.name,
      address: location.address,
      lat: location.lat,
      lng: location.lng,
    });
    fetchLocationDetails(location);

    // Hide InfoWindow initially
    setInfoWindowVisible(false);
    setInfoWindowPosition(null);
    hideResetButton();

    if (mapRef.current) {
      mapRef.current.panTo({ lat: location.lat, lng: location.lng });
      mapRef.current.setZoom(15);

      const mapDiv = mapRef.current.getDiv();
      const mapHeight = mapDiv.offsetHeight;
      const panY = mapHeight * -0.2; // Pan slightly downwards
      mapRef.current.panBy(0, panY);

      // Show InfoWindow after pan and zoom
      setInfoWindowPosition({ lat: location.lat, lng: location.lng });
      setInfoWindowVisible(true);
      showResetButton();
    }
  }, [fetchLocationDetails]);

  const resetMap = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.panTo(center);
      mapRef.current.setZoom(10);
      setSelectedLocation(null);
      setInfoWindowPosition(null); // Reset InfoWindow
      hideResetButton();
    }
  }, []);

  const findClosestLocation = useCallback(() => {
	// Google Analytics Event
    ReactGA.event({
      category: 'Button', // Category (e.g., 'Button')
      action: 'click', // Action (e.g., 'click')
      label: 'Find Closest Location', // Optional label
    });  
	  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        let closestLocation = null;
        let closestDistance = Infinity;

        locations.forEach((location) => {
          const distance = calculateDistance(userLat, userLng, location.lat, location.lng);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestLocation = location;
          }
        });

        if (closestLocation) {
          handleMarkerClick(closestLocation);
        }
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, [handleMarkerClick, locations]);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const showResetButton = () => {
    const resetButton = document.querySelector('.reset-button');
    if (resetButton) {
      resetButton.classList.remove('hidden');
    }
  };

  const hideResetButton = () => {
    const resetButton = document.querySelector('.reset-button');
    if (resetButton) {
      resetButton.classList.add('hidden');
    }
  };

  useEffect(() => {
    window.mapComponentRef = {
      panToLocation: (location) => {
        handleMarkerClick(location);
      },
    };
  }, [handleMarkerClick]);

  return (
    <div>
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={libraries} // Use constant libraries array to avoid reloads
        loadingElement={<div>Loading...</div>} // Add loadingElement for best practice
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={10}
          center={center}
          onLoad={(map) => (mapRef.current = map)}
        >
          {locations.map((location, index) => (
            <MarkerF
              key={index}
              position={{ lat: location.lat, lng: location.lng }}
              title={location.name}
              onClick={() => handleMarkerClick(location)}
            />
          ))}

          {selectedLocation && infoWindowPosition && infoWindowVisible && (
<InfoWindowF
  position={infoWindowPosition}
  onCloseClick={() => {
    setSelectedLocation(null);
    setInfoWindowPosition(null);
  }}
>
  <div className="info-window">
    <div className="info-window-header">
      <h3>{selectedLocation.name}</h3>
    </div>
    <p>{selectedLocation.address}</p>
	<a
        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedLocation.address)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Get Directions <FontAwesomeIcon icon={faRoute} />
      </a>
    {selectedLocation.photos && selectedLocation.photos.length > 0 && (
      <img
        src={selectedLocation.photos[0].getUrl({ maxWidth: 300, maxHeight: 150 })}
        alt={selectedLocation.name}
        className="info-window-image"
      />
    )}
  </div>
</InfoWindowF>
          )}
        </GoogleMap>
      </LoadScript>
      <div className="map-controls">
        <button className="map-button" onClick={findClosestLocation}>
          Find Closest Location
        </button>
        <button className="map-button reset-button hidden" onClick={resetMap}>
          Show All Locations
        </button>
      </div>
    </div>
  );
}

export default InteractiveMap;
