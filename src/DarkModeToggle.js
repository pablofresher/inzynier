import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const DarkModeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode) {
            setIsDarkMode(JSON.parse(savedMode));
            document.body.classList.toggle('dark-mode', JSON.parse(savedMode));
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.body.classList.toggle('dark-mode', newMode);
        localStorage.setItem('darkMode', JSON.stringify(newMode));
    };

    return (
        <div className="icon-container" onClick={toggleDarkMode}>
            {isDarkMode ? <FaSun className="icon" /> : <FaMoon className="icon" />}
            <div className="tooltip">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </div>
        </div>
    );
};

export default DarkModeToggle;