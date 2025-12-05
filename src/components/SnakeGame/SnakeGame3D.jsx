import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// --- Music Imports ---
import music1 from '../../assets/SnakeGameMusic/music1.mp3';
import music2 from '../../assets/SnakeGameMusic/music2.mp3';
import music3 from '../../assets/SnakeGameMusic/music3.mp3';
import music4 from '../../assets/SnakeGameMusic/music4.mp3';
import music5 from '../../assets/SnakeGameMusic/music5.mp3';
import music6 from '../../assets/SnakeGameMusic/music6.mp3';
import music7 from '../../assets/SnakeGameMusic/music7.mp3';
import music8 from '../../assets/SnakeGameMusic/music8.mp3';
import music9 from '../../assets/SnakeGameMusic/music9.mp3';
import music10 from '../../assets/SnakeGameMusic/music10.mp3';
import music11 from '../../assets/SnakeGameMusic/music11.mp3';
import music12 from '../../assets/SnakeGameMusic/music12.mp3';
import music13 from '../../assets/SnakeGameMusic/music13.mp3';
import music14 from '../../assets/SnakeGameMusic/music14.mp3';
import music15 from '../../assets/SnakeGameMusic/music15.mp3';
import music16 from '../../assets/SnakeGameMusic/music16.mp3';
import pommeSound from '../../assets/SnakeGameMusic/pomme.mp3';

const MUSIC_TRACKS = [
    music1, music2, music3, music4, music5, music6, music7, music8,
    music9, music10, music11, music12, music13, music14, music15, music16
];

// --- Constants & Config ---
const GRID_SIZE = 16;
const CELL_SIZE = 1;
const INITIAL_SNAKE = [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -2, y: 0 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

const MODES = {
    CLASSIC: 'CLASSIC',
    RIVER: 'RIVER',
    CLASSIC: 'CLASSIC',
    RIVER: 'RIVER',
    CAPY_FPS: 'CAPY_FPS',
    BURROW: 'BURROW',
};

const COLORS = {
    grass: '#81C784',
    path: '#AED581',
    water: '#4FC3F7',
    bridge: '#D7CCC8',
    capyFur: '#8D6E63',
    capyNose: '#4E342E',
    food: '#FF7043',
    wood: '#795548',
    leaf: '#66BB6A',
    skyTop: '#4FC3F7',
    skyBottom: '#E1F5FE',
    hill: '#66BB6A',
    fence: '#8D6E63',
    rock: '#9E9E9E',
    bush: '#4CAF50',
    lilypad: '#81C784',
    burrowA: '#FFEB3B', // Yellow
    burrowB: '#AB47BC', // Purple
};

const CAPY_SKINS = [
    { id: 'classic', name: 'Classique', color: COLORS.capyFur },
    { id: 'red', name: 'Rouge', color: '#EF5350' },
    { id: 'blue', name: 'Bleu', color: '#42A5F5' },
    { id: 'green', name: 'Vert', color: '#66BB6A' },
    { id: 'pink', name: 'Rose', color: '#EC407A' },
    { id: 'purple', name: 'Violet', color: '#AB47BC' },
    { id: 'gold', name: 'Or', color: '#FFD700' },
    { id: 'rainbow', name: 'Arc-en-ciel', color: '#FFFFFF', isMulticolor: true },
];

const FRUIT_TYPES = [
    { id: 'apple', emoji: '🍎', color: '#FF5252' },
    { id: 'pear', emoji: '🍐', color: '#C0CA33' },
    { id: 'orange', emoji: '🍊', color: '#FB8C00' },
    { id: 'banana', emoji: '🍌', color: '#FFD600' },
    { id: 'watermelon', emoji: '🍉', color: '#E91E63' },
    { id: 'grape', emoji: '🍇', color: '#7B1FA2' },
    { id: 'strawberry', emoji: '🍓', color: '#F44336' },
    { id: 'cherry', emoji: '🍒', color: '#D32F2F' },
];

const MAP_THEMES = [
    { id: 'forest', name: 'Forêt', ground: COLORS.grass, groundAlt: '#81C784', sky: '#E1F5FE', decor: 'tree' },
    { id: 'desert', name: 'Désert', ground: '#FBC02D', groundAlt: '#FFF176', sky: '#FFCC80', decor: 'cactus' },
    { id: 'snow', name: 'Neige', ground: '#E1F5FE', groundAlt: '#B3E5FC', sky: '#E0F7FA', decor: 'snow_tree' },
];

// --- Audio Manager ---
let audioCtx = null;


const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

const playSound = (type, isMuted, volume = 0.3) => {
    if (isMuted) return;
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'eat') {
        const audio = new Audio(pommeSound);
        // Boost eat sound volume to MAX
        audio.volume = Math.min(volume * 5.0, 1.0);
        audio.play().catch(e => console.log("Audio play failed:", e));
    } else if (type === 'die') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.5);
        gain.gain.setValueAtTime(0.3 * volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
    } else if (type === 'step') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        gain.gain.setValueAtTime(0.05 * volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    } else if (type === 'start') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
        gain.gain.setValueAtTime(0.2 * volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'click') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.1 * volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    } else if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        gain.gain.setValueAtTime(0.05 * volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    } else if (type === 'tick') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.1 * volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    }
};

// --- Level Configurations (Waypoint System) ---
const LEVEL_CONFIGS = [
    // 1. The Cross (Wide)
    {
        paths: [
            [{ x: -8, y: 0 }, { x: 8, y: 0 }],
            [{ x: 0, y: -8 }, { x: 0, y: 8 }]
        ],
        bridges: [{ x: -4, y: 0 }, { x: 4, y: 0 }, { x: 0, y: -4 }, { x: 0, y: 4 }, { x: 0, y: 0 }]
    },
    // 2. The Moat (Wide & Connected)
    {
        paths: [
            [{ x: -6, y: -6 }, { x: 6, y: -6 }, { x: 6, y: 6 }, { x: -6, y: 6 }, { x: -6, y: -6 }]
        ],
        bridges: [{ x: 0, y: -6 }, { x: 0, y: 6 }, { x: -6, y: 0 }, { x: 6, y: 0 }, { x: 0, y: -6 }]
    },
    // 3. Dual Rivers (Wide Spacing)
    {
        paths: [
            [{ x: -5, y: -8 }, { x: -5, y: 8 }],
            [{ x: 5, y: -8 }, { x: 5, y: 8 }]
        ],
        bridges: [{ x: -5, y: 0 }, { x: 5, y: 0 }, { x: -5, y: 4 }, { x: 5, y: -4 }]
    },
    // 4. ZigZag Canyon (Simplified)
    {
        paths: [
            [{ x: -8, y: 5 }, { x: -3, y: 5 }, { x: -3, y: -3 }, { x: 4, y: -3 }, { x: 4, y: -8 }]
        ],
        bridges: [{ x: -3, y: 0 }, { x: 0, y: -3 }, { x: -6, y: 5 }, { x: 4, y: -6 }]
    },
    // 5. The H (Wide)
    {
        paths: [
            [{ x: -6, y: -8 }, { x: -6, y: 8 }],
            [{ x: 6, y: -8 }, { x: 6, y: 8 }],
            [{ x: -6, y: 0 }, { x: 6, y: 0 }]
        ],
        bridges: [{ x: -6, y: 4 }, { x: 6, y: -4 }, { x: 0, y: 0 }, { x: -6, y: -4 }, { x: 6, y: 4 }]
    },
    // 6. Snake River (Simplified)
    {
        paths: [
            [{ x: -8, y: -5 }, { x: 0, y: -5 }, { x: 0, y: 5 }, { x: 8, y: 5 }]
        ],
        bridges: [{ x: -4, y: -5 }, { x: 0, y: 0 }, { x: 4, y: 5 }, { x: 0, y: -2 }, { x: 0, y: 2 }]
    },
    // 7. Four Corners (Wide)
    {
        paths: [
            [{ x: -8, y: 0 }, { x: -4, y: 0 }],
            [{ x: 4, y: 0 }, { x: 8, y: 0 }],
            [{ x: 0, y: -8 }, { x: 0, y: -4 }],
            [{ x: 0, y: 4 }, { x: 0, y: 8 }]
        ],
        bridges: []
    },
    // 8. Parallel Lines
    {
        paths: [
            [{ x: -8, y: -4 }, { x: 8, y: -4 }],
            [{ x: -8, y: 4 }, { x: 8, y: 4 }]
        ],
        bridges: [{ x: 0, y: -4 }, { x: 0, y: 4 }, { x: -4, y: -4 }, { x: 4, y: 4 }]
    },
    // 9. Diagonal Step (Wide)
    {
        paths: [
            [{ x: -8, y: -8 }, { x: -4, y: -8 }, { x: -4, y: -4 }, { x: 4, y: -4 }, { x: 4, y: 4 }, { x: 8, y: 4 }]
        ],
        bridges: [{ x: 0, y: -4 }, { x: 4, y: 0 }, { x: -4, y: -6 }, { x: 4, y: 2 }]
    },
    // 10. The U (Wide)
    {
        paths: [
            [{ x: -6, y: 8 }, { x: -6, y: -6 }, { x: 6, y: -6 }, { x: 6, y: 8 }]
        ],
        bridges: [{ x: 0, y: -6 }, { x: -6, y: 0 }, { x: 6, y: 0 }]
    },
    // 11. Central Island (Wide)
    {
        paths: [
            [{ x: -8, y: 3 }, { x: 8, y: 3 }],
            [{ x: -8, y: -3 }, { x: 8, y: -3 }]
        ],
        bridges: [{ x: 0, y: 3 }, { x: 0, y: -3 }, { x: -4, y: 3 }, { x: 4, y: -3 }]
    },
    // 12. The Fork (Simplified)
    {
        paths: [
            [{ x: 0, y: -8 }, { x: 0, y: -2 }],
            [{ x: 0, y: -2 }, { x: -6, y: -2 }, { x: -6, y: 8 }],
            [{ x: 0, y: -2 }, { x: 6, y: -2 }, { x: 6, y: 8 }]
        ],
        bridges: [{ x: 0, y: -5 }, { x: -3, y: -2 }, { x: 3, y: -2 }, { x: -6, y: 3 }, { x: 6, y: 3 }]
    },
    // 13. Stripes (Simplified)
    {
        paths: [
            [{ x: -4, y: -8 }, { x: -4, y: 8 }],
            [{ x: 4, y: -8 }, { x: 4, y: 8 }]
        ],
        bridges: [{ x: -4, y: 0 }, { x: 4, y: 0 }, { x: -4, y: -5 }, { x: 4, y: 5 }]
    },
    // 14. The Box (Wide)
    {
        paths: [
            [{ x: -5, y: -5 }, { x: 5, y: -5 }, { x: 5, y: 5 }, { x: -5, y: 5 }, { x: -5, y: -5 }]
        ],
        bridges: [{ x: 0, y: -5 }, { x: 0, y: 5 }, { x: -5, y: 0 }, { x: 5, y: 0 }]
    },
    // 15. S-Curve (Wide)
    {
        paths: [
            [{ x: 8, y: 5 }, { x: -5, y: 5 }, { x: -5, y: -5 }, { x: 8, y: -5 }]
        ],
        bridges: [{ x: 0, y: 5 }, { x: 0, y: -5 }, { x: -2, y: 5 }, { x: 2, y: -5 }]
    },
    // 16. The Crosshair (Wide)
    {
        paths: [
            [{ x: -8, y: 0 }, { x: 8, y: 0 }],
            [{ x: 0, y: -8 }, { x: 0, y: -4 }]
        ],
        bridges: [{ x: -4, y: 0 }, { x: 4, y: 0 }]
    },
    // 17. Twin Lakes (Wide)
    {
        paths: [
            [{ x: -6, y: -6 }, { x: -3, y: -6 }, { x: -3, y: -3 }, { x: -6, y: -3 }, { x: -6, y: -6 }],
            [{ x: 3, y: 3 }, { x: 6, y: 3 }, { x: 6, y: 6 }, { x: 3, y: 6 }, { x: 3, y: 3 }]
        ],
        bridges: [{ x: -3, y: -4 }, { x: 3, y: 4 }]
    },
    // 18. The Ladder (Simplified)
    {
        paths: [
            [{ x: -6, y: -8 }, { x: -6, y: 8 }],
            [{ x: 6, y: -8 }, { x: 6, y: 8 }],
            [{ x: -6, y: 0 }, { x: 6, y: 0 }]
        ],
        bridges: [{ x: 0, y: 0 }, { x: -6, y: 4 }, { x: 6, y: -4 }]
    },
    // 19. Spiral (Connected)
    {
        paths: [
            [{ x: -6, y: -6 }, { x: 6, y: -6 }, { x: 6, y: 6 }, { x: -2, y: 6 }, { x: -2, y: -2 }, { x: 2, y: -2 }]
        ],
        bridges: [{ x: 0, y: -6 }, { x: 6, y: 0 }, { x: 0, y: 6 }, { x: -2, y: 2 }, { x: 0, y: -2 }]
    },
    // 20. Random Walk (Wide)
    {
        paths: [
            [{ x: -8, y: -4 }, { x: -4, y: -4 }, { x: -4, y: 4 }, { x: 4, y: 4 }, { x: 4, y: 8 }]
        ],
        bridges: [{ x: -4, y: 0 }, { x: 0, y: 4 }, { x: -6, y: -4 }, { x: 4, y: 6 }]
    }
];

