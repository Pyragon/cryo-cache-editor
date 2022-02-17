import React, { useState, useEffect } from 'react';

import _ from 'underscore';

import Quest from './Quest';
import List from '../../utils/list/List';

import '../../../styles/defs/configs/Quests.css';

const QUEST_PATH = '/quests/';

export default function Quests() {
    let [ quests, setQuests ] = useState([]);
    let [ contents, setContents ] = useState(<></>);
    let [ active, setActive ] = useState({});

    useEffect(() => {
        api.file.getMany(QUEST_PATH, 'quest', (_, data) => {
            let quest = JSON.parse(data);
            quest.template = <Quest quest={quest} />
            setQuests(quests => [ ...quests, quest ]);
        });
    }, []);

    useEffect(() => {
        quests = quests.sort((a, b) => a.id - b.id);
    }, [ quests ]);
    return (
		<div>
			<p className='section-title'>Quests</p>
			<p className='section-description'>Information about Runescape quests. Hover each variable to see it's purpose.</p>
			<div className='section-content quests-content-container'>
                <div className='quest-list-container'>
                    <List
                        items={quests}
                        setContents={setContents}
                        setActive={setActive}
                        active={active}
                        getTitle={index => (index.id + ' - ' + index.name)}
                    />
                </div>
                <div className='quest-content'>
                    {contents}
                </div>
            </div>
		</div>
    );
}
