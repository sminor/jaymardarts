"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { Card } from '@/components/ui/Card';
import { CardContent } from '@/components/ui/CardContent';
import { Button } from '@/components/ui/Button';
import Footer from '@/components/Footer';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaChartBar, FaEnvelope, FaFacebook, FaLock } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const HomePage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [message, setMessage] = useState('Loading announcements...');

    useEffect(() => {
        const fetchAnnouncements = async () => {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
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
            {/* Header */}
            <header className="bg-background-header shadow-md p-4 flex justify-center items-center">
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
            <section className="p-4 bg-background-header relative">
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
                            className="relative pb-10"
                        >
                            {announcements.map((announcement) => (
                                <SwiperSlide key={announcement.id}>
                                    <Card className="bg-background-card border-2 border-border-highlight shadow-md">
                                        <CardContent>
                                            <h3 className="text-lg font-medium text-text-highlight">
                                                {announcement.title}
                                            </h3>
                                            <p className="text-text-card">{announcement.content}</p>
                                        </CardContent>
                                    </Card>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}

                    {/* Custom Pagination Container */}
                    <div className="swiper-pagination-custom flex justify-center mt-2"></div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="p-4 bg-background-header shadow-md">
                <div className="container max-w-screen-xl mx-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/locations" passHref>
                            <div className="flex flex-col items-center p-4 bg-background-button border-2 border-button-border text-button-text hover:bg-background-button-hover transition-colors cursor-pointer rounded-lg shadow-md">
                                <FaMapMarkerAlt size={32} />
                                <span className="mt-2">Locations</span>
                            </div>
                        </Link>
                        {[
                            { icon: FaCalendarAlt, label: 'Events' },
                            { icon: FaUsers, label: 'Leagues' },
                            { icon: FaChartBar, label: 'Stats' }
                        ].map(({ icon: Icon, label }, index) => (
                            <Button
                                key={index}
                                className="flex flex-col items-center p-4 bg-background-button border-2 border-button-border text-button-text hover:bg-background-button-hover transition-colors"
                            >
                                <Icon size={32} />
                                <span className="mt-2">{label}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default HomePage;
