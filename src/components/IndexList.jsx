import React, { useEffect, useRef } from 'react';

import _ from 'underscore';

import indices from '../data/indices';
const indexed = _.indexBy(indices, 'id');

import '../styles/ui/IndexList.css';
import List from './utils/list/List';

export default function IndexList({ setContents, setActive, active }) {
    useEffect(() => {
        let index = indexed[3];
        setActiveSide(index, index.width || 800);
        setContents(index.template);
    }, []);

    function setActiveSide(active, width=800) {
        setActive(active);
        api.window.setWidth(width);
    }
    return (
        <List
            items={indices}
            setContents={setContents}
            setActive={(active) => setActiveSide(active, active.width)}
            active={active}
            getTitle={index => (index.id + ' - ' + index.name)}
        />
    )
}
