import React, { useEffect, useState } from 'react';

import List from '../../utils/list/List';
import Interface from './Interface';

import '../../../styles/defs/Interfaces.css';

export default function Interfaces() {
    let [ contents, setContents ] = useState(<></>);
    let [ active, setActive ] = useState({});
    let [ interfaces, setInterfaces ] = useState([]);

    useEffect(() => {
        api.file.getInterfaces((_, data) => {
            let interfaces = JSON.parse(data)
                .sort((a, b) => a.id-b.id)
                .map(inter => {
                    inter.template = <Interface id={inter.id} />;
                    return inter;
                });
            setInterfaces(interfaces);

            let selected = interfaces[13];
            setActive(selected);
            setContents(selected.template);
        });
    }, []);
    return (
        <div>
            <p className='section-title'>Interfaces</p>
            <p className='section-description'>An interface editor for Runescape. I will strive to have most things very easy to do using THREE.js, but feedback is always welcome</p>
            <p className='section-description'>I will attempt to have CS2 scripts directly editable from here, but for the time being, you may need to manually include the script IDs into the hooks of the interface</p>
            <div className='section-content interface-content-container'>
                <div className='interface-list-container'>
                    { interfaces && 
                        <List
                            items={interfaces}
                            setContents={setContents}
                            setActive={setActive}
                            active={active}
                            getTitle={item => (item.id + ' - ' + item.name)}
                        /> 
                    }
                </div>
                <div className='interface-content'>
                    {contents}
                </div>
            </div>
        </div>
    )
}
