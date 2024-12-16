import React from 'react';
import DarkModeToggle from './DarkModeToggle';
import LightbulbIcon from './LightbulbIcon';
import StatisticsIcon from './StatisticsIcon';

const TopBar = () => {
    return (
        <div className="top-bar">
            <div className="caption-icons-container">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <DarkModeToggle />
                    <LightbulbIcon />
                </div>
                <div className="caption">Your Game Title</div>
                <StatisticsIcon />
            </div>
        </div>
    );
};

export default TopBar;