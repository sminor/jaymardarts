"use client";

import React from 'react';
import Modal from '@/components/Modal';

/**
 * CodeOfConductModal component displays the code of conduct information.
 */
const CodeOfConductModal = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-4">
                {/* Code of Conduct Modal Content */}
                <h2 className="text-2xl font-bold mb-4 text-text-highlight">Jaymar Darts Code of Conduct</h2>

                <p className="mb-4">
                    At Jaymar Darts, we are committed to fostering a welcoming, inclusive, and enjoyable environment for all players. Our Code of Conduct sets the expectations for behavior, sportsmanship, and respect at all our events.
                </p>

                <h3 className="text-lg font-medium mb-2">Respect and Inclusion</h3>
                <p className="mb-4">
                    We expect all participants to treat each other with respect, regardless of skill level, gender, race, religion, or any other personal characteristic. Discriminatory, harassing, or offensive behavior will not be tolerated. Our tournament operators are dedicated volunteers—please show them the same respect you would expect in return.
                </p>

                <h3 className="text-lg font-medium mb-2">Sportsmanship and Fair Play</h3>
                <p className="mb-4">
                    Good sportsmanship is fundamental to our community. Play by the rules, demonstrate grace in both victory and defeat, and always show respect to your teammates and opponents. Cheating or any attempt to gain an unfair advantage is strictly prohibited and may result in disqualification.
                </p>

                <h3 className="text-lg font-medium mb-2">Rule Compliance</h3>
                <p className="mb-4">
                    All players are responsible for understanding and adhering to the official rules of play. If you have any questions, please ask a tournament operator. Our tournament operators will make decisions in the spirit of fair play, and their decisions are final, intended to keep the tournament fair and fun for everyone.
                </p>

                <h3 className="text-lg font-medium mb-2">Conflict Resolution</h3>
                <p className="mb-4">
                    If any concerns or issues arise during the event, please bring them to the attention of a tournament operator. We are here to help resolve matters quickly and fairly to ensure the best experience for all.
                </p>

                <h3 className="text-lg font-medium mb-2">Enjoy the Game</h3>
                <p className="mb-4">
                    Most importantly, remember that we are all here to have fun and enjoy the game of darts. A positive attitude and good sportsmanship help create a great experience for everyone!
                </p>

                <p className="mt-4">
                    By participating in Jaymar Darts events, you agree to abide by this Code of Conduct. We appreciate your cooperation in making our tournaments safe, respectful, and enjoyable for all.
                </p>
            </div>
        </Modal>
    );
};

export default CodeOfConductModal;
