"use client";

import React from "react";
import Link from "next/link";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaChartBar, FaHome } from "react-icons/fa";

const NavBar = ({ currentPage }) => {
    const navLinks = [
        { href: "/", label: "Home", icon: FaHome },
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
                                    className="flex flex-col items-center justify-center p-4 bg-background-button border-2 border-button-border text-button-text hover:bg-background-button-hover transition-colors cursor-pointer rounded-lg shadow-md h-full"
                                >
                                    <Icon size={32} />
                                    <span className="mt-2 text-sm">{label}</span>
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
