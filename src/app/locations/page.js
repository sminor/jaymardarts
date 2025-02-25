"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import LocationCard from './LocationCard';
import LocationsMap from './LocationsMap';
import Footer from '@/components/Footer';
import { FaMapMarkerAlt } from 'react-icons/fa';

const LocationsPage = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        const fetchLocations = async () => {
            const { data, error } = await supabase.from('locations').select('*');
            if (error) {
                console.error('Error fetching locations:', error);
            } else {
                console.log('Fetched locations data:', data);
                setLocations(data);
            }
        };
        fetchLocations();
    }, []);

    const handleLocationClick = (location) => {
        setSelectedLocation(location);
    };

    const findClosestLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                let closestLocation = null;
                let closestDistance = Infinity;

                locations.forEach((location) => {
                    const distance = Math.sqrt(
                        Math.pow(location.latitude - latitude, 2) + Math.pow(location.longitude - longitude, 2)
                    );
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestLocation = location;
                    }
                });

                if (closestLocation) {
                    console.log('Closest location found:', closestLocation);
                    setSelectedLocation(closestLocation);
                }
            }, (error) => {
                console.error('Error getting geolocation:', error);
                alert('Unable to retrieve your location.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const showAllLocations = () => {
        setSelectedLocation(null);
    };

    return (
        <div className="min-h-screen bg-background-main text-text-default flex flex-col justify-between">
            <div className="container max-w-screen-xl mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4 text-center text-text-highlight">Our Locations</h1>
                <p className="text-center mb-6 text-text-card">
                    With 10 locations around the Portland metro area, JayMar Darts offers convenient spots for you to join the excitement of dart games, leagues, and tournaments. Click on a location to explore more!
                </p>
            </div>
            <section className="p-4 bg-background-header relative">
                <div className="container max-w-screen-xl mx-auto">
                    <LocationsMap locations={locations} selectedLocation={selectedLocation} />
                    <div className="flex justify-center mt-4 space-x-4">
                        <button 
                            onClick={findClosestLocation}
                            className="px-6 py-2 bg-button-background hover:bg-button-hover text-button-text font-semibold rounded-lg shadow-md transition-colors border-2 border-border-highlight"
                        >
                            Find Closest Location
                        </button>
                        {selectedLocation && (
                            <button 
                                onClick={showAllLocations}
                                className="px-6 py-2 bg-button-background hover:bg-button-hover text-button-text font-semibold rounded-lg shadow-md transition-colors border-2 border-border-highlight"
                            >
                                Show All Locations
                            </button>
                        )}
                    </div>
                </div>
            </section>
            <section className="p-4 bg-background-main">
                <div className="container max-w-screen-xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {locations.map((location) => (
                            <LocationCard 
                                key={location.id} 
                                location={{ ...location, isNew: location.is_new }} 
                                onClick={handleLocationClick} 
                            />
                        ))}
                    </div>
                </div>
            </section>
            
            <Footer />
        </div>
    );
};

export default LocationsPage;
