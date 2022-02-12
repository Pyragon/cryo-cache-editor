import React, { useEffect, useState } from 'react';

import _ from 'underscore';

export default function ListItemFolder({ listItem, activeListItem, getTitle, items, setContents, setActiveListItem }) {
	const [ open, setOpen ] = useState(activeListItem.id === listItem.id);
	let [ active, setActive ] = useState(items[0]);

	function openFolder(open) {
		setActiveListItem(listItem);
		setOpen(open);
	}

	function setActiveItem(item) {
		setActive(item);
		setContents(item.template);
	}

	useEffect(() => setOpen(activeListItem.id === listItem.id), [ activeListItem ]);
    return (
		<>
			<div className={'list-item '+(activeListItem.id === listItem.id ? 'active' : '')} key={'test'} onClick={() => openFolder(!open)}>
				{ listItem.icon && <img className='list-item-icon' src={listItem.icon} alt={listItem.name} /> }
				{ getTitle(listItem) }
				<i className={ 'list-item-folder-icon '+(open ? 'fa fa-caret-down' : 'fa fa-caret-right') } />
			</div>
			{ open && items.map(item => (
				<div className={'list-item nested '+(active.id === item.id ? 'active' : '')} key={item.id} onClick={() => setActiveItem(item)}>
					{ item.icon && <img className='list-item-icon' src={item.icon} alt={item.name} /> }
					{ getTitle(item) }
				</div>
			))}
		</>
	)
}
