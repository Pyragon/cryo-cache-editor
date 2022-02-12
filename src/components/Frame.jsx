import React from 'react';

import '../styles/ui/Frame.css';

export default React.forwardRef(({ title }, ref) => {
    let minimize = () => {
    };
    let close = () => {
        api.remote.app.exit();
    };
    return (
        <div ref={ref} className='frame' >
            <img className='frame-logo' src='./images/icon.png' alt='logo' />
            <span className='frame-title'>{title}</span>
            <div className='frame-buttons'>
                <button className='frame-btn minimize-btn' onClick={minimize}/>
                <button className='frame-btn close-btn' onClick={close}/>
            </div>
        </div>
    );
});
