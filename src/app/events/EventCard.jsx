"use client";

import React from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaBullseye, FaClock, FaDollarSign, FaExchangeAlt } from 'react-icons/fa';

/**
 * EventCard component displays the information about a specific event.
 */
const EventCard = ({ event }) => {
    // Display the date directly from the database without timezone conversion
    const eventDateString = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    /**
     * Formats time from 24 hour to 12 hour time with AM/PM.
     */
    const formatTime = (time24) => {
        const [hours, minutes] = time24.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    };

    const formattedStartTime = formatTime(event.signup_start);
    const formattedEndTime = formatTime(event.signup_end);

    // Get the current date and time
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get the event date at midnight
    const eventDate = new Date(event.date + 'T00:00:00');

    // Check if the event is in the past or today
    const isPastEvent = eventDate < today;

    // Check if the event is today
    const isTodayEvent = eventDate.getTime() === today.getTime();

    return (
        <div
            className={`flex flex-col bg-background-card border-l-4 shadow-md p-4 transition-transform transform hover:-translate-y-1 hover:shadow-lg relative group cursor-pointer rounded-lg ${isPastEvent ? 'border-past-event-text' : 'border-border-highlight'}`}
        >
            {/* Today's Event Badge */}
            {isTodayEvent && (
                <span className={`absolute -top-3 -left-3 text-xs font-bold px-2 py-1 rounded shadow-md rotate-[-10deg] transition-transform group-hover:rotate-[-5deg] group-hover:scale-110 ${isPastEvent ? 'bg-past-event-text text-past-event-badge' : 'bg-badge-today text-white'}`}>
                    Today!
                </span>
            )}
            {/* Special Event Badge */}
            {event.special_event && (
                <span className={`absolute -top-3 -left-3 text-xs font-bold px-2 py-1 rounded shadow-md rotate-[-10deg] transition-transform group-hover:rotate-[-5deg] group-hover:scale-110 ${isPastEvent ? 'bg-past-event-text text-past-event-badge' : 'bg-badge-special text-white'}`}>
                    {event.special_event}
                </span>
            )}

            {/* Event Title */}
            <h3 className={`text-lg font-medium mb-2 ${isPastEvent ? 'text-past-event-text' : 'text-text-highlight'}`}>
                {event.title}
            </h3>

            {/* Event Details */}
            <div className={`flex items-center mb-1 ${isPastEvent ? 'text-past-event-text' : 'text-text-default'}`}>
                <FaCalendarAlt className={`mr-2 ${isPastEvent ? 'text-past-event-text' : 'text-border-highlight'}`} />
                {eventDateString}
            </div>

            <div className={`flex items-center mb-1 ${isPastEvent ? 'text-past-event-text' : 'text-text-default'}`}>
                <FaBullseye className={`mr-2 ${isPastEvent ? 'text-past-event-text' : 'text-border-highlight'}`} />
                Games: {event.games}
            </div>

            <div className={`flex items-center mb-1 ${isPastEvent ? 'text-past-event-text' : 'text-text-default'}`}>
                <FaExchangeAlt className={`mr-2 ${isPastEvent ? 'text-past-event-text' : 'text-border-highlight'}`} />
                Draw Type: {event.draw_type}
            </div>
            {isPastEvent ? (
                <div className={`flex items-center mb-1 text-past-event-text`}>
                    <FaMapMarkerAlt className={`mr-2 text-past-event-text`} />
                    <span>{event.location}</span>
                </div>
            ) : (
                <div className={`flex items-center mb-1 text-text-default`}>
                    <FaMapMarkerAlt className={`mr-2 text-border-highlight`} />
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`link-style`}
                    >
                        {event.location}
                    </a>
                </div>
            )}

            <div className={`flex items-center mb-1 ${isPastEvent ? 'text-past-event-text' : 'text-text-default'}`}>
                <FaClock className={`mr-2 ${isPastEvent ? 'text-past-event-text' : 'text-border-highlight'}`} />
                Signups: {formattedStartTime} - {formattedEndTime}
            </div>

            <div className={`flex items-center mb-1 justify-between ${isPastEvent ? 'text-past-event-text' : 'text-text-default'}`}>
                <div className="flex items-center">
                    <FaDollarSign className={`mr-2 ${isPastEvent ? 'text-past-event-text' : 'text-border-highlight'}`} />
                    Entry Fee: ${event.entry_fee}
                </div>
            </div>
        </div>
    );
};

export default EventCard;
