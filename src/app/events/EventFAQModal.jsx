"use client";

import React, { useState } from 'react';
import Modal from '@/components/Modal';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

/**
 * EventFAQModal component displays the Frequently Asked Questions related to events.
 */
const EventFAQModal = ({ isOpen, onClose }) => {
    // Array of all questions and answers
    const faqs = [
        {
            id: "signup-times",
            question: "What are the sign-up times?",
            answer: "Sign-up times vary by event. Be sure to check each event’s details for specific times, and please arrive early, as we cannot accommodate late sign-ups.",
        },
        {
            id: "event-start-time",
            question: "What time does the event start?",
            answer: "We aim to start the first match 30 minutes after sign-ups close. Start times can vary depending on the number of participants, so please be patient as we set up the matches.",
        },
        {
            id: "how-to-register",
            question: "How do I register for events?",
            answer: "To register for an event, simply show up at the event location, give your name to the tournament operator, and pay your entry fee. Please note: We accept cash only.",
        },
        {
            id: "age-restrictions",
            question: "Are there age restrictions for tournaments?",
            answer: "We do not impose age restrictions for our tournaments. However, please check with the event venue directly, as many venues have age limits.",
        },
        {
            id: "beginners-play",
            question: "Can beginners play in tournaments?",
            answer: "Absolutely! We welcome players of all skill levels. Tournaments are a great way to learn, have fun, and meet fellow dart enthusiasts.",
        },
        {
            id: "what-to-bring",
            question: "What should I bring to the event?",
            answer: "Just bring your darts (if you have them), some cash for entry and board fees, and a positive attitude! Everything else you need will be provided at the event.",
        },
        {
            id: "cost-to-play",
            question: "How much does it cost to play?",
            answer: "Entry fees vary by event. Most events have a $10 per person entry fee. Depending on how many games you play, board fees will vary. Typically, players should budget around $25 for the entry fee and board fees combined. Check the event details for specific costs.",
        },
        {
            id: "bring-own-darts",
            question: "Do I need to bring my own darts?",
            answer: "You’re welcome to bring your own soft-tip darts (under 20 grams). If you don’t have your own, no worries! We provide house darts free of charge.",
        },
        {
            id: "no-partner",
            question: "What if I don’t have a partner?",
            answer: (
                <>
                    <p>Not a problem! Most of our events allow individual sign-ups, and we’ll pair you with a partner. Many events use a draw format, where lower-rated players are paired with higher-rated players to keep things fair and fun.</p>
                    <p>For "Bring" events, you’ll need to bring your own partner, and the team must meet the event’s rating cap. For example, in a "20-point bring," the combined rating of both partners cannot exceed 20 points. Check each event's details for specific rating caps.</p>
                </>
            ),
        },
        {
            id: "tournament-types",
            question: "What types of tournaments do you offer?",
            answer: (
                <ul>
                    <li>A/B Draw: Players are split into two skill groups, with one player from each group forming a team.</li>
                    <li>Blind Draw: Players are randomly paired with a partner.</li>
                    <li>Low Player Pick: Lower-rated players get to choose their partners.</li>
                    <li>Ladies Pick: Ladies have the opportunity to select their partners.</li>
                    <li>Partner Brings: You bring your own partner, subject to any rating caps for the event.</li>
                </ul>
            ),
        },
        {
            id: "game-types",
            question: "What are the common game types played?",
            answer: (
                <ul>
                    <li>Cricket: A strategy game focusing on hitting specific numbers (15-20 and the bullseye) to score points.</li>
                    <li>x01 Games (e.g., 301, 501): Players start with a set score (e.g., 301 or 501) and work down to zero. In soft-tip tournaments, you typically do not need to double out. If a specific event requires a double or "master out," this will be noted in the event details.</li>
                </ul>
            ),
        },
        {
            id: "player-ratings",
            question: "How are player ratings handled?",
            answer: "New players usually play a few warm-up games to establish an initial rating. If you've used the Bullshooter app or played in other leagues, we can often use that data as a starting point. Our tournament software tracks performance over time to ensure ratings remain accurate and fair.",
        },
        {
            id: "what-is-handicap",
            question: "What is a handicap, and how does it work?",
            answer: "A handicap helps level the playing field by giving lower-rated players a slight advantage. Depending on the event, the handicap might adjust the starting score in x01 games or modify scoring rules in Cricket. Check event details for specific handicap information.",
        },
        {
            id: "rating-cap",
            question: "How does the rating cap work in 'Bring' events?",
            answer: `For "Bring" events, a rating cap sets the maximum combined rating for a team. For example, in a "20-point bring," the total of both players' ratings cannot exceed 20. This keeps the competition balanced and fair.`,
        },
    ];

    // State to track the currently displayed FAQ
    const [currentFAQIndex, setCurrentFAQIndex] = useState(null); // Initialize to null

    // Function to handle clicking on table of contents links
    const handleTOCClick = (id) => {
        const index = faqs.findIndex((faq) => faq.id === id);
        if (index !== -1) {
            setCurrentFAQIndex(index);
        }
    };

    // Function to go to the previous FAQ
    const handlePreviousClick = () => {
        setCurrentFAQIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    // Function to go to the next FAQ
    const handleNextClick = () => {
        setCurrentFAQIndex((prevIndex) => Math.min(prevIndex + 1, faqs.length - 1));
    };

    const currentFAQ = currentFAQIndex !== null ? faqs[currentFAQIndex] : null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-4">
                {/* FAQ Modal Content */}
                <h2 className="text-2xl font-bold mb-4 text-text-highlight">Frequently Asked Questions</h2>

                {/* Table of Contents */}
                <div className="mb-4">
                    <h4 className="font-medium text-text-default">Table of Contents</h4>
                    <ul className="list-disc list-inside text-text-default">
                        {faqs.map((faq, index) => (
                            <li key={faq.id}>
                                <a
                                    href={`#${faq.id}`}
                                    className={`link-style ${currentFAQIndex === index ? "font-bold" : ""
                                        }`}
                                    onClick={() => handleTOCClick(faq.id)}
                                >
                                    {faq.question}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Current FAQ Content */}
                {currentFAQ && (
                    <>
                        <h3 id={currentFAQ.id} className="text-lg font-medium mb-2">
                            {currentFAQ.question}
                        </h3>
                        <div className="mb-4">{typeof currentFAQ.answer === 'string' ? <p>{currentFAQ.answer}</p> : currentFAQ.answer}</div>
                    </>
                )}

                {/* Navigation Buttons */}
                {currentFAQIndex !== null && (
                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            onClick={handlePreviousClick}
                            className={`button-style flex items-center ${currentFAQIndex === 0 ? "text-gray-400 bg-background-secondary hover:bg-background-secondary opacity-50 cursor-not-allowed" : ""
                                }`}
                            disabled={currentFAQIndex === 0}
                        >
                            <FaArrowLeft />
                        </button>

                        <button
                            onClick={handleNextClick}
                            className={`button-style flex items-center ${currentFAQIndex === faqs.length - 1 ? "text-gray-400 bg-background-secondary hover:bg-background-secondary opacity-50 cursor-not-allowed" : ""
                                }`}
                            disabled={currentFAQIndex === faqs.length - 1}
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default EventFAQModal;
