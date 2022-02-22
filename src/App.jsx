import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import Frame from './components/Frame';
import IndexList from './components/IndexList';

import './styles/App.css';
import './styles/utils/Helpers.css';

export default function App() {
    let ref = useRef();

    let [ contents, setContents ] = useState(<></>);
    let [ active, setActive ] = useState(0);

    function resizeHtml() {
        if(!ref.current) return;
        ref.current.style.height = window.innerHeight + 'px';
    }
    useEffect(() => {
        window.addEventListener('resize', resizeHtml);
        resizeHtml();
    }, []);
    return (
        <div ref={ref} className='wrapper'>
            <Frame title='Cryogen Cache Editor' />
            <div style={{clear: 'both'}} />
            <div className='content-wrapper'>
                <IndexList setContents={setContents} setActive={setActive} active={active} />
                <div className='content'>
                    {contents}
                </div>
            </div>
        </div>
    )
}