// --- Helper Functions ---
function getRandomPos(levelTiles, snake) {
    let pos;
    let valid = false;
    let attempts = 0;

    while (!valid && attempts < 100) {
        pos = {
            x: Math.floor(Math.random() * GRID_SIZE) - GRID_SIZE / 2,
            y: Math.floor(Math.random() * GRID_SIZE) - GRID_SIZE / 2,
        };

        const tile = levelTiles.find(t => t.x === pos.x && t.y === pos.y);
        const isWater = tile && tile.type === 'water';
        const onSnake = snake.some(s => s.x === pos.x && s.y === pos.y);

        if (tile && !isWater && !onSnake) {
            valid = true;
        }
        attempts++;
    }
    if (!valid) return { x: 0, y: 0 };
    return pos;
}

function generateLevel(mode) {
    const tiles = [];
    const riverTiles = new Set();
    const bridgeTiles = new Set();

    for (let x = -GRID_SIZE / 2; x < GRID_SIZE / 2; x++) {
        for (let y = -GRID_SIZE / 2; y < GRID_SIZE / 2; y++) {
            tiles.push({ x, y, type: 'grass' });
        }
    }

    if (mode === MODES.RIVER) {
        const config = LEVEL_CONFIGS[Math.floor(Math.random() * LEVEL_CONFIGS.length)];

        config.paths.forEach(path => {
            for (let i = 0; i < path.length - 1; i++) {
                const p1 = path[i];
                const p2 = path[i + 1];
                const dx = Math.sign(p2.x - p1.x);
                const dy = Math.sign(p2.y - p1.y);
                let x = p1.x;
                let y = p1.y;

                riverTiles.add(`${x},${y}`);
                while (x !== p2.x || y !== p2.y) {
                    if (x !== p2.x) x += dx;
                    if (y !== p2.y) y += dy;
                    riverTiles.add(`${x},${y}`);
                }
            }
        });

        if (config.bridges) {
            config.bridges.forEach(b => bridgeTiles.add(`${b.x},${b.y}`));
        }

        tiles.forEach(tile => {
            const key = `${tile.x},${tile.y}`;
            if (riverTiles.has(key)) tile.type = 'water';
            if (bridgeTiles.has(key)) tile.type = 'bridge';
        });

        const safeZone = [];
        for (let sx = -3; sx <= 3; sx++) {
            for (let sy = -2; sy <= 2; sy++) {
                safeZone.push({ x: sx, y: sy });
            }
        }

        tiles.forEach(tile => {
            if (safeZone.some(p => p.x === tile.x && p.y === tile.y)) {
                if (tile.type === 'water') tile.type = 'bridge';
            }
        });
    }

    tiles.forEach(tile => {
        if (tile.type === 'grass' && (tile.x + tile.y) % 2 === 0) {
            tile.type = 'path';
        }
    });

    return tiles;
}

function generateBurrows(levelTiles, snake) {
    // Generate 4 unique positions for burrows
    const burrows = [];
    const usedPositions = new Set();

    // Helper to check if pos is valid (not on snake, not on water/bridge if possible, though bridge is ok)
    // Must be walkable.
    const isValid = (x, y) => {
        if (usedPositions.has(`${x},${y}`)) return false;
        if (snake.some(s => s.x === x && s.y === y)) return false;
        // Check tile type
        const tile = levelTiles.find(t => t.x === x && t.y === y);
        if (!tile) return false; // Out of bounds?
        if (tile.type === 'water') return false; // Don't put in water
        return true;
    };

    for (let i = 0; i < 4; i++) {
        let pos;
        let attempts = 0;
        do {
            pos = {
                x: Math.floor(Math.random() * (GRID_SIZE - 2)) - (GRID_SIZE / 2 - 1),
                y: Math.floor(Math.random() * (GRID_SIZE - 2)) - (GRID_SIZE / 2 - 1),
            };
            attempts++;
        } while (!isValid(pos.x, pos.y) && attempts < 100);

        if (attempts < 100) {
            usedPositions.add(`${pos.x},${pos.y}`);
            // 0,1 -> Pair A; 2,3 -> Pair B
            const type = i < 2 ? 'A' : 'B';
            const color = i < 2 ? COLORS.burrowA : COLORS.burrowB;
            burrows.push({ ...pos, type, color, id: i });
        }
    }
    return burrows;
}

