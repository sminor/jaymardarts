import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const LocationCard = ({ location, onClick }) => {
    return (
        <div
            className="flex flex-col bg-background-card border-l-4 border-border-highlight shadow-md p-4 cursor-pointer transition-transform transform hover:scale-105 relative group"
            onClick={() => onClick(location)}
        >
            {location.isNew && (
                <span className="absolute -top-3 -left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md rotate-[-10deg] transition-transform group-hover:rotate-[-5deg] group-hover:scale-110">
                    New!
                </span>
            )}
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-text-highlight">
                    {location.name}
                </h3>
                <FaMapMarkerAlt size={24} className="text-border-highlight" />
            </div>
            <p className="text-text-card mb-1">{location.details}</p>
            <p className="text-text-muted mb-1">{location.address}</p>
            <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
            >
                Get Directions
            </a>
        </div>
    );
};

export default LocationCard;
