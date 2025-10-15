import React from 'react';
import { ButtonProps } from '../types';

const Button: React.FC<ButtonProps> = ({ handleClick, leagueId, text, isActive = false, animationDelay = 0 }) => {
    return (
        <button 
            onClick={handleClick} 
            data-leagueid={leagueId}
            className={`league-button ${isActive ? 'active' : ''}`}
            style={{
                animationDelay: `${animationDelay * 0.1}s`,
                opacity: 0
            }}
        >
            {text}
        </button>
    );
};

export default Button;