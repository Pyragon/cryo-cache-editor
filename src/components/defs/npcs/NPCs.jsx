import React, { useState, useEffect } from 'react';
import { sort } from 'fast-sort';

import List from '../../utils/list/List';
import NPC from './NPC';

import '../../../styles/defs/NPCs.css';

const NPC_PATH = '/npcs/';

export default function NPCs() {
    let [ contents, setContents ] = useState(<></>);
    let [ active, setActive ] = useState({});
    let [ npcs, setNPCs ] = useState([]);

    useEffect(() => {

        api.file.getNames(NPC_PATH, 'npc', (_, data) => {
            let npcs = JSON.parse(data);
            npcs = sort(npcs).asc(n => n.id)
                .map(npc => {
                    npc.template = <NPC name={npc.name} />;
                    return npc;
                });
            setNPCs(npcs);
        });

    }, []);

    return (
        <div>
			<p className='section-title'>NPCs</p>
			<p className='section-description'>Information about Runescape's NPCs. Hover over each value to see what it does.</p>
			<p className='section-description'>The preview is to show you the NPC being edited. It will not necessarily change if you edit values.</p>
            <div className='section-content npc-content-container'>
                <div className='npc-list-container'>
                    { npcs && <List
                        items={npcs}
                        setContents={setContents}
                        setActive={setActive}
                        active={active}
                        getTitle={item => (item.id + ' - ' + item.name)}
                    /> }
                </div>
                <div className='npc-content'>
                    {contents}
                </div>
            </div>
        </div>
    );
}