// --- Styled Components ---
const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        background: '#E1F5FE',
        fontFamily: "'Varela Round', sans-serif",
    },
    uiContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10001,
    },
    hud: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '2rem',
        color: '#3E2723',
        textShadow: '1px 1px 0px rgba(255,255,255,0.5)',
    },
    score: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        background: 'rgba(255,255,255,0.8)',
        padding: '0.5rem 1.5rem',
        borderRadius: '20px',
        boxShadow: '0 4px 0 rgba(0,0,0,0.1)',
    },
    modeLabel: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        padding: '0.5rem 1rem',
        borderRadius: '15px',
        color: '#5D4037',
    },
    menuContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'auto',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '3rem',
        borderRadius: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        maxWidth: '500px',
        border: '4px solid #8D6E63',
    },
    title: {
        fontSize: '3.5rem',
        margin: '0 0 1rem 0',
        color: '#5D4037',
        fontFamily: "'Fredoka One', cursive",
        textShadow: '2px 2px 0px #FFD54F',
    },
    button: {
        background: '#FFCA28',
        border: 'none',
        color: '#3E2723',
        padding: '1rem 2rem',
        borderRadius: '15px',
        fontSize: '1.2rem',
        cursor: 'pointer',
        transition: 'transform 0.1s, background 0.2s',
        boxShadow: '0 4px 0 #FFA000',
        fontWeight: 'bold',
        width: '100%',
        marginBottom: '1rem',
    },
    gearButton: {
        position: 'absolute',
        top: '2rem',
        right: '2rem',
        color: '#5D4037',
        background: 'rgba(255,255,255,0.8)',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.8rem',
        cursor: 'pointer',
        pointerEvents: 'auto',
        boxShadow: '0 3px 0 rgba(0,0,0,0.1)',
        border: '2px solid #8D6E63',
    },
    settingsModal: {
        position: 'absolute',
        top: '5rem',
        right: '2rem',
        background: 'white',
        padding: '1.5rem',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        border: '3px solid #8D6E63',
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minWidth: '200px',
    },
    settingRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '1.2rem',
        color: '#5D4037',
        fontWeight: 'bold',
    },
    toggle: {
        cursor: 'pointer',
        padding: '0.2rem 0.8rem',
        borderRadius: '10px',
        background: '#eee',
    },
    countdown: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '8rem',
        fontWeight: 'bold',
        color: '#FFCA28',
        textShadow: '4px 4px 0 #3E2723',
        fontFamily: "'Fredoka One', cursive",
        animation: 'pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    mobileBtn: {
        width: '60px',
        height: '60px',
        background: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        cursor: 'pointer',
        userSelect: 'none',
        border: '2px solid rgba(255, 255, 255, 0.8)',
        color: '#3E2723',
        backdropFilter: 'blur(5px)',
    }
};

// --- 3D Components ---

const SpinningStars = ({ visible }) => {
    const group = useRef();
    useFrame((state, delta) => {
        if (group.current && visible) {
            group.current.rotation.y += delta * 5;
        }
    });

    if (!visible) return null;

    return (
        <group ref={group} position={[0, 0.8, 0.5]}>
            {[0, 1, 2].map(i => (
                <mesh key={i} position={[Math.cos(i * 2.1) * 0.5, Math.sin(i * 2.1) * 0.5, 0]}>
                    <octahedronGeometry args={[0.15, 0]} />
                    <meshBasicMaterial color="#FFD700" />
                </mesh>
            ))}
        </group>
    );
};

const CapybaraHead = ({ position, direction, mouthOpen, isHit, skin }) => {
    const group = useRef();
    const upperJawRef = useRef();
    const lowerJawRef = useRef();

    // Multicolor Logic
    const [currentColor, setCurrentColor] = useState(skin.color);
    useFrame((state) => {
        if (skin.isMulticolor) {
            const time = state.clock.elapsedTime;
            const hue = (time * 0.5) % 1;
            const color = new THREE.Color().setHSL(hue, 1, 0.5);
            setCurrentColor(color);
        } else {
            setCurrentColor(skin.color);
        }
    });

    useFrame((state, delta) => {
        if (group.current) {
            const angle = Math.atan2(direction.y, direction.x);
            let targetRotation = angle;
            let currentRotation = group.current.rotation.z;
            while (targetRotation - currentRotation > Math.PI) targetRotation -= Math.PI * 2;
            while (targetRotation - currentRotation < -Math.PI) targetRotation += Math.PI * 2;

            // Recoil animation if hit
            if (isHit) {
                group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, position[0] - direction.x * 0.5, delta * 10);
                group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, position[1] - direction.y * 0.5, delta * 10);
                group.current.rotation.z = currentRotation + Math.sin(state.clock.elapsedTime * 20) * 0.2; // Shake
            } else {
                group.current.rotation.z = THREE.MathUtils.lerp(currentRotation, targetRotation, delta * 15);
                group.current.position.z = 0.6 + Math.sin(state.clock.elapsedTime * 8) * 0.05;
                group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, position[0], delta * 15);
                group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, position[1], delta * 15);
            }
        }

        // Animate Jaws
        if (upperJawRef.current && lowerJawRef.current) {
            // Upper jaw tilts UP (45 degrees) - Crocodile style
            const targetUpperRot = mouthOpen ? -Math.PI / 4 : 0;
            upperJawRef.current.rotation.x = THREE.MathUtils.lerp(upperJawRef.current.rotation.x, targetUpperRot, delta * 20);

            // Lower jaw drops DOWN (45 degrees) - Crocodile style
            const targetLowerRot = mouthOpen ? Math.PI / 4 : 0;
            lowerJawRef.current.rotation.x = THREE.MathUtils.lerp(lowerJawRef.current.rotation.x, targetLowerRot, delta * 20);
        }
    });

    return (
        <group ref={group} position={position}>
            <SpinningStars visible={isHit} />

            {/* Main Head Body (Back of head) */}
            <mesh position={[-0.2, 0, 0.1]}>
                <boxGeometry args={[0.4, 0.85, 0.7]} />
                <meshLambertMaterial color={currentColor} />
            </mesh>

            {/* UPPER JAW GROUP (Snout + Teeth + Nostrils) */}
            <group ref={upperJawRef} position={[0, 0, 0.1]}> {/* Pivot at center/back */}
                {/* Snout */}
                <mesh position={[0.3, 0, 0]}>
                    <boxGeometry args={[0.6, 0.6, 0.4]} />
                    <meshLambertMaterial color={COLORS.capyNose} />
                </mesh>
                {/* Nostrils */}
                <mesh position={[0.6, 0.15, 0.05]}>
                    <boxGeometry args={[0.02, 0.05, 0.05]} />
                    <meshBasicMaterial color="#3E2723" />
                </mesh>
                <mesh position={[0.6, -0.15, 0.05]}>
                    <boxGeometry args={[0.02, 0.05, 0.05]} />
                    <meshBasicMaterial color="#3E2723" />
                </mesh>
                {/* BIG BUCK TEETH */}
                <mesh position={[0.58, 0.1, -0.25]}>
                    <boxGeometry args={[0.05, 0.15, 0.2]} />
                    <meshBasicMaterial color="white" />
                </mesh>
                <mesh position={[0.58, -0.1, -0.25]}>
                    <boxGeometry args={[0.05, 0.15, 0.2]} />
                    <meshBasicMaterial color="white" />
                </mesh>
                {/* Mouth Roof (Interior) */}
                <mesh position={[0.3, 0, -0.21]}>
                    <boxGeometry args={[0.55, 0.5, 0.02]} />
                    <meshBasicMaterial color="#880E4F" />
                </mesh>
            </group>

            {/* LOWER JAW GROUP (Jaw + Teeth) */}
            <group ref={lowerJawRef} position={[0, 0, -0.1]}> {/* Pivot at center/back */}
                {/* Jaw Mesh */}
                <mesh position={[0.25, 0, -0.05]}>
                    <boxGeometry args={[0.5, 0.5, 0.15]} />
                    <meshLambertMaterial color={COLORS.capyNose} />
                </mesh>
                {/* Lower Teeth */}
                <mesh position={[0.48, 0, 0.05]}>
                    <boxGeometry args={[0.05, 0.3, 0.1]} />
                    <meshBasicMaterial color="white" />
                </mesh>
                {/* Mouth Floor (Interior) */}
                <mesh position={[0.25, 0, 0.03]}>
                    <boxGeometry args={[0.45, 0.45, 0.02]} />
                    <meshBasicMaterial color="#880E4F" />
                </mesh>
            </group>

            {/* Ears */}
            <mesh position={[-0.3, 0.35, 0.45]}>
                <sphereGeometry args={[0.12, 6, 6]} />
                <meshLambertMaterial color={currentColor} />
            </mesh>
            <mesh position={[-0.3, -0.35, 0.45]}>
                <sphereGeometry args={[0.12, 6, 6]} />
                <meshLambertMaterial color={currentColor} />
            </mesh>

            {/* Eyes (Higher up) */}
            <mesh position={[0, 0.3, 0.35]}>
                <sphereGeometry args={[0.06, 4, 4]} />
                <meshBasicMaterial color="black" />
            </mesh>
            <mesh position={[0, -0.3, 0.35]}>
                <sphereGeometry args={[0.06, 4, 4]} />
                <meshBasicMaterial color="black" />
            </mesh>
        </group>
    );
};

const CapybaraBody = ({ position, index, skin }) => {
    const mesh = useRef();
    const [currentColor, setCurrentColor] = useState(skin.color);

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 5 + index) * 0.05;
        }
        if (skin.isMulticolor) {
            const time = state.clock.elapsedTime;
            const hue = ((time * 0.5) + (index * 0.1)) % 1; // Offset hue by index for rainbow wave
            const color = new THREE.Color().setHSL(hue, 1, 0.5);
            setCurrentColor(color);
        } else {
            setCurrentColor(skin.color);
        }
    });
    return (
        <mesh ref={mesh} position={position}>
            <boxGeometry args={[0.85, 0.85, 0.6]} />
            <meshLambertMaterial color={currentColor} />
        </mesh>
    );
};

const CapybaraTail = ({ position, direction, skin }) => {
    const group = useRef();
    const [currentColor, setCurrentColor] = useState(skin.color);

    useFrame((state, delta) => {
        if (group.current) {
            const angle = Math.atan2(direction.y, direction.x);
            let targetRotation = angle;
            let currentRotation = group.current.rotation.z;
            while (targetRotation - currentRotation > Math.PI) targetRotation -= Math.PI * 2;
            while (targetRotation - currentRotation < -Math.PI) targetRotation += Math.PI * 2;
            group.current.rotation.z = THREE.MathUtils.lerp(currentRotation, targetRotation, delta * 15);
        }
        if (skin.isMulticolor) {
            const time = state.clock.elapsedTime;
            const hue = (time * 0.5) % 1;
            const color = new THREE.Color().setHSL(hue, 1, 0.5);
            setCurrentColor(color);
        } else {
            setCurrentColor(skin.color);
        }
    });
    return (
        <group ref={group} position={position}>
            <mesh>
                <boxGeometry args={[0.8, 0.8, 0.6]} />
                <meshLambertMaterial color={currentColor} />
            </mesh>
            <mesh position={[-0.4, 0, -0.1]}>
                <sphereGeometry args={[0.1, 6, 6]} />
                <meshLambertMaterial color={currentColor} />
            </mesh>
        </group>
    );
};

