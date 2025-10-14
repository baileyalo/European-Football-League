import React from 'react';
import { ButtonProps } from '../types';

const ThemeToggle: React.FC<ButtonProps> = ({ handleClick}) => {
    return (
        <button 
            onClick={handleClick}
            className="league-button"
        >
         
        </button>
    );
};

export default ThemeToggle;