import React from 'react';

export default function LabelTextarea({ title, value, setState, className='', type = 'text' }) {
    return (
        <div className={'label-input '+className}>
            <p className='label'>{title}</p>
            <textarea type={type} value={value} onChange={e => setState(e.target.value)} />
        </div>
    );
}
