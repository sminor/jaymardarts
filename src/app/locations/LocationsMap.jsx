"use client";

import React, { useRef, useEffect, useState } from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { FaRoute } from 'react-icons/fa';

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

const LocationsMap = ({ locations, selectedLocation }) => {
    const mapRef = useRef(null);
    const [infoWindowPosition, setInfoWindowPosition] = useState(null);
    const [infoWindowData, setInfoWindowData] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);

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

    useEffect(() => {
        if (mapRef.current) {
            if (selectedLocation) {
                const lat = parseFloat(selectedLocation.latitude);
                const lng = parseFloat(selectedLocation.longitude);
                if (!isNaN(lat) && !isNaN(lng)) {
                    mapRef.current.panTo({ lat, lng });
                    mapRef.current.setZoom(14);
                    setInfoWindowPosition({ lat, lng });
                    setInfoWindowData(selectedLocation);
                    fetchLocationPhoto(selectedLocation);
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
                setTimeout(() => {
                    mapRef.current.fitBounds(bounds);
                }, 100);
                setInfoWindowPosition(null);
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
                                }}
                            />
                        );
                    }
                    return null;
                })}

                {infoWindowPosition && infoWindowData && (
                    <InfoWindowF
                        position={infoWindowPosition}
                        onCloseClick={() => setInfoWindowPosition(null)}
                    >
                        <div className="info-window bg-white text-black p-2 rounded-md">
                            <h3 className="text-lg font-medium mb-1 mt-0">{infoWindowData.name}</h3>
                            <p className="mb-1 text-black">{infoWindowData.address}</p>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(infoWindowData.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 mb-2"
                            >
                                <FaRoute />
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
