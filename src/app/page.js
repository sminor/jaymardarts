"use client";

import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { CardContent } from '@/components/ui/CardContent';
import { Button } from '@/components/ui/Button';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaChartBar, FaEnvelope, FaFacebook, FaLock } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const HomePage = () => {
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
            <SwiperSlide>
              <Card className="bg-background-card border-2 border-border-highlight shadow-md">
                <CardContent>
                  <h3 className="text-lg font-medium text-text-highlight">Upcoming Tournament!</h3>
                  <p className="text-text-card">Join us for the Summer Darts Tournament on August 12th. This is a great opportunity to meet fellow players, compete for prizes, and enjoy a fun day of darts!</p>
                </CardContent>
              </Card>
            </SwiperSlide>
            <SwiperSlide>
              <Card className="bg-background-card border-2 border-border-highlight shadow-md">
                <CardContent>
                  <h3 className="text-lg font-medium text-text-highlight">New League Season</h3>
                  <p className="text-text-card">Registration for the Fall League is now open. Sign up today to secure your spot and compete with the best in town!</p>
                </CardContent>
              </Card>
            </SwiperSlide>
            <SwiperSlide>
              <Card className="bg-background-card border-2 border-border-highlight shadow-md">
                <CardContent>
                  <h3 className="text-lg font-medium text-text-highlight">Weekly Darts Meetup</h3>
                  <p className="text-text-card">Every Thursday at 7 PM. Come to our weekly meetup for casual games, practice, and community fun. All skill levels welcome!</p>
                </CardContent>
              </Card>
            </SwiperSlide>
          </Swiper>

          {/* Custom Pagination Container */}
          <div className="swiper-pagination-custom flex justify-center mt-2"></div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="p-4 bg-background-header shadow-md">
        <div className="container max-w-screen-xl mx-auto">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: FaMapMarkerAlt, label: 'Locations' },
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
      <footer className="p-4 bg-background-footer text-text-default text-center mt-auto">
        <div className="container max-w-screen-xl mx-auto">
          <div className="flex justify-center space-x-6 mb-2 text-sm">
            {[
              { href: '#', icon: FaEnvelope, label: 'Contact Us' },
              { href: 'https://facebook.com', icon: FaFacebook, label: 'Facebook' },
              { href: '#', icon: FaLock, label: 'Admin Login' }
            ].map(({ href, icon: Icon, label }, index) => (
              <a key={index} href={href} target="_blank" className="flex items-center space-x-1 text-text-default hover:text-text-highlight">
                <Icon size={14} />
                <span>{label}</span>
              </a>
            ))}
          </div>
          &copy; 2025 Jaymar Darts. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
