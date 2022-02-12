import React from 'react';

export default function LabelInput({ title, value, setState, className='', type = 'text', centerTitle=false }) {
    return (
        <div className={'label-input '+className}>
            <p className={'label '+(centerTitle ? 't-center' : '')}>{title}</p>
            <input type={type} value={value} onChange={e => setState(e.target.value)} />
        </div>
    );
}
