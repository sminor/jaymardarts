"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaChartBar } from 'react-icons/fa';

import { supabase } from '@/lib/supabaseClient';
import Footer from '@/components/Footer';

import 'swiper/css';
import 'swiper/css/pagination';

const HomePage = () => {
    // State for managing announcements and loading message
    const [announcements, setAnnouncements] = useState([]);
    const [message, setMessage] = useState('Loading announcements...');

    // Fetch announcements from Supabase on component mount
    useEffect(() => {
        const fetchAnnouncements = async () => {
            // Retrieve announcements from the database, ordered by creation date (newest first)
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .eq('page', 'home') // Only get home page announcements
                .order('created_at', { ascending: false });

            // Handle errors or set announcements if successful
            if (error) {
                setMessage(`Error: ${error.message}`);
            } else if (data.length === 0) {
                setMessage('No announcements available.');
            } else {
                setAnnouncements(data);
                setMessage('');
            }
        };

        fetchAnnouncements();
    }, []);

    return (
        <div className="min-h-screen bg-background-main text-text-default flex flex-col justify-between">
            {/* Header */}
            <header className="p-4 flex justify-center items-center">
                <div className="container max-w-screen-xl mx-auto flex justify-center">
                    <div className="relative h-48 md:h-72 lg:h-96 xl:h-120 w-48 md:w-72 lg:w-96 xl:w-120">
                        <Image
                            src="/logo.png"
                            alt="Jaymar Darts Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
            </header>

            {/* Announcements Section */}
            <section className="p-8 mt-4 relative bg-background-secondary rounded-lg">
                <div className="container max-w-screen-xl mx-auto">
                    {message ? (
                        <p className="text-center text-text-default">{message}</p>
                    ) : (
                        <Swiper
                            spaceBetween={10}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{ delay: 5000 }}
                            pagination={{
                                clickable: true,
                                el: '.swiper-pagination-custom',
                            }}
                            modules={[Autoplay, Pagination]}
                            className="relative pb-10 flex p-4 rounded-lg"
                        >
                            {announcements.map((announcement) => (
                                <SwiperSlide key={announcement.id}>
                                    <div className="bg-background-announcement p-4">
                                        <h3 className="text-lg font-medium text-text-highlight pb-2">
                                            {announcement.title}
                                        </h3>
                                        <div
                                            className="text-text-default announcement-content"
                                            dangerouslySetInnerHTML={{ __html: announcement.content }}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}

                    <div className="swiper-pagination-custom"></div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="p-4 bg-background-secondary">
                <div className="container max-w-screen-xl mx-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/locations" passHref>
                            <div className="button-style flex-col">
                                <FaMapMarkerAlt className="button-style-icon" size={32} />
                                <span className="button-style-text">Locations</span>
                            </div>
                        </Link>
                        <Link href="/events" passHref>
                            <div className="button-style flex-col">
                                <FaCalendarAlt className="button-style-icon" size={32} />
                                <span className="button-style-text">Events</span>
                            </div>
                        </Link>
                        <Link href="/leagues" passHref>
                            <div className="button-style flex-col">
                                <FaUsers className="button-style-icon" size={32} />
                                <span className="button-style-text">Leagues</span>
                            </div>
                        </Link>
                        <Link href="/stats" passHref>
                            <div className="button-style flex-col">
                                <FaChartBar className="button-style-icon" size={32} />
                                <span className="button-style-text">Stats</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HomePage;
