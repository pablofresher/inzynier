import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const DarkModeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode) {
            const mode = JSON.parse(savedMode);
            setIsDarkMode(mode);
            document.body.classList.toggle('dark-mode', mode);
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.body.classList.toggle('dark-mode', newMode);
        localStorage.setItem('darkMode', JSON.stringify(newMode));
    };

    return (
        <div 
            className="icon-container dark-mode-toggle" 
            onClick={toggleDarkMode}
            style={{ cursor: 'pointer', marginRight: '10px' }}
        >
            {isDarkMode ? (
                <FaSun className="icon" style={{ color: 'orange', fontSize: '30px' }} />
            ) : (
                <FaMoon className="icon" style={{ color: 'navy', fontSize: '30px' }} />
            )}
            <div className="tooltip">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </div>
        </div>
    );
};

export default DarkModeToggle;