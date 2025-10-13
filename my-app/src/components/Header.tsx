import React from 'react';
import { HeaderProps } from '../types';

const Header: React.FC<HeaderProps> = ({ children }) => {
    return (
        <header className="header">
            <div className="header-content">
                {children}
            </div>
        </header>
    );
};

export default Header;