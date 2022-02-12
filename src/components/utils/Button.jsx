import React from 'react';

import '../../styles/utils/Button.css';

export default function Button({ title, onClick, className, children }) {
    return (
        <button 
            className={`btn ${className}`} 
            onClick={onClick}
        >
            {title || children}
        </button>
    );
}
