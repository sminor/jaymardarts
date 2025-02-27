"use client";

import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const LeaguesPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [message, setMessage] = useState('Loading announcements...');

    useEffect(() => {
        const fetchAnnouncements = async () => {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .eq('page', 'leagues')
                .order('created_at', { ascending: false });

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
            <NavBar currentPage="Leagues" />

            {/* Heading Section */}
            <section className="bg-background-secondary">
                <div className="container max-w-screen-xl mx-auto p-4 bg-background-heading rounded-lg mt-4">
                    <h1 className="text-3xl font-bold mb-4 text-center text-text-highlight">Leagues</h1>
                    <p className="text-center mb-6">
                        Interested in joining a league? We offer competitive and recreational leagues for players of all skill levels.
                    </p>
                </div>
            </section>

            {/* Announcement Section - Modifications here */}
            {/* Removed mt-4 here to remove the gap */}
            <section className="p-8 relative bg-background-secondary rounded-lg">
                {/* Added this div to wrap the content */}
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
                            // Added the bg-background-announcement here to match the header color
                            className="relative pb-10 flex p-4 rounded-lg bg-background-announcement"
                        >
                            {announcements.map((announcement) => (
                                <SwiperSlide key={announcement.id}>
                                    {/* removed the background from here */}
                                    <div className="p-4">
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

            <Footer />
        </div>
    );
};

export default LeaguesPage;
