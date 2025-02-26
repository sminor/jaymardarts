"use client";

import React, { useState, useEffect } from 'react';

import { supabase } from '@/lib/supabaseClient';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import EventCard from './EventCard';

/**
 * EventsPage component displays a list of upcoming events.
 */
const EventsPage = () => {
    // State to hold the list of events
    const [events, setEvents] = useState([]);

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
