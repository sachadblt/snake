import { useState, useEffect } from 'react';

const KONAMI_CODE = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
];

export const useKonamiCode = () => {
    const [isActivated, setIsActivated] = useState(false);
    const [inputSequence, setInputSequence] = useState([]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            // If already activated, we might want to ignore or allow toggling off.
            // For now, let's just keep listening to allow re-triggering or just stop.
            // User requirement: "toggle the visibility". So we should allow toggling.

            const { key } = event;

            setInputSequence((prev) => {
                const newSequence = [...prev, key];

                // Keep only the last N keys where N is the length of the Konami code
                if (newSequence.length > KONAMI_CODE.length) {
                    newSequence.shift();
                }

                // Check if the sequence matches
                if (JSON.stringify(newSequence) === JSON.stringify(KONAMI_CODE)) {
                    setIsActivated((prevActivated) => !prevActivated);
                    return []; // Reset sequence after activation
                }

                return newSequence;
            });
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return { isActivated, setIsActivated };
};
