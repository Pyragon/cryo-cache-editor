import React from 'react';

import '../styles/ui/Frame.css';

export default function Frame({ title }) {
    return (
        <div className='frame' >
            <img className='frame-logo' src='./images/icon.png' alt='logo' />
            <span className='frame-title'>{title}</span>
            <div className='frame-buttons'>
                <button className='frame-btn minimize-btn' onClick={api.window.minimize}/>
                <button className='frame-btn close-btn' onClick={api.remote.app.exit}/>
            </div>
        </div>
    );
};
