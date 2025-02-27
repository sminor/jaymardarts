"use client";

import React, { useState, useEffect } from 'react';

import { supabase } from '@/lib/supabaseClient';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import EventCard from './EventCard';
import NewPlayerModal from './NewPlayerModal';
import CodeOfConductModal from './CodeOfConductModal';
import EventFAQModal from './EventFAQModal'; // Updated import

/**
 * EventsPage component displays a list of upcoming events.
 */
const EventsPage = () => {
    // State to hold the list of events
    const [events, setEvents] = useState([]);
    // State to manage the visibility of the modals
    const [isNewPlayerModalOpen, setIsNewPlayerModalOpen] = useState(false);
    const [isCodeOfConductModalOpen, setIsCodeOfConductModalOpen] = useState(false);
    const [isEventFAQModalOpen, setIsEventFAQModalOpen] = useState(false); // Updated state name
    // State to reset the index of the FAQ
    const [eventFAQModalKey, setEventFAQModalKey] = useState(0);
    //New state for date range
    const [dateRange, setDateRange] = useState('thisMonth'); // Default filter
    // New state for checkbox
    const [showPastEvents, setShowPastEvents] = useState(false);
    // New State for Location
    const [locationFilter, setLocationFilter] = useState('all'); // Default to all
    // New State for the unique location list
    const [uniqueLocations, setUniqueLocations] = useState([]);

    /**
     * Fetch the events data from supabase.
     */
    useEffect(() => {
        const fetchEvents = async () => {
            // Get the current date
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            // Calculate the date 31 days ago
            const thirtyOneDaysAgo = new Date(today);
            thirtyOneDaysAgo.setDate(today.getDate() - 31);

            // Format dates for Supabase query
            const todayFormatted = today.toISOString().split('T')[0];
            const thirtyOneDaysAgoFormatted = thirtyOneDaysAgo.toISOString().split('T')[0];
            // Retrieve the list of events, ordered by date in ascending order
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .or(`date.gte.${thirtyOneDaysAgoFormatted},date.gte.${todayFormatted}`)// only show events from 31 days ago or more than today
                .order('date', { ascending: true });

            // Handle errors or set the events data
            if (error) {
                console.error('Error fetching events:', error);
            } else {
                setEvents(data);

                // Extract unique locations from the fetched events
                const locations = new Set(data.map(event => event.location));
                setUniqueLocations(['all', ...Array.from(locations)]); // Add 'all' as an option
            }
        };

        fetchEvents();
    }, []);

    // Handle opening the new player modal
    const handleOpenNewPlayerModal = () => {
        setIsNewPlayerModalOpen(true);
    };

    // Handle closing the new player modal
    const handleCloseNewPlayerModal = () => {
        setIsNewPlayerModalOpen(false);
    };

    // Handle opening the code of conduct modal
    const handleOpenCodeOfConductModal = () => {
        setIsCodeOfConductModalOpen(true);
    };

    // Handle closing the code of conduct modal
    const handleCloseCodeOfConductModal = () => {
        setIsCodeOfConductModalOpen(false);
    };

    // Handle opening the Event FAQ modal
    const handleOpenEventFAQModal = () => {
        setIsEventFAQModalOpen(true); // Updated function name
    };

    // Handle closing the Event FAQ modal
    const handleCloseEventFAQModal = () => {
        setIsEventFAQModalOpen(false); // Updated function name
        setEventFAQModalKey((prevKey) => prevKey + 1); //force re-render
    };

    // Filter events based on dateRange and showPastEvents
    const filteredEvents = events.filter((event) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const eventDate = new Date(event.date + 'T00:00:00');
        const oneWeek = new Date(today);
        oneWeek.setDate(today.getDate() + 7);
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const isPastEvent = eventDate < today;

        if (!showPastEvents && isPastEvent) {
            return false; // Exclude past events if showPastEvents is false
        }
        //location filter
        if (locationFilter !== 'all' && event.location !== locationFilter) {
            return false; // Exclude events not matching the selected location
        }

        if (dateRange === "all") {
            return true; //show all events if all selected and not filtered out above.
        }

        if (dateRange === "today") {
            return eventDate.getTime() === today.getTime(); //only show events that are today.
        }

        if (dateRange === "thisWeek") {
            return eventDate >= today && eventDate <= oneWeek; //show events from today to one week away.
        }

        if (dateRange === "thisMonth") {
            return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear; //show events from the current month.
        }
        return false;
    });

    // Update the selected dateRange
    const handleDateRangeChange = (event) => {
        setDateRange(event.target.value);
    };

    // Handle the checkbox change
    const handleShowPastEventsChange = (event) => {
        setShowPastEvents(event.target.checked);
    };

    // Update the selected locationFilter
    const handleLocationFilterChange = (event) => {
        setLocationFilter(event.target.value);
    };

    return (
        <div className="min-h-screen bg-background-main text-text-default flex flex-col justify-between">
            {/* Navigation Bar */}
            <NavBar currentPage="Events" />

            {/* Our Events Title */}
            <section className="bg-background-secondary">
                <div className="container max-w-screen-xl mx-auto p-4 bg-background-heading rounded-lg mt-4">
                    <h1 className="text-3xl font-bold mb-4 text-center text-text-highlight">Upcoming Events</h1>
                    <p className="text-center mb-6">
                        Whether you&apos;re a seasoned player or just starting out, our events are the perfect opportunity to connect with the dart community. We regularly host a variety of tournaments, social nights, and special events that bring together players of all skill levels.
                    </p>
                </div>
            </section>

            {/* New Player Information and Code of Conduct Buttons */}
            <section className="bg-background-secondary">
                <div className="container max-w-screen-xl mx-auto p-4 flex justify-center gap-4"> {/* Removed flex-wrap */}
                    <div
                        onClick={handleOpenNewPlayerModal}
                        className="button-style max-w-[120px] min-w-[120px] truncate font-normal text-xs" //Updated class
                    >
                        New Players {/* Changed text here */}
                    </div>
                    <div // Code of Conduct button
                        onClick={handleOpenCodeOfConductModal}
                        className="button-style max-w-[120px] min-w-[120px] truncate font-normal text-xs"//Updated class
                    >
                        Conduct Code
                    </div>
                    <div // Event FAQ button
                        onClick={handleOpenEventFAQModal} // Updated function name
                        className="button-style max-w-[120px] min-w-[120px] truncate font-normal text-xs" //Updated class
                    >
                        FAQ {/* New Button */}
                    </div>

                    {/* Modals */}
                    <NewPlayerModal isOpen={isNewPlayerModalOpen} onClose={handleCloseNewPlayerModal} />
                    <CodeOfConductModal isOpen={isCodeOfConductModalOpen} onClose={handleCloseCodeOfConductModal} />
                    <EventFAQModal key={eventFAQModalKey} isOpen={isEventFAQModalOpen} onClose={handleCloseEventFAQModal} /> {/* Updated modal name */}
                </div>
            </section>

            {/* Filters */}
            <section className="bg-background-secondary">
                <div className="container max-w-screen-xl mx-auto p-4 flex justify-between items-end"> {/* changed items-center to items-end */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <select
                            onChange={handleDateRangeChange}
                            value={dateRange}
                            className="bg-select-background text-select-text border-2 border-border-highlight w-[160px] rounded-md px-2 py-1 appearance-none focus:outline-none"
                        >
                            <option value="thisMonth">This Month</option>
                            <option value="thisWeek">This Week</option>
                            <option value="today">Today</option>
                            <option value="all">All</option>
                        </select>
                        <select
                            onChange={handleLocationFilterChange}
                            value={locationFilter}
                            className="bg-select-background text-select-text border-2 border-border-highlight w-[160px] rounded-md px-2 py-1 appearance-none focus:outline-none"
                        >
                            {uniqueLocations.map((location) => (
                                <option key={location} value={location}>
                                    {location === 'all' ? 'All Locations' : location}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="showPastEvents"
                            checked={showPastEvents}
                            onChange={handleShowPastEventsChange}
                        />
                        <label htmlFor="showPastEvents" className="ml-2">Show Past Events</label> {/*added ml-2 */}
                    </div>
                </div>
            </section>

            {/* Event Cards Section */}
            <section className="p-4 bg-background-secondary">
                <div className="container max-w-screen-xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default EventsPage;
