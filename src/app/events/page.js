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

    /**
     * Fetch the events data from supabase.
     */
    useEffect(() => {
        const fetchEvents = async () => {
            // Retrieve the list of events, ordered by date in ascending order
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: true });

            // Handle errors or set the events data
            if (error) {
                console.error('Error fetching events:', error);
            } else {
                setEvents(data);
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
                        New Player Info {/* Changed text here */}
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

            {/* Event Cards Section */}
            <section className="p-4 bg-background-secondary">
                <div className="container max-w-screen-xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {events.map((event) => (
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
