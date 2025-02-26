import React from 'react';
import { FaEnvelope, FaFacebookSquare, FaLock } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="p-4 bg-background-footer text-text-default text-center mt-auto">
            <div className="container max-w-screen-xl mx-auto">
                <div className="flex justify-center space-x-6 mb-2 text-sm">
                    {[
                        { href: '#', icon: FaEnvelope, label: 'Contact Us' },
                        { href: 'https://www.facebook.com/jaymardarts', icon: FaFacebookSquare, label: 'Facebook' },
                        { href: '#', icon: FaLock, label: 'Admin Login' }
                    ].map(({ href, icon: Icon, label }, index) => (
                        <a
                            key={index}
                            href={href}
                            target="_blank"
                            className="flex items-center space-x-1 text-text-default hover:text-text-highlight"
                        >
                            <Icon size={14} />
                            <span>{label}</span>
                        </a>
                    ))}
                </div>
                &copy; 2025 Jaymar Darts. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