const Burrow = ({ position, color }) => {
    const crystalRef = useRef();

    useFrame((state) => {
        if (crystalRef.current) {
            crystalRef.current.rotation.z += 0.02;
            crystalRef.current.rotation.y += 0.01;
            crystalRef.current.position.z = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        }
    });

    return (
        <group position={[position.x * CELL_SIZE + 0.5, position.y * CELL_SIZE + 0.5, 0]}>
            {/* Dirt Mound (Low Poly Hemisphere) */}
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                {/* Reduced segments for low-poly look */}
                <sphereGeometry args={[0.45, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
                {/* Lighter brown and flat shading to see the geometry */}
                <meshStandardMaterial color="#8D6E63" flatShading={true} roughness={1} />
            </mesh>

            {/* Colored Ring around the mound */}
            <mesh position={[0, 0, 0.1]}>
                <torusGeometry args={[0.3, 0.05, 16, 32]} />
                <meshBasicMaterial color={color} />
            </mesh>

            {/* Crystal on top */}
            <mesh ref={crystalRef} position={[0, 0, 0.6]}>
                <octahedronGeometry args={[0.15, 0]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.5}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>
        </group>
    );
};

const Snake = ({ segments, prevSegments, progress, direction, mouthOpen, isHit, skin }) => {
    const interpolatedSegments = segments.map((curr, i) => {
        const prev = prevSegments[i] || curr;
        const x = THREE.MathUtils.lerp(prev.x, curr.x, progress);
        const y = THREE.MathUtils.lerp(prev.y, curr.y, progress);
        return { x, y };
    });

    return (
        <group>
            {interpolatedSegments.map((seg, i) => {
                const pos = [seg.x * CELL_SIZE + 0.5, seg.y * CELL_SIZE + 0.5, 0.3];
                if (i === 0) return <CapybaraHead key={`head-${i}`} position={pos} direction={direction} mouthOpen={mouthOpen} isHit={isHit} skin={skin} />;
                if (i === segments.length - 1) {
                    const prevGrid = segments[i - 1];
                    const currGrid = segments[i];
                    const tailDir = { x: prevGrid.x - currGrid.x, y: prevGrid.y - currGrid.y };
                    return <CapybaraTail key={`tail-${i}`} position={pos} direction={tailDir} skin={skin} />;
                }
                return <CapybaraBody key={`body-${i}`} position={pos} index={i} skin={skin} />;
            })}
        </group>
    );
};

const Food = ({ position, fruit }) => {
    const ref = useRef();
    useFrame((state) => {
        if (ref.current) {
            ref.current.position.z = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
            ref.current.rotation.y += 0.02;
        }
    });

    const renderFruitModel = () => {
        switch (fruit.id) {
            case 'apple':
                return (
                    <group>
                        <mesh><sphereGeometry args={[0.35, 16, 16]} /><meshStandardMaterial color="#FF5252" /></mesh>
                        <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.02, 0.02, 0.2]} /><meshStandardMaterial color="#5D4037" /></mesh>
                        <mesh position={[0.1, 0.3, 0]} rotation={[0, 0, 0.5]}><sphereGeometry args={[0.1, 8, 8]} /><meshStandardMaterial color="#4CAF50" /></mesh>
                    </group>
                );
            case 'pear':
                return (
                    <group position={[0, -0.1, 0]}>
                        <mesh position={[0, 0, 0]}><sphereGeometry args={[0.32, 16, 16]} /><meshStandardMaterial color="#C0CA33" /></mesh>
                        <mesh position={[0, 0.35, 0]}><sphereGeometry args={[0.22, 16, 16]} /><meshStandardMaterial color="#D4E157" /></mesh>
                        <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.02, 0.02, 0.2]} /><meshStandardMaterial color="#5D4037" /></mesh>
                    </group>
                );
            case 'orange':
                return (
                    <group>
                        <mesh><sphereGeometry args={[0.35, 16, 16]} /><meshStandardMaterial color="#FB8C00" roughness={0.6} /></mesh>
                        <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.02, 0.02, 0.1]} /><meshStandardMaterial color="#2E7D32" /></mesh>
                    </group>
                );
            case 'banana':
                return (
                    <group rotation={[0, 0, Math.PI / 4]}>
                        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
                            <cylinderGeometry args={[0.12, 0.12, 0.7, 8]} />
                            <meshStandardMaterial color="#FFD600" />
                        </mesh>
                        <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.02, 0.12, 0.1, 8]} /><meshStandardMaterial color="#5D4037" /></mesh>
                        <mesh position={[0, -0.4, 0]}><cylinderGeometry args={[0.12, 0.02, 0.1, 8]} /><meshStandardMaterial color="#5D4037" /></mesh>
                    </group>
                );
            case 'watermelon':
                return (
                    <group>
                        <mesh scale={[1, 1.2, 1]}><sphereGeometry args={[0.32, 16, 16]} /><meshStandardMaterial color="#2E7D32" /></mesh>
                        <mesh scale={[1.02, 1.22, 1.02]}><sphereGeometry args={[0.32, 16, 16]} /><meshStandardMaterial color="#1B5E20" wireframe /></mesh>
                    </group>
                );
            case 'grape':
                return (
                    <group scale={0.6} position={[0, 0.1, 0]}>
                        <mesh position={[0, 0.2, 0]}><sphereGeometry args={[0.2, 8, 8]} /><meshStandardMaterial color="#7B1FA2" /></mesh>
                        <mesh position={[-0.15, -0.1, 0]}><sphereGeometry args={[0.2, 8, 8]} /><meshStandardMaterial color="#7B1FA2" /></mesh>
                        <mesh position={[0.15, -0.1, 0]}><sphereGeometry args={[0.2, 8, 8]} /><meshStandardMaterial color="#7B1FA2" /></mesh>
                        <mesh position={[0, -0.3, 0.1]}><sphereGeometry args={[0.2, 8, 8]} /><meshStandardMaterial color="#7B1FA2" /></mesh>
                        <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.02, 0.02, 0.2]} /><meshStandardMaterial color="#5D4037" /></mesh>
                    </group>
                );
            case 'strawberry':
                return (
                    <group>
                        <mesh rotation={[Math.PI, 0, 0]} position={[0, 0.1, 0]}>
                            <coneGeometry args={[0.3, 0.6, 16]} />
                            <meshStandardMaterial color="#F44336" />
                        </mesh>
                        <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0]}>
                            <cylinderGeometry args={[0.1, 0.0, 0.1, 5]} />
                            <meshStandardMaterial color="#2E7D32" />
                        </mesh>
                    </group>
                );
            case 'cherry':
                return (
                    <group>
                        <mesh position={[-0.15, -0.1, 0]}><sphereGeometry args={[0.18, 16, 16]} /><meshStandardMaterial color="#D32F2F" /></mesh>
                        <mesh position={[0.15, -0.1, 0]}><sphereGeometry args={[0.18, 16, 16]} /><meshStandardMaterial color="#D32F2F" /></mesh>
                        {/* Stems connecting */}
                        <mesh position={[-0.08, 0.2, 0]} rotation={[0, 0, -0.5]}>
                            <cylinderGeometry args={[0.02, 0.02, 0.5]} />
                            <meshStandardMaterial color="#5D4037" />
                        </mesh>
                        <mesh position={[0.08, 0.2, 0]} rotation={[0, 0, 0.5]}>
                            <cylinderGeometry args={[0.02, 0.02, 0.5]} />
                            <meshStandardMaterial color="#5D4037" />
                        </mesh>
                    </group>
                );
            default: // Fallback to Apple
                return (
                    <group>
                        <mesh><sphereGeometry args={[0.35, 16, 16]} /><meshStandardMaterial color="#FF5252" /></mesh>
                        <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.02, 0.02, 0.2]} /><meshStandardMaterial color="#5D4037" /></mesh>
                        <mesh position={[0.1, 0.3, 0]} rotation={[0, 0, 0.5]}><sphereGeometry args={[0.1, 8, 8]} /><meshStandardMaterial color="#4CAF50" /></mesh>
                    </group>
                );
        }
    };

    return (
        <group ref={ref} position={[position.x * CELL_SIZE + 0.5, position.y * CELL_SIZE + 0.5, 0]}>
            {renderFruitModel()}
        </group>
    );
};

// --- Instanced Decor Components ---

