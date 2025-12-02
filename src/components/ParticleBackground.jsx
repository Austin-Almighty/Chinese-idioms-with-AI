import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const ParticleBackground = () => {
    // Generate static random particles
    const particles = useMemo(() => {
        const count = 60; // Doubled density
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // 0-100% width
            size: Math.random() * 12 + 4, // Doubled size (4-16px)
            color: [
                'bg-blue-400',
                'bg-purple-500',
                'bg-indigo-400',
                'bg-slate-300',
                'bg-emerald-400'
            ][Math.floor(Math.random() * 5)],
            duration: Math.random() * 7.5 + 5, // Doubled speed (halved duration: 5-12.5s)
            delay: Math.random() * 20, // 0-20s delay
            opacity: Math.random() * 0.3 + 0.1 // 0.1-0.4 opacity
        }));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className={`absolute rounded-full ${p.color}`}
                    style={{
                        left: `${p.x}%`,
                        width: p.size,
                        height: p.size,
                        opacity: p.opacity,
                        bottom: '-10px' // Start slightly below
                    }}
                    animate={{
                        y: [0, -window.innerHeight - 50], // Move up past screen height
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: -p.delay // Negative delay to start mid-animation
                    }}
                />
            ))}
        </div>
    );
};

export default ParticleBackground;
