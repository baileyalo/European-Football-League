import React from 'react';
import { HeaderProps } from '../types';

const Header: React.FC<HeaderProps> = React.memo(({ children }) => (
  <header className="header">
    <div className="header-content">
      {children}
    </div>
  </header>
));
Header.displayName = 'Header';

export default Header;