const InstancedForest = ({ theme }) => {
    const count = 60;
    const radius = GRID_SIZE / 2 + 5;

    // Data generation
    const { treeData, rockData, bushData, hillData } = useMemo(() => {
        const tData = [];
        const rData = [];
        const bData = [];

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const r = radius + Math.random() * 5;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            const scale = 0.8 + Math.random() * 0.5;

            const type = Math.random();
            if (type < 0.6) {
                tData.push({ position: [x, y, 0], scale });
            } else if (type < 0.8) {
                rData.push({ position: [x, y, 0.5], scale, rotation: [Math.random(), Math.random(), Math.random()] });
            } else {
                bData.push({ position: [x, y, 0], scale });
            }
        }

        const hData = [];
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + 0.5;
            const r = radius + 15;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            hData.push({ position: [x, y, -2], scale: 2 + Math.random() });
        }

        return { treeData: tData, rockData: rData, bushData: bData, hillData: hData };
    }, []);

    // Refs for InstancedMesh
    const trunkRef = useRef();
    const leavesRef = useRef();
    const rockRef = useRef();
    const bushRef = useRef();
    const hillRef = useRef();

    useEffect(() => {
        const dummy = new THREE.Object3D();

        // Trees / Cacti
        treeData.forEach((data, i) => {
            dummy.position.set(data.position[0], data.position[1], 1);
            if (theme.decor === 'cactus') {
                dummy.rotation.set(Math.PI / 2, 0, 0);
                dummy.scale.set(data.scale * 0.5, data.scale * 1.5, data.scale * 0.5); // Taller, thinner
            } else {
                dummy.rotation.set(Math.PI / 2, 0, 0);
                dummy.scale.set(data.scale, data.scale, data.scale);
            }
            dummy.updateMatrix();
            trunkRef.current.setMatrixAt(i, dummy.matrix);

            dummy.position.set(data.position[0], data.position[1], 2.5);
            dummy.rotation.set(0, 0, 0);
            dummy.scale.set(data.scale, data.scale, data.scale);
            dummy.updateMatrix();
            leavesRef.current.setMatrixAt(i, dummy.matrix);
        });
        trunkRef.current.instanceMatrix.needsUpdate = true;
        leavesRef.current.instanceMatrix.needsUpdate = true;

        // Rocks
        rockData.forEach((data, i) => {
            dummy.position.set(...data.position);
            dummy.rotation.set(...data.rotation);
            dummy.scale.set(data.scale, data.scale, data.scale);
            dummy.updateMatrix();
            rockRef.current.setMatrixAt(i, dummy.matrix);
        });
        rockRef.current.instanceMatrix.needsUpdate = true;

        // Bushes
        bushData.forEach((data, i) => {
            dummy.position.set(...data.position);
            dummy.rotation.set(0, 0, 0);
            dummy.scale.set(data.scale, data.scale, data.scale);
            dummy.updateMatrix();
            bushRef.current.setMatrixAt(i, dummy.matrix);
        });
        bushRef.current.instanceMatrix.needsUpdate = true;

        // Hills
        hillData.forEach((data, i) => {
            dummy.position.set(...data.position);
            dummy.rotation.set(0, 0, 0);
            dummy.scale.set(data.scale, data.scale, data.scale);
            dummy.updateMatrix();
            hillRef.current.setMatrixAt(i, dummy.matrix);
        });
        hillRef.current.instanceMatrix.needsUpdate = true;

    }, [treeData, rockData, bushData, hillData, theme]);

    const getDecorColors = () => {
        if (theme.decor === 'cactus') return { trunk: '#66BB6A', leaves: '#66BB6A', bush: '#A1887F', rock: '#D7CCC8', hill: '#E6EE9C' };
        if (theme.decor === 'snow_tree') return { trunk: '#5D4037', leaves: '#B3E5FC', bush: '#B3E5FC', rock: '#90A4AE', hill: '#E1F5FE' };
        return { trunk: COLORS.wood, leaves: COLORS.leaf, bush: COLORS.bush, rock: COLORS.rock, hill: COLORS.hill }; // Forest
    };
    const colors = getDecorColors();

    return (
        <group>
            {/* Tree Trunks / Cactus Body */}
            <instancedMesh ref={trunkRef} args={[null, null, treeData.length]} frustumCulled={false}>
                <cylinderGeometry args={[0.3, 0.4, 2, 5]} />
                <meshLambertMaterial color={colors.trunk} />
            </instancedMesh>
            {/* Tree Leaves / Cactus Top (Hidden for cactus?) */}
            <instancedMesh ref={leavesRef} args={[null, null, treeData.length]} frustumCulled={false}>
                {theme.decor === 'cactus' ? <sphereGeometry args={[0.01, 4, 4]} /> : <dodecahedronGeometry args={[1.2, 0]} />}
                <meshLambertMaterial color={colors.leaves} />
            </instancedMesh>
            {/* Rocks */}
            <instancedMesh ref={rockRef} args={[null, null, rockData.length]} frustumCulled={false}>
                <dodecahedronGeometry args={[0.5, 0]} />
                <meshLambertMaterial color={colors.rock} />
            </instancedMesh>
            {/* Bushes */}
            <instancedMesh ref={bushRef} args={[null, null, bushData.length]} frustumCulled={false}>
                <dodecahedronGeometry args={[0.6, 0]} />
                <meshLambertMaterial color={colors.bush} />
            </instancedMesh>
            {/* Hills */}
            <instancedMesh ref={hillRef} args={[null, null, hillData.length]} frustumCulled={false}>
                <coneGeometry args={[5, 8, 8]} />
                <meshLambertMaterial color={colors.hill} />
            </instancedMesh>
        </group>
    );
};

const InstancedFence = () => {
    const postRef = useRef();
    const railRef = useRef();

    useEffect(() => {
        const dummy = new THREE.Object3D();
        const size = GRID_SIZE / 2 + 0.5;
        const count = GRID_SIZE + 2;
        let idx = 0;
        let railIdx = 0;

        // Posts
        for (let i = 0; i <= count; i++) {
            const offset = i - count / 2;
            const positions = [
                [offset, size, 0.5],
                [offset, -size, 0.5],
                [-size, offset, 0.5],
                [size, offset, 0.5]
            ];

            positions.forEach(pos => {
                dummy.position.set(...pos);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                postRef.current.setMatrixAt(idx++, dummy.matrix);
            });
        }
        postRef.current.instanceMatrix.needsUpdate = true;

        // Rails (Horizontal beams)
        // Top/Bottom rails
        const railLen = GRID_SIZE + 2;
        const railPositions = [
            { pos: [0, size, 0.7], rot: [0, 0, Math.PI / 2], scale: [0.1, railLen, 0.1] },
            { pos: [0, -size, 0.7], rot: [0, 0, Math.PI / 2], scale: [0.1, railLen, 0.1] },
            { pos: [-size, 0, 0.7], rot: [0, 0, 0], scale: [0.1, railLen, 0.1] },
            { pos: [size, 0, 0.7], rot: [0, 0, 0], scale: [0.1, railLen, 0.1] },
            // Lower rails
            { pos: [0, size, 0.3], rot: [0, 0, Math.PI / 2], scale: [0.1, railLen, 0.1] },
            { pos: [0, -size, 0.3], rot: [0, 0, Math.PI / 2], scale: [0.1, railLen, 0.1] },
            { pos: [-size, 0, 0.3], rot: [0, 0, 0], scale: [0.1, railLen, 0.1] },
            { pos: [size, 0, 0.3], rot: [0, 0, 0], scale: [0.1, railLen, 0.1] }
        ];

        railPositions.forEach((data, i) => {
            dummy.position.set(...data.pos);
            dummy.rotation.set(...data.rot);
            dummy.scale.set(1, data.scale[1], 1); // Scale length only, width handled by geometry args? No, scale all.
            // Actually box geometry is 1x1x1, so scale is correct.
            dummy.scale.set(data.scale[0], data.scale[1], data.scale[2]);
            dummy.updateMatrix();
            railRef.current.setMatrixAt(i, dummy.matrix);
        });
        railRef.current.instanceMatrix.needsUpdate = true;

    }, []);

    const postCount = (GRID_SIZE + 3) * 4;

    return (
        <group>
            <instancedMesh ref={postRef} args={[null, null, postCount]} frustumCulled={false}>
                <boxGeometry args={[0.2, 0.2, 1]} />
                <meshLambertMaterial color={COLORS.fence} />
            </instancedMesh>
            <instancedMesh ref={railRef} args={[null, null, 8]} frustumCulled={false}>
                <boxGeometry args={[1, 1, 1]} />
                <meshLambertMaterial color={COLORS.fence} />
            </instancedMesh>
        </group>
    );
};

const LilyPad = ({ position }) => {
    return (
        <mesh position={[position[0], position[1], 0.02]} rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}>
            <cylinderGeometry args={[0.3, 0.3, 0.02, 8]} />
            <meshLambertMaterial color={COLORS.lilypad} />
        </mesh>
    );
};

const Ground = ({ tiles, theme }) => {
    // Generate LilyPads only once per level load
    const lilyPads = useMemo(() => {
        const pads = [];
        tiles.forEach((tile, i) => {
            if (tile.type === 'water' && Math.random() < 0.2) {
                pads.push(<LilyPad key={`lily-${i}`} position={[tile.x + 0.5, tile.y + 0.5]} />);
            }
        });
        return pads;
    }, [tiles]);

    return (
        <group position={[0, 0, -0.05]}>
            {tiles.map((tile, i) => {
                let color = theme.ground;
                if ((tile.x + tile.y) % 2 === 0) color = theme.groundAlt; // Checkerboard logic

                if (tile.type === 'path') color = COLORS.path;
                if (tile.type === 'water') color = COLORS.water;
                if (tile.type === 'bridge') color = COLORS.bridge;

                return (
                    <mesh key={i} position={[tile.x + 0.5, tile.y + 0.5, 0]}>
                        <planeGeometry args={[1, 1]} />
                        <meshLambertMaterial color={color} />
                    </mesh>
                );
            })}
            {lilyPads}
        </group>
    );
};

