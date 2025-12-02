import React, { useState, useEffect } from 'react';

const Typewriter = ({ text, speed = 30, onComplete, onType }) => {
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        // If text content changes drastically (e.g. replaced "..." with actual text),
        // ensure we don't exceed the new length.
        if (visibleCount > text.length) {
            setVisibleCount(text.length);
        }
    }, [text, visibleCount]);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleCount((prev) => {
                if (prev < text.length) {
                    return prev + 1;
                }
                return prev;
            });
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    useEffect(() => {
        if (visibleCount > 0 && visibleCount <= text.length) {
            if (onType) onType();
        }
        if (visibleCount === text.length && onComplete) {
            onComplete();
        }
    }, [visibleCount, text.length, onComplete, onType]);

    // If text is "...", we might want to start from 0 if it changes to "Story"?
    // But "..." -> "Story" (len 3 -> 5). visibleCount 3.
    // Shows "Sto".
    // This is acceptable transition. 
    // If we want to reset on *completely new* text, we'd need a key or a ref to track previous text.
    // But for streaming, "..." -> "S" -> "St" -> "Sto" is the pattern.
    // The "..." placeholder is the only edge case.
    // If "..." (len 3) -> "The" (len 3). visible 3. Shows "The". Instant.
    // That's fine.

    return <span>{text.slice(0, visibleCount)}</span>;
};

export default Typewriter;
