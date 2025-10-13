import React from 'react';
import { ButtonProps } from '../types';

const Button: React.FC<ButtonProps> = ({ handleClick, leagueId, text }) => {
    return (
        <button 
            onClick={handleClick} 
            data-leagueid={leagueId}
            className="league-button"
        >
            {text}
        </button>
    );
};

export default Button;