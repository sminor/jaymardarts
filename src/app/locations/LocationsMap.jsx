"use client";

import React, { useRef, useEffect, useState } from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';

// Google Maps API configuration
const mapContainerStyle = {
    width: '100%',
    height: '500px',
};
const defaultCenter = {
    lat: 45.5122, // Center of Portland, OR
    lng: -122.6587,
};
const defaultZoom = 10;
const libraries = ['places'];

/**
 * LocationsMap component displays a Google Map with markers for each location.
 */
const LocationsMap = ({ locations, selectedLocation }) => {
    // Map reference
    const mapRef = useRef(null);

    // State variables for managing the info window
    const [infoWindowPosition, setInfoWindowPosition] = useState(null);
    const [infoWindowData, setInfoWindowData] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [infoWindowVisible, setInfoWindowVisible] = useState(false);

    /**
     * Fetch a photo for the location using the Google Places API.
     */
    const fetchLocationPhoto = (location) => {
        if (mapRef.current && window.google && window.google.maps.places) {
            const service = new window.google.maps.places.PlacesService(mapRef.current);
            const request = {
                query: location.name,
                fields: ['photos'],
            };

            service.findPlaceFromQuery(request, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0]) {
                    const photos = results[0].photos;
                    if (photos && photos.length > 0) {
                        setPhotoUrl(photos[0].getUrl({ maxWidth: 300, maxHeight: 200 }));
                    }
                } else {
                    setPhotoUrl(null);
                }
            });
        }
    };

    /**
     * Update the map and info window when a location is selected or the locations array changes.
     */
    useEffect(() => {
        if (mapRef.current) {
            if (selectedLocation) {
                const lat = parseFloat(selectedLocation.latitude);
                const lng = parseFloat(selectedLocation.longitude);
                if (!isNaN(lat) && !isNaN(lng)) {
                    setInfoWindowVisible(false);
                    mapRef.current.panTo({ lat, lng });
                    mapRef.current.setZoom(14);

                    // Add a small delay to ensure the map pans before displaying the info window
                    setTimeout(() => {
                        const mapHeight = mapRef.current.getDiv().offsetHeight;
                        const panY = mapHeight * -0.2;
                        mapRef.current.panBy(0, panY);

                        setInfoWindowPosition({ lat, lng });
                        setInfoWindowData(selectedLocation);
                        fetchLocationPhoto(selectedLocation);
                        setInfoWindowVisible(true);
                    }, 300);
                }
            } else {
                const bounds = new window.google.maps.LatLngBounds();
                locations.forEach((location) => {
                    const lat = parseFloat(location.latitude);
                    const lng = parseFloat(location.longitude);
                    if (!isNaN(lat) && !isNaN(lng)) {
                        bounds.extend({ lat, lng });
                    }
                });
                mapRef.current.fitBounds(bounds);
                setInfoWindowPosition(null);
                setInfoWindowVisible(false);
            }
        }
    }, [selectedLocation, locations]);

    return (
        <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
        >
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={defaultZoom}
                center={defaultCenter}
                onLoad={(map) => (mapRef.current = map)}
            >
                {locations.map((location, index) => {
                    const lat = parseFloat(location.latitude);
                    const lng = parseFloat(location.longitude);
                    if (!isNaN(lat) && !isNaN(lng)) {
                        return (
                            <MarkerF
                                key={location.id || index}
                                position={{ lat, lng }}
                                title={location.name}
                                onClick={() => {
                                    setInfoWindowPosition({ lat, lng });
                                    setInfoWindowData(location);
                                    fetchLocationPhoto(location);
                                    setInfoWindowVisible(true);
                                }}
                            />
                        );
                    }
                    return null;
                })}

                {infoWindowPosition && infoWindowData && infoWindowVisible && (
                    <InfoWindowF
                        position={infoWindowPosition}
                        onCloseClick={() => setInfoWindowVisible(false)}
                    >
                        <div className="bg-white text-black p-2 rounded-md">
                            <h3 className="text-lg font-medium mb-1 mt-0">{infoWindowData.name}</h3>
                            <p className="mb-1">{infoWindowData.address}</p>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(infoWindowData.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 link-style mb-2"
                            >
                                <span>Get Directions</span>
                            </a>
                            {photoUrl && (
                                <img
                                    src={photoUrl}
                                    alt={infoWindowData.name}
                                    className="rounded-md shadow-md w-full max-w-[300px] h-auto object-contain mb-2"
                                />
                            )}
                        </div>
                    </InfoWindowF>
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default LocationsMap;