const Environment = ({ mapTheme }) => {
    const theme = mapTheme || MAP_THEMES[0];
    return (
        <>
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 20, 20]} intensity={1.0} />

            <mesh scale={[100, 100, 100]}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial color={theme.sky} side={THREE.BackSide} />
            </mesh>

            <mesh position={[0, 0, -0.1]}>
                <planeGeometry args={[100, 100]} />
                <meshLambertMaterial color={theme.ground} />
            </mesh>

            <InstancedFence />
            <InstancedForest theme={theme} />
        </>
    );
};

const GameCamera = ({ snake, prevSnake, progress, mode, direction }) => {
    const { camera } = useThree();
    const targetPos = useRef(new THREE.Vector3(0, -10, 15));
    const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

    useFrame((state, delta) => {
        const currHead = snake[0];
        const prevHead = prevSnake[0] || currHead;

        const x = THREE.MathUtils.lerp(prevHead.x, currHead.x, progress);
        const y = THREE.MathUtils.lerp(prevHead.y, currHead.y, progress);

        const headX = x * CELL_SIZE;
        const headY = y * CELL_SIZE;

        if (mode === MODES.CAPY_FPS) {
            // --- CAPY FPS MODE (Third Person Chase Cam) ---
            // User Request: "voir la tete du capybara vu de l'arriere"
            // Camera behind and above.

            // Configuration
            const distBehind = 4; // How far back
            const heightAbove = 3; // How high up
            const lookAhead = 5;   // How far forward to look

            // To make rotation smoother, we need to interpolate the DIRECTION vector
            // instead of just using the raw direction.
            // We can use a ref to store the "smoothed direction"
            if (!targetLookAt.current.smoothedDir) {
                targetLookAt.current.smoothedDir = new THREE.Vector3(direction.x, direction.y, 0);
            }

            const targetDir = new THREE.Vector3(direction.x, direction.y, 0);
            targetLookAt.current.smoothedDir.lerp(targetDir, delta * 3); // Slower lerp for smoother turns

            const smoothDir = targetLookAt.current.smoothedDir;

            // Calculate Camera Position based on SMOOTH direction
            // Pos = Head - SmoothDir * distBehind + Up * heightAbove
            const targetCamPos = new THREE.Vector3(
                headX - smoothDir.x * distBehind,
                headY - smoothDir.y * distBehind,
                heightAbove
            );

            // Calculate LookAt Position based on SMOOTH direction
            // LookAt = Head + SmoothDir * lookAhead
            const targetLookAtPos = new THREE.Vector3(
                headX + smoothDir.x * lookAhead,
                headY + smoothDir.y * lookAhead,
                0 // Look at ground level ahead
            );

            // Smooth camera position (additional smoothing on top of direction smoothing)
            camera.position.lerp(targetCamPos, delta * 5);

            // Smooth look-at
            targetLookAt.current.lerp(targetLookAtPos, delta * 5);
            camera.lookAt(targetLookAt.current);

            // Ensure Up vector is Z (World Up)
            camera.up.set(0, 0, 1);

        } else {
            // --- CLASSIC / RIVER MODE ---
            const targetX = headX;
            const targetY = headY - 7;

            targetPos.current.lerp(new THREE.Vector3(targetX, targetY, 12), delta * 5);
            camera.position.lerp(targetPos.current, delta * 5);
            camera.up.set(0, 1, 0); // Reset up vector
            camera.lookAt(targetX, targetY + 5, 0);
        }
    });

    return null;
};

