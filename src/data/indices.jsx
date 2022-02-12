import React from 'react';

import Defaults from '../components/defs/defaults/Defaults';
import Interfaces from '../components/defs/interfaces/Interfaces';
import NPCs from '../components/defs/npcs/NPCs';

import configs from './configs';

export default [
    {
        name: 'Animation Frame Sets',
        id: 0,
    },
    {
        name: 'Animation Frame Bases',
        id: 1,
    },
    {
        name: 'Config',
        id: 2,
        items: configs,
    },
    {
        name: 'Interfaces',
        id: 3,
        width: 1200,
        template: <Interfaces />
    },
    {
        name: 'Sound Effects',
        id: 4,
    },
    {
        name: 'Maps',
        id: 5,
    },
    {
        name: 'Music',
        id: 6,
    },
    {
        name: 'Models',
        id: 7,
    },
    {
        name: 'Sprites',
        id: 8,
    },
    {
        name: 'Textures',
        id: 9,
    },
    {
        name: 'Huffman',
        id: 10,
    },
    {
        name: 'Music 2',
        id: 11,
    },
    {
        name: 'CS2',
        id: 12,
    },
    {
        name: 'Font Metrics',
        id: 13,
    },
    {
        name: 'Midi Instruments',
        id: 14,
    },
    {
        name: 'Sound Effects (MIDI)',
        id: 15,
    },
    {
        name: 'Objects',
        id: 16,
    },
    {
        name: 'Enums',
        id: 17,
    },
    {
        name: 'NPCs',
        id: 18,
        width: 1000,
        template: <NPCs />
    },
    {
        name: 'Items',
        id: 19,
    },
    {
        name: 'Animations',
        id: 20,
    },
    {
        name: 'Spot Animations',
        id: 21,
    },
    {
        name: 'Varbits',
        id: 22,
    },
    {
        name: 'Map Areas',
        id: 23,
    },
    {
        name: 'Quick Chat Messages',
        id: 24,
    },
    {
        name: 'Quick Chat Menus',
        id: 25,
    },
    {
        name: 'Textures',
        id: 26,
    },
    {
        name: 'Particles',
        id: 27,
    },
    {
        name: 'Defaults',
        id: 28,
        template: <Defaults />
    },
    {
        name: 'Billboards',
        id: 29,
    },
    {
        name: 'Native Libaries',
        id: 30,
    },
    {
        name: 'Shaders',
        id: 31,
    },
    {
        name: 'Normal Fonts',
        id: 32,
    },
    {
        name: 'Game Tips',
        id: 33,
    },
    {
        name: 'Jagex Fonts',
        id: 34,
    },
    {
        name: 'Cutscenes',
        id: 35,
    },
    {
        name: 'Vorbis',
        id: 36,
    }
];