import React from 'react';

const Footer: React.FC = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="footer fade-in animate-delay-4">
            <div className="footer-content">
                <p>&copy; {year} A.B. All rights reserved</p>
            </div>
        </footer>
    );
};

export default Footer;
