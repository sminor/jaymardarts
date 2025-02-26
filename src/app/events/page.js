"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import EventCard from './EventCard';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const EventsPage = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: true });

            if (error) {
                console.error('Error fetching events:', error);
            } else {
                console.log('Fetched events data:', data);
                setEvents(data);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen bg-background-main text-text-default flex flex-col justify-between">
            <NavBar currentPage="Events" />

            <div className="container max-w-screen-xl mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4 text-center text-text-highlight">Upcoming Events</h1>
                <p className="text-center mb-6 text-text-card">
                Whether you&apos;re a seasoned player or just starting out, our events are the perfect opportunity to connect with the dart community. We regularly host a variety of tournaments, social nights, and special events that bring together players of all skill levels.
                </p>
            </div>

            <section className="p-4 bg-background-main">
                <div className="container max-w-screen-xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default EventsPage;
