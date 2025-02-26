"use client";

import React, { useState, useEffect } from 'react';
import Modal from '@/components/Modal';

/**
 * NewPlayerModal component displays information for new players.
 */
const NewPlayerModal = ({ isOpen, onClose }) => {
    const [isAndroid, setIsAndroid] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isClient, setIsClient] = useState(false); // New state to track if we are on the client side

    useEffect(() => {
        // Check if we are in the client side
        setIsClient(true)

        // This code will only run in the browser (after mounting)
        if (typeof window !== 'undefined') {
          const isAndroidDevice = /android/i.test(navigator.userAgent);
          const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
          setIsAndroid(isAndroidDevice);
          setIsIOS(isIOSDevice);
        }
    }, []); // Empty dependency array means this runs only once after the component mounts

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <div className="p-4">
              {/* New Player Modal Content */}
              <h2 className="text-2xl font-bold mb-4 text-text-highlight">New Player Information</h2>

              <p className="mb-4">We’re so excited to have you join us! Whether you’re brand new to darts or just new to our events, we want you to feel right at home. Our goal is for everyone to have a great time, no matter your skill level.</p>

              <h3 className="text-lg font-medium mb-2">When to Arrive:</h3>
              <p className="mb-4">To help everything run smoothly, please plan to arrive at least 30 minutes before sign-ups start. This gives you time to settle in, meet some friendly faces, and get any questions answered before the action begins.</p>

              <h3 className="text-lg font-medium mb-2">Get the Bullshooter Live App:</h3>
              <p className="mb-4">
                  Before you arrive, make sure to download the Bullshooter Live app from the{' '}
                  {isClient && // Only render this part if we are on the client side
                    (isAndroid ? (
                        <a href="https://play.google.com/store/apps/details?id=com.arachnid.bslive" target="_blank" rel="noopener noreferrer" className="link-style">
                            Google Play Store
                        </a>
                    ) : isIOS ? (
                        <a href="https://apps.apple.com/us/app/bullshooter-live/id717480327" target="_blank" rel="noopener noreferrer" className="link-style">
                            Apple App Store
                        </a>
                    ) : (
                        <span>Apple App Store or Google Play Store.</span>
                    ))}
                  {' '}Once you’ve got it, sign up for an account—it’ll make things much easier on game day!
              </p>

              <h3 className="text-lg font-medium mb-2">Bring Your Darts (or Use Ours!):</h3>
              <p className="mb-4">If you have your own soft tip darts, feel free to bring them along! Just make sure they weigh 20 grams or less. No darts? No problem! We’ll have house darts available for you to use.</p>

              <h3 className="text-lg font-medium mb-2">New to Our Tournaments? Let's Get You Rated!</h3>
              <p className="mb-4">If this is your first time playing in one of our tournaments, we’ll need to get a rating for you. Don’t worry—this is super simple! We’ll usually have you play a few warm-up games with another player before the tournament starts to help us place you correctly and ensure fair and fun matches for everyone.</p>

              <p className="mb-4">If you’ve played before and already know your PPD (Points Per Dart) or MPR (Marks Per Round) numbers, let us know! We can often use that information to get you set up even faster.</p>
              
              <h3 className="text-lg font-medium mb-2">Already using the Bullshooter App?</h3>
              <p className="mb-4">That’s awesome! If you’ve been playing online matches through the Bullshooter Live app, we can often pull your rating directly from there. Just let us know, and we’ll take care of the rest!</p>

              <h3 className="text-lg font-medium mb-2">No Partner? No Worries!</h3>
              <p className="mb-4">If you’re worried about not having a partner or being new to the game, don’t stress! We’re all about having fun and making new friends. Many of our events can pair you up with a partner, and there are always people happy to help if you need tips or guidance.</p>

              <h3 className="text-lg font-medium mb-2">First Time? Let Us Know!</h3>
              <p className="mb-4">If this is your first time, please let us know! We love welcoming new players, and our community is super supportive. Everyone was new once, and you’ll find plenty of folks eager to show you the ropes.</p>

              <h3 className="text-lg font-medium mb-2">Most Important: Have Fun!</h3>
              <p>Win or lose, the main thing is to enjoy yourself. We’re here to share a love of darts, connect with great people, and make sure everyone leaves with a smile.</p>

              <p className="mt-4">If you have any questions, don’t hesitate to ask—before, during, or after the event. We can’t wait to see you there!</p>
          </div>
        </Modal>
    );
};

export default NewPlayerModal;
