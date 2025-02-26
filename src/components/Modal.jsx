import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        // Prevent body scrolling when the modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col items-center overflow-y-auto p-4"> {/* Full viewport, top alignment, padding */}
            <div className="bg-background-card p-4 rounded-lg shadow-lg text-text-default relative w-full max-h-full overflow-y-auto md:container md:max-w-screen-xl md:mx-auto"> {/* Full width, scroll, remove max height, add desktop container */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-text-default hover:text-text-highlight"
                >
                    X
                </button>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
