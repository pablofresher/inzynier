import React from 'react';
import './Notification.css';

const Notification = ({ message, type }) => {
    return (
        <div className={`toast ${type}`}>
            {message}
        </div>
    );
};

export default Notification;
