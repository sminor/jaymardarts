"use client";

import React from "react";
import Link from "next/link";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaChartBar, FaHome } from "react-icons/fa";

const NavBar = ({ currentPage }) => {
    const navLinks = [
        { href: "/", label: "Home", icon: FaHome },
        { href: "/locations", label: "Locations", icon: FaMapMarkerAlt },
        { href: "/events", label: "Events", icon: FaCalendarAlt },
        { href: "/leagues", label: "Leagues", icon: FaUsers },
        { href: "/stats", label: "Stats", icon: FaChartBar },
    ];

    return (
        <nav className="bg-background-header-dark p-4">
            <div className="container max-w-screen-xl mx-auto">
                <div className="grid grid-cols-4 gap-4">
                    {navLinks.map(({ href, label, icon: Icon }) => {
                        if (label === currentPage) return null;

                        return (
                            <Link href={href} passHref key={label}>
                                <div
                                    className="button-style flex flex-col items-center justify-center h-full"
                                >
                                    <div className="flex justify-center">
                                      <Icon className="button-style-icon" size={32} />
                                    </div>
                                    <span className="button-style-text">{label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
