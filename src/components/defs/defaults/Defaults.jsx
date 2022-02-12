import React, { useEffect, useState } from 'react';

import EntityDefaults from './EntityDefaults';

import '../../../styles/ui/Section.css';
import '../../../styles/defs/Defaults.css';
import EquipmentDefaults from './EquipmentDefaults';
import _ from 'underscore';

export default function Defaults() {
    let sections = [
        {
            title: 'Entity',
            template: <EntityDefaults />,
        },
        {
            title: 'Equipment',
            template: <EquipmentDefaults />
        }
    ];
    let byIndex = _.indexBy(sections, (_, i) => i);
    useEffect(() => setActive(byIndex[1]), []);
    let [ active, setActive ] = useState(1);
    return (
        <div>
            <p className='section-title'>Defaults</p>
            <p className='section-description'>Information about default settings in Runescape including equipment stats, starter items, etc</p>
            <p className='section-description'>The only 2 unpacked so far are Entity, and Equipment. More to come.</p>
            <div className='section-tabs' style={{gridTemplateColumns: `repeat(${sections.length}, 1fr)`}}>
                { sections.map((section, i) => (
                    <p 
                        className={'section-tab '+(active.title === section.title ? 'active' : '')} 
                        key={i} 
                        onClick={() => setActive(section)}
                    >
                        {section.title}
                    </p>
                ))}
            </div>
            <div className='section-content'>
                {active.template}
            </div>
        </div>
    );
}
