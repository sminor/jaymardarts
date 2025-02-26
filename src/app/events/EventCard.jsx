"use client";

import React from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaBullseye, FaClock, FaDollarSign, FaExchangeAlt } from 'react-icons/fa';

const EventCard = ({ event }) => {
    // Display the date directly from the database without timezone conversion
    const eventDateString = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    // Format the sign-up start and end times to 12-hour format with AM/PM
    const formatTime = (time24) => {
        const [hours, minutes] = time24.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    };

    const formattedStartTime = formatTime(event.signup_start);
    const formattedEndTime = formatTime(event.signup_end);

    return (
        <div 
            className="flex flex-col bg-background-card border-l-4 border-border-highlight shadow-md p-4 transition-transform transform hover:translate-y-[-5px] hover:shadow-lg relative group cursor-pointer"
        >
            {event.special_event && (
                <span className="absolute -top-3 -left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md rotate-[-10deg] transition-transform group-hover:rotate-[-5deg] group-hover:scale-110">
                    {event.special_event}
                </span>
            )}

            <h3 className="text-lg font-medium text-text-highlight mb-2">
                {event.title}
            </h3>

            <div className="flex items-center mb-1 text-text-card">
                <FaCalendarAlt className="mr-2 text-border-highlight" />
                {eventDateString}
            </div>

            <div className="flex items-center mb-1 text-text-card">
                <FaBullseye className="mr-2 text-border-highlight" />
                Games: {event.games}
            </div>

            <div className="flex items-center mb-1 text-text-card">
                <FaExchangeAlt className="mr-2 text-border-highlight" />
                Draw Type: {event.draw_type}
            </div>

            <div className="flex items-center mb-1 text-text-card">
                <FaMapMarkerAlt className="mr-2 text-border-highlight" />
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                >
                    {event.location}
                </a>
            </div>

            <div className="flex items-center mb-1 text-text-card">
                <FaClock className="mr-2 text-border-highlight" />
                Signups: {formattedStartTime} - {formattedEndTime}
            </div>

            <div className="flex items-center mb-1 text-text-card justify-between">
                <div className="flex items-center">
                    <FaDollarSign className="mr-2 text-border-highlight" />
                    Entry Fee: ${event.entry_fee}
                </div>
            </div>
        </div>
    );
};

export default EventCard;
