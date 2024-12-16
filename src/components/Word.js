import React from 'react';

const Word = ({ word }) => {
    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', word);
    };

    return (
        <div
            className="word"
            draggable
            onDragStart={handleDragStart}
        >
            {word}
        </div>
    );
};

export default Word;
