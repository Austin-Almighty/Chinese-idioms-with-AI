import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ParticleBackground = () => {
    const { theme } = useTheme();

    // Generate static random particles
    const particles = useMemo(() => {
        const count = 60; // Doubled density
        const isDark = theme === 'dark';

        const darkColors = [
            'bg-blue-400',
            'bg-purple-500',
            'bg-indigo-400',
            'bg-slate-300',
            'bg-emerald-400'
        ];

        const lightColors = [
            'bg-blue-500',
            'bg-purple-600',
            'bg-indigo-500',
            'bg-slate-400',
            'bg-emerald-500'
        ];

        const colors = isDark ? darkColors : lightColors;

        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // 0-100% width
            size: Math.random() * 12 + 4, // Doubled size (4-16px)
            color: colors[Math.floor(Math.random() * colors.length)],
            duration: Math.random() * 7.5 + 5, // Doubled speed (halved duration: 5-12.5s)
            delay: Math.random() * 20, // 0-20s delay
            opacity: Math.random() * 0.3 + 0.1 // 0.1-0.4 opacity
        }));
    }, [theme]);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {particles.map((p) => (
                <motion.div
                    key={`${p.id}-${theme}`} // Force re-render on theme change
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