const GameScene = ({ mode, setScore, setGameOver, gameOver, setCountdown, countdown, isSfxMuted, sfxVolume, highScores, setHighScores, capySkin, capyFruit, mapTheme }) => {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [prevSnake, setPrevSnake] = useState(INITIAL_SNAKE);
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [nextDirection, setNextDirection] = useState(INITIAL_DIRECTION);
    const [levelTiles, setLevelTiles] = useState([]);
    const [burrows, setBurrows] = useState([]);
    const [food, setFood] = useState({ x: 0, y: 0 });
    const [tickRate, setTickRate] = useState(150);

    const [lastTick, setLastTick] = useState(0);
    const [progress, setProgress] = useState(0);
    const [mouthOpen, setMouthOpen] = useState(false);
    const [isHit, setIsHit] = useState(false);

    // Teleportation state to prevent loops
    const [justTeleported, setJustTeleported] = useState(false);

    // Initialize Level
    useEffect(() => {
        setIsHit(false);
        setJustTeleported(false);
        const tiles = generateLevel(mode);
        setLevelTiles(tiles);

        if (mode === MODES.BURROW) {
            setBurrows(generateBurrows(tiles, INITIAL_SNAKE));
        } else {
            setBurrows([]);
        }

        setFood(getRandomPos(tiles, INITIAL_SNAKE));
        playSound('start', isSfxMuted, sfxVolume);

        // Start Countdown
        setCountdown(3);
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev > 1) playSound('tick', isSfxMuted, sfxVolume);
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [mode]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (countdown > 0 || isHit) return; // Block input during countdown OR if hit

            let newDir = null;

            if (mode === MODES.CAPY_FPS) {
                // Relative Turning Controls
                // ArrowLeft -> Turn Left (90 degrees Counter-Clockwise)
                // ArrowRight -> Turn Right (90 degrees Clockwise)
                // ArrowUp/Down -> No effect

                // Current direction is 'direction' (or should we use nextDirection to allow buffering? 
                // usually snake games use current direction for validity checks).
                // Since we are just turning 90 degrees, it's always "valid" relative to current facing 
                // (you can't do a 180 turn with a 90 degree turn).

                const currentDir = direction; // Use current established direction

                switch (e.key) {
                    case 'ArrowLeft':
                        // Turn Left: (x, y) -> (y, -x) wait, standard math:
                        // (1, 0) -> (0, 1) [Up] -> (-1, 0) [Left] -> (0, -1) [Down]
                        // x' = -y, y' = x
                        newDir = { x: -currentDir.y, y: currentDir.x };
                        break;
                    case 'ArrowRight':
                        // Turn Right: (x, y) -> (0, -1) [Down]
                        // x' = y, y' = -x
                        newDir = { x: currentDir.y, y: -currentDir.x };
                        break;
                }
            } else {
                // Standard Controls
                switch (e.key) {
                    case 'ArrowUp': if (direction.y !== -1) newDir = { x: 0, y: 1 }; break;
                    case 'ArrowDown': if (direction.y !== 1) newDir = { x: 0, y: -1 }; break;
                    case 'ArrowLeft': if (direction.x !== 1) newDir = { x: -1, y: 0 }; break;
                    case 'ArrowRight': if (direction.x !== -1) newDir = { x: 1, y: 0 }; break;
                }
            }

            if (newDir) {
                setNextDirection(newDir);
                playSound('step', isSfxMuted, sfxVolume);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction, countdown, isHit, mode]);

    useFrame((state) => {
        if (!mode || gameOver || countdown > 0) return;

        const time = state.clock.elapsedTime * 1000;

        // Calculate mouth open state (STRICT: only if facing food and adjacent)
        const head = snake[0];
        const nextX = head.x + direction.x;
        const nextY = head.y + direction.y;
        setMouthOpen(nextX === food.x && nextY === food.y);

        // Fix for "speed d'un coup" (initial jump)
        if (lastTick === 0) {
            setLastTick(time);
            return;
        }

        const p = Math.min((time - lastTick) / tickRate, 1);
        setProgress(p);

        if (time - lastTick > tickRate) {
            setLastTick(time);
            setProgress(0);
            setDirection(nextDirection);
            setPrevSnake([...snake]);

            setSnake((currentSnake) => {
                const newHead = {
                    x: currentSnake[0].x + nextDirection.x,
                    y: currentSnake[0].y + nextDirection.y,
                };

                if (newHead.x < -GRID_SIZE / 2 || newHead.x >= GRID_SIZE / 2 ||
                    newHead.y < -GRID_SIZE / 2 || newHead.y >= GRID_SIZE / 2) {
                    setIsHit(true);
                    setTimeout(() => setGameOver(true), 500); // Delay game over for animation
                    playSound('die', isSfxMuted, sfxVolume);
                    return currentSnake;
                }

                if (currentSnake.some(s => s.x === newHead.x && s.y === newHead.y)) {
                    setIsHit(true);
                    setTimeout(() => setGameOver(true), 500);
                    playSound('die', isSfxMuted, sfxVolume);
                    return currentSnake;
                }

                const tile = levelTiles.find(t => t.x === newHead.x && t.y === newHead.y);
                if (tile && tile.type === 'water') {
                    setIsHit(true);
                    setTimeout(() => setGameOver(true), 500);
                    playSound('die', isSfxMuted, sfxVolume);
                    return currentSnake;
                }

                const newSnake = [newHead, ...currentSnake];

                // --- BURROW TELEPORTATION LOGIC ---
                if (mode === MODES.BURROW) {
                    const burrow = burrows.find(b => b.x === newHead.x && b.y === newHead.y);
                    if (burrow) {
                        if (!justTeleported) {
                            // Find partner
                            const partner = burrows.find(b => b.type === burrow.type && b.id !== burrow.id);
                            if (partner) {
                                // Teleport head to partner position
                                newSnake[0] = { x: partner.x, y: partner.y };
                                setJustTeleported(true);
                                playSound('step', isSfxMuted, sfxVolume); // Maybe a different sound?
                            }
                        }
                    } else {
                        setJustTeleported(false);
                    }
                }

                if (newHead.x === food.x && newHead.y === food.y) {
                    setScore(s => {
                        const newScore = s + 1;
                        // Update High Score
                        if (newScore > (highScores[mode] || 0)) {
                            const newHighScores = { ...highScores, [mode]: newScore };
                            setHighScores(newHighScores);
                            localStorage.setItem('capySnakeHighScores', JSON.stringify(newHighScores));
                        }
                        return newScore;
                    });
                    setFood(getRandomPos(levelTiles, newSnake));
                    playSound('eat', isSfxMuted, sfxVolume);
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        }
    });

    return (
        <>
            <GameCamera snake={snake} prevSnake={prevSnake} progress={progress} mode={mode} direction={direction} />
            <Environment />
            <Environment mapTheme={mapTheme} />
            <Ground tiles={levelTiles} theme={mapTheme || MAP_THEMES[0]} />
            <Snake
                segments={snake}
                prevSegments={prevSnake}
                progress={progress}
                direction={direction}
                mouthOpen={mouthOpen}
                isHit={isHit}
                skin={capySkin}
            />
            <Food position={food} fruit={capyFruit} />
            {burrows.map(b => <Burrow key={b.id} position={b} color={b.color} />)}
        </>
    );
};

const MusicPlayer = ({ isMuted, mode, volume }) => {
    const audioRef = useRef(new Audio());

    const playRandomTrack = useCallback(() => {
        const randomTrack = MUSIC_TRACKS[Math.floor(Math.random() * MUSIC_TRACKS.length)];
        audioRef.current.src = randomTrack;
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        audio.volume = volume;

        const handleEnded = () => {
            playRandomTrack();
        };

        audio.addEventListener('ended', handleEnded);

        // Play initial track
        playRandomTrack();

        return () => {
            audio.pause();
            audio.removeEventListener('ended', handleEnded);
        };
    }, [playRandomTrack]);

    // Handle Mute
    useEffect(() => {
        if (isMuted) {
            audioRef.current.pause();
        } else {
            if (audioRef.current.paused) {
                audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            }
        }
    }, [isMuted]);

    // Handle Volume Change
    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    // Handle Mode Change (New Game)
    useEffect(() => {
        if (mode) {
            if (!isMuted) {
                playRandomTrack();
            }
        }
    }, [mode, playRandomTrack]);

    return null;
};

const MenuButton = ({ onClick, children, style, isSfxMuted, sfxVolume }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            style={{
                ...styles.button,
                ...style,
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                background: isHovered ? (style?.background ? style.background : '#FFD54F') : (style?.background || '#FFCA28'),
            }}
            onClick={onClick}
            onMouseEnter={() => {
                setIsHovered(true);
                playSound('hover', isSfxMuted, sfxVolume);
            }}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </button>
    );
};

const Notification = ({ message, visible }) => {
    if (!visible) return null;
    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '20px',
            zIndex: 2000,
            animation: 'fadeInOut 3s forwards',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
            <span style={{ fontSize: '1.5rem' }}>🔓</span>
            <span style={{ fontWeight: 'bold' }}>{message}</span>
            <style>{`
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translate(-50%, -20px); }
                    10% { opacity: 1; transform: translate(-50%, 0); }
                    90% { opacity: 1; transform: translate(-50%, 0); }
                    100% { opacity: 0; transform: translate(-50%, -20px); }
                }
            `}</style>
        </div>
    );
};

const getMaxScore = (highScores) => {
    if (!highScores) return 0;
    return Math.max(0, ...Object.values(highScores));
};

export default function SnakeGame3D({ onClose }) {
    const [mode, setMode] = useState(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Settings State
    const [showSettings, setShowSettings] = useState(false);
    const [isMusicMuted, setIsMusicMuted] = useState(false);
    const [isSfxMuted, setIsSfxMuted] = useState(false);
    const [musicVolume, setMusicVolume] = useState(0.3);
    const [sfxVolume, setSfxVolume] = useState(0.5);

    // Customization State
    const [showCustomization, setShowCustomization] = useState(false);
    const [capySkin, setCapySkin] = useState(() => {
        const saved = localStorage.getItem('capySkin');
        return saved ? JSON.parse(saved) : CAPY_SKINS[0];
    });
    const [capyFruit, setCapyFruit] = useState(() => {
        const saved = localStorage.getItem('capyFruit');
        return saved ? JSON.parse(saved) : FRUIT_TYPES[0];
    });
    const [mapTheme, setMapTheme] = useState(() => {
        const saved = localStorage.getItem('capyMap');
        return saved ? JSON.parse(saved) : MAP_THEMES[0];
    });

    // Save customization
    useEffect(() => {
        localStorage.setItem('capySkin', JSON.stringify(capySkin));
    }, [capySkin]);

    useEffect(() => {
        localStorage.setItem('capyFruit', JSON.stringify(capyFruit));
    }, [capyFruit]);

    useEffect(() => {
        localStorage.setItem('capyMap', JSON.stringify(mapTheme));
    }, [mapTheme]);

    // High Scores State (Lifted up)
    const [highScores, setHighScores] = useState(() => {
        const saved = localStorage.getItem('capySnakeHighScores');
        return saved ? JSON.parse(saved) : {};
    });

    // Notification State
    const [notification, setNotification] = useState({ message: '', visible: false });
    const prevMaxScore = useRef(getMaxScore(highScores));

    const showNotification = (msg) => {
        setNotification({ message: msg, visible: true });
        setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 3000);
    };

    // Unlock Logic
    useEffect(() => {
        const currentMax = getMaxScore(highScores);
        const prevMax = prevMaxScore.current;

        if (currentMax > prevMax) {
            // Check for unlocks
            // Skins/Fruits: Every 5 points (5, 10, 15...)
            for (let i = 1; i < CAPY_SKINS.length; i++) {
                const threshold = i * 5;
                if (prevMax < threshold && currentMax >= threshold) {
                    showNotification(`Nouveau contenu débloqué ! (Niveau ${threshold})`);
                    playSound('win', isSfxMuted, sfxVolume); // Use win sound for unlock
                }
            }
            // Maps: Every 10 points (10, 20)
            // Forest (0) is default. Desert (10), Snow (20).
            if (prevMax < 10 && currentMax >= 10) {
                showNotification("Carte Désert débloquée !");
                playSound('win', isSfxMuted, sfxVolume);
            }
            if (prevMax < 20 && currentMax >= 20) {
                showNotification("Carte Neige débloquée !");
                playSound('win', isSfxMuted, sfxVolume);
            }
        }
        prevMaxScore.current = currentMax;
    }, [highScores, isSfxMuted, sfxVolume]);

    const maxScore = getMaxScore(highScores);

    const startGame = (selectedMode) => {
        setMode(selectedMode);
        setScore(0);
        setGameOver(false);
        playSound('click', isSfxMuted, sfxVolume);
    };

    const resetGame = () => {
        setScore(0);
        setGameOver(false);
        const currentMode = mode;
        setMode(null);
        setTimeout(() => setMode(currentMode), 0);
        playSound('click', isSfxMuted, sfxVolume);
    };

    const goHome = () => {
        setMode(null);
        setGameOver(false);
        setScore(0);
        playSound('click', isSfxMuted, sfxVolume);
    };

    // --- Mobile Controls Handler ---
    const handleMobileControl = (key) => {
        // Simulate keydown event
        const event = new KeyboardEvent('keydown', { key });
        window.dispatchEvent(event);
    };

    return (
        <div style={styles.container}>
            <link href="https://fonts.googleapis.com/css2?family=Varela+Round&family=Fredoka+One&display=swap" rel="stylesheet" />

            <MusicPlayer isMuted={isMusicMuted} mode={mode} volume={musicVolume} />
            <Notification message={notification.message} visible={notification.visible} />

            <Canvas dpr={[1, 1.5]} camera={{ position: [0, -10, 15], fov: 50 }}>
                {mode && !gameOver ? (
                    <GameScene
                        mode={mode}
                        setScore={setScore}
                        setGameOver={setGameOver}
                        gameOver={gameOver}
                        setCountdown={setCountdown}
                        countdown={countdown}
                        isSfxMuted={isSfxMuted}
                        sfxVolume={sfxVolume}
                        highScores={highScores}
                        setHighScores={setHighScores}
                        capySkin={capySkin}
                        capyFruit={capyFruit}
                        mapTheme={mapTheme}
                    />
                ) : (
                    <Environment mapTheme={mapTheme} />
                )}
            </Canvas>

            <div style={styles.uiContainer}>
                {/* Gear Button */}
                <div style={styles.gearButton} onClick={() => setShowSettings(!showSettings)}>
                    ⚙️
                </div>

                {/* Settings Modal */}
                {showSettings && (
                    <div style={styles.settingsModal}>
                        <div style={styles.settingRow}>
                            <span>Musique</span>
                            <div style={styles.toggle} onClick={() => setIsMusicMuted(!isMusicMuted)}>
                                {isMusicMuted ? 'OFF' : 'ON'}
                            </div>
                        </div>
                        <div style={styles.settingRow}>
                            <span>Sons</span>
                            <div style={styles.toggle} onClick={() => setIsSfxMuted(!isSfxMuted)}>
                                {isSfxMuted ? 'OFF' : 'ON'}
                            </div>
                        </div>
                        <div style={styles.settingRow}>
                            <span>Musique Vol</span>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={musicVolume}
                                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                                style={{ width: '100px', cursor: 'pointer' }}
                            />
                        </div>
                        <div style={styles.settingRow}>
                            <span>Sons Vol</span>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={sfxVolume}
                                onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                                style={{ width: '100px', cursor: 'pointer' }}
                            />
                        </div>
                        <button
                            style={{ ...styles.button, background: '#EF5350', color: 'white', marginTop: '1rem' }}
                            onClick={onClose}
                        >
                            Quitter
                        </button>
                    </div>
                )}

                {/* Customization Menu */}
                {showCustomization && (
                    <div style={styles.menuContainer}>
                        <div style={{ ...styles.title, fontSize: '2.5rem' }}>Personnalisation</div>

                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#5D4037' }}>Couleur du Capy</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                                {CAPY_SKINS.map((skin, index) => {
                                    const isUnlocked = maxScore >= index * 5;
                                    return (
                                        <div
                                            key={skin.id}
                                            onClick={() => {
                                                if (isUnlocked) {
                                                    setCapySkin(skin);
                                                    playSound('click', isSfxMuted, sfxVolume);
                                                }
                                            }}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: skin.isMulticolor ? 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)' : skin.color,
                                                border: capySkin.id === skin.id ? '4px solid #3E2723' : '2px solid white',
                                                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                                                transform: capySkin.id === skin.id ? 'scale(1.2)' : 'scale(1)',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                                position: 'relative',
                                                opacity: isUnlocked ? 1 : 0.6
                                            }}
                                        >
                                            {!isUnlocked && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0, left: 0, right: 0, bottom: 0,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    background: 'rgba(0,0,0,0.3)', borderRadius: '50%',
                                                    color: 'white', fontSize: '12px', flexDirection: 'column'
                                                }}>
                                                    🔒
                                                    <span style={{ fontSize: '8px' }}>{index * 5}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#5D4037' }}>Fruit Préféré</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                                {FRUIT_TYPES.map((fruit, index) => {
                                    const isUnlocked = maxScore >= index * 5;
                                    return (
                                        <div
                                            key={fruit.id}
                                            onClick={() => {
                                                if (isUnlocked) {
                                                    setCapyFruit(fruit);
                                                    playSound('click', isSfxMuted, sfxVolume);
                                                }
                                            }}
                                            style={{
                                                fontSize: '2rem',
                                                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                                                padding: '5px',
                                                background: capyFruit.id === fruit.id ? 'rgba(255,255,255,0.8)' : 'transparent',
                                                borderRadius: '10px',
                                                border: capyFruit.id === fruit.id ? '2px solid #8D6E63' : '2px solid transparent',
                                                position: 'relative',
                                                opacity: isUnlocked ? 1 : 0.6
                                            }}
                                        >
                                            {fruit.emoji}
                                            {!isUnlocked && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0, left: 0, right: 0, bottom: 0,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    background: 'rgba(0,0,0,0.3)', borderRadius: '10px',
                                                    color: 'white', fontSize: '12px', flexDirection: 'column'
                                                }}>
                                                    🔒
                                                    <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{index * 5}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#5D4037' }}>Carte</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                                {MAP_THEMES.map((theme, index) => {
                                    const unlockScore = index * 10;
                                    const isUnlocked = maxScore >= unlockScore;
                                    return (
                                        <div
                                            key={theme.id}
                                            onClick={() => {
                                                if (isUnlocked) {
                                                    setMapTheme(theme);
                                                    playSound('click', isSfxMuted, sfxVolume);
                                                }
                                            }}
                                            style={{
                                                padding: '10px 20px',
                                                borderRadius: '10px',
                                                background: mapTheme.id === theme.id ? '#8D6E63' : 'rgba(255,255,255,0.8)',
                                                color: mapTheme.id === theme.id ? 'white' : '#5D4037',
                                                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                                                border: mapTheme.id === theme.id ? '4px solid #3E2723' : '2px solid transparent',
                                                fontWeight: 'bold',
                                                transform: mapTheme.id === theme.id ? 'scale(1.05)' : 'scale(1)',
                                                transition: 'all 0.2s',
                                                position: 'relative',
                                                opacity: isUnlocked ? 1 : 0.6
                                            }}
                                        >
                                            {theme.name}
                                            {!isUnlocked && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0, left: 0, right: 0, bottom: 0,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    background: 'rgba(0,0,0,0.5)', borderRadius: '10px',
                                                    color: 'white', fontSize: '14px', gap: '5px'
                                                }}>
                                                    🔒 {unlockScore}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            style={{ ...styles.button, background: '#8D6E63', color: 'white' }}
                            onClick={() => {
                                setShowCustomization(false);
                                playSound('click', isSfxMuted, sfxVolume);
                            }}
                        >
                            Retour
                        </button>
                    </div>
                )}

                {mode && !gameOver && (
                    <div style={styles.hud}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={styles.score}>{capyFruit.emoji} {score}</div>
                            <div style={styles.score}>🏆 {highScores[mode] || 0}</div>
                        </div>
                        <div style={{ ...styles.modeLabel, background: 'rgba(255,255,255,0.8)', marginRight: '80px' }}>
                            {mode === MODES.CLASSIC ? 'Promenade' : mode === MODES.RIVER ? 'Rivière' : mode === MODES.BURROW ? 'Terriers' : 'Capy FPS'}
                        </div>
                    </div>
                )}

                {/* Countdown Overlay */}
                {mode && !gameOver && countdown > 0 && (
                    <div style={styles.countdown}>
                        {countdown}
                    </div>
                )}

                {/* Mobile Controls */}
                {mode && !gameOver && (
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '0',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center', // Changed to center to allow children to control their width/spacing
                        padding: '0 2rem',
                        pointerEvents: 'none' // Let clicks pass through container
                    }}>
                        {/* Left Controls (D-Pad style or just Arrows) */}
                        {mode === MODES.CAPY_FPS ? (
                            <div style={{
                                display: 'flex',
                                gap: '120px', // Fixed large gap to bring them closer than "edges" but still separate
                                pointerEvents: 'auto'
                            }}>
                                <div
                                    style={{ ...styles.mobileBtn, transform: 'scale(1.2)' }}
                                    onPointerDown={() => handleMobileControl('ArrowLeft')}
                                >
                                    ⬅️
                                </div>
                                <div
                                    style={{ ...styles.mobileBtn, transform: 'scale(1.2)' }}
                                    onPointerDown={() => handleMobileControl('ArrowRight')}
                                >
                                    ➡️
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '60px 60px 60px',
                                gridTemplateRows: '60px 60px',
                                gap: '20px', // Increased gap for classic mode
                                pointerEvents: 'auto',
                                margin: '0 auto'
                            }}>
                                <div style={{ gridColumn: '2', gridRow: '1' }}>
                                    <div style={styles.mobileBtn} onPointerDown={() => handleMobileControl('ArrowUp')}>⬆️</div>
                                </div>
                                <div style={{ gridColumn: '1', gridRow: '2' }}>
                                    <div style={styles.mobileBtn} onPointerDown={() => handleMobileControl('ArrowLeft')}>⬅️</div>
                                </div>
                                <div style={{ gridColumn: '2', gridRow: '2' }}>
                                    <div style={styles.mobileBtn} onPointerDown={() => handleMobileControl('ArrowDown')}>⬇️</div>
                                </div>
                                <div style={{ gridColumn: '3', gridRow: '2' }}>
                                    <div style={styles.mobileBtn} onPointerDown={() => handleMobileControl('ArrowRight')}>➡️</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!mode && !showCustomization && (
                    <div style={styles.menuContainer}>
                        <div style={styles.title}>CAPY SNAKE</div>
                        <div style={{ color: '#5D4037', marginBottom: '2rem' }}>Choisis ton chemin</div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <MenuButton onClick={() => startGame(MODES.CLASSIC)} isSfxMuted={isSfxMuted} sfxVolume={sfxVolume}>
                                Promenade Classique
                            </MenuButton>
                            <MenuButton onClick={() => startGame(MODES.RIVER)} isSfxMuted={isSfxMuted} sfxVolume={sfxVolume}>
                                Traversée de Rivière
                            </MenuButton>
                            <MenuButton onClick={() => startGame(MODES.BURROW)} isSfxMuted={isSfxMuted} sfxVolume={sfxVolume}>
                                Mode Terriers
                            </MenuButton>
                            <MenuButton onClick={() => startGame(MODES.CAPY_FPS)} isSfxMuted={isSfxMuted} sfxVolume={sfxVolume}>
                                Capy FPS
                            </MenuButton>
                            <MenuButton
                                style={{ background: '#4FC3F7', color: 'white' }}
                                onClick={() => {
                                    setShowCustomization(true);
                                    playSound('click', isSfxMuted, sfxVolume);
                                }}
                                isSfxMuted={isSfxMuted}
                                sfxVolume={sfxVolume}
                            >
                                Personnaliser 🎨
                            </MenuButton>
                        </div>
                    </div>
                )}

                {gameOver && (
                    <div style={styles.menuContainer}>
                        <div style={{ ...styles.title, color: '#D32F2F' }}>PERDU !</div>
                        <div style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#5D4037' }}>
                            Score: {score}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button
                                style={styles.button}
                                onClick={() => {
                                    setGameOver(false);
                                    setScore(0);
                                    const currentMode = mode;
                                    setMode(null);
                                    setTimeout(() => setMode(currentMode), 10);
                                    playSound('click', isSfxMuted, sfxVolume);
                                }}
                                onMouseEnter={() => playSound('hover', isSfxMuted, sfxVolume)}
                            >Rejouer</button>
                            <button
                                style={{ ...styles.button, background: '#8D6E63', color: 'white' }}
                                onClick={goHome}
                                onMouseEnter={() => playSound('hover', isSfxMuted, sfxVolume)}
                            >Accueil</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}