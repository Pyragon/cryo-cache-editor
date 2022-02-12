import React, { useEffect, useRef } from 'react';

import '../../../styles/utils/List.css';
import ListItemFolder from './ListItemFolder';

export default function List( { items, getTitle, setContents, setActive, active }) {
    function setValue(item) {
        setContents(item.template);
        setActive(item);
    }
    return (
        <div className='list'>
            { items.map(item => {
                if(item.items)
                    return (
                        <ListItemFolder 
                            key={item.id} 
                            listItem={item} 
                            getTitle={getTitle} 
                            items={item.items} 
                            setContents={setContents}
                            setActiveListItem={setActive}
                            activeListItem={active}
                        />
                    );
                return (
                    <div className={'list-item '+(active.id === item.id ? 'active' : '')} key={item.id} onClick={() => setValue(item)}>
                        { item.icon && <img className='list-item-icon' src={item.icon} alt={item.name} /> }
                        { getTitle(item) }
                    </div>
                );
            })}
        </div>
    )
}
