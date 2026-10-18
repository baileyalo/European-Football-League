import React from 'react';
import { ButtonProps } from '../types';

const Button: React.FC<ButtonProps> = React.memo(
  ({ handleClick, leagueId, text, isActive = false, animationDelay = 0 }) => (
    <button
      type="button"
      onClick={() => handleClick(leagueId)}
      className={`league-button ${isActive ? 'active' : ''}`}
      aria-pressed={isActive}
      style={{ animationDelay: `${animationDelay * 0.1}s` }}
    >
      {text}
    </button>
  )
);
Button.displayName = 'Button';

export default Button;
