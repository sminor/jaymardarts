"use client";

import React, { useState, useEffect, useRef } from 'react';

import { supabase } from '@/lib/supabaseClient';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import LocationCard from './LocationCard';
import LocationsMap from './LocationsMap';

const LocationsPage = () => {
    // State for managing locations and selected location
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);

    // Reference to the map container for scrolling
    const mapContainerRef = useRef(null);

    // Fetch locations from Supabase on component mount
    useEffect(() => {
        const fetchLocations = async () => {
            // Retrieve locations from the database
            const { data, error } = await supabase.from('locations').select('*');
            if (error) {
                console.error('Error fetching locations:', error);
            } else {
                setLocations(data);
            }
        };
        fetchLocations();
    }, []);

    // Handle a location being clicked on
    const handleLocationClick = (location) => {
        setSelectedLocation(location);

        // Scroll to the map section smoothly
        if (mapContainerRef.current) {
            window.scrollTo({
                top: mapContainerRef.current.offsetTop - 80, // Adjust the offset as needed
                behavior: 'smooth',
            });
        }
    };

    // Find the closest location to the user
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
                    setSelectedLocation(closestLocation);
                    if (mapContainerRef.current) {
                        window.scrollTo({
                            top: mapContainerRef.current.offsetTop - 80,
                            behavior: 'smooth',
                        });
                    }
                }
            }, (error) => {
                console.error('Error getting geolocation:', error);
                alert('Unable to retrieve your location.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    // Show all locations on the map
    const showAllLocations = () => {
        setSelectedLocation(null);
    };

    return (
        <div className="min-h-screen bg-background-main text-text-default flex flex-col justify-between">
            {/* Navigation Bar */}
            <NavBar currentPage="Locations" />

            {/* Our Locations Title */}
            <section className="bg-background-secondary">
                <div className="container max-w-screen-xl mx-auto p-4 bg-background-heading rounded-lg mt-4">
                    <h1 className="text-3xl font-bold mb-4 text-center text-text-highlight">Our Locations</h1>
                    <p className="text-center mb-6">
                        With 10 locations around the Portland metro area, JayMar Darts offers convenient spots for you to join the excitement of dart games, leagues, and tournaments. Click on a location to explore more!
                    </p>
                </div>
            </section>

            {/* Map Section */}
            <section className="p-4 bg-background-secondary relative" ref={mapContainerRef}>
                <div className="container max-w-screen-xl mx-auto">
                    <LocationsMap locations={locations} selectedLocation={selectedLocation} />
                    <div className="flex justify-center mt-4 space-x-4">
                        <div
                            onClick={findClosestLocation}
                            className="button-style"
                        >
                            Find Closest Location
                        </div>
                        {selectedLocation && (
                            <div
                                onClick={showAllLocations}
                                className="button-style"
                            >
                                Show All Locations
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Location Cards */}
            <section className="p-4 bg-background-secondary">
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
