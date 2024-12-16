import React from 'react';

const Bucket = ({ selectedWords, onDrop, onWordClick }) => {
    const getBucketStyle = () => {
        let height = '100px';
        if (selectedWords.length === 1) height = '120px';
        if (selectedWords.length === 2) height = '150px';
        if (selectedWords.length === 3) height = '180px';
        if (selectedWords.length === 4) height = '200px';

        return {
            height,
            width: '90%',
            maxWidth: '700px',
            margin: '20px auto',
            padding: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            border: '2px dashed #333',
            backgroundColor: 'transparent'
        };
    };

    const getWordStyle = (index) => {
        let backgroundColor;
        switch (index) {
            case 0: backgroundColor = 'yellow'; break;
            case 1: backgroundColor = 'orange'; break;
            case 2: backgroundColor = 'red'; break;
            case 3: backgroundColor = 'purple'; break;
            default: backgroundColor = 'transparent';
        }

        return {
            width: `${100 / selectedWords.length}%`,
            backgroundColor,
            textAlign: 'center',
            cursor: 'pointer',
            padding: '15px',
            fontSize: '1.5em',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        };
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const word = e.dataTransfer.getData('text/plain');
        onDrop(word);
    };

    return (
        <div
            id="bucket"
            className="drop-area"
            style={getBucketStyle()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {selectedWords.map((word, index) => (
                <div
                    key={word}
                    className="word"
                    style={getWordStyle(index)}
                    onClick={() => onWordClick(word)}
                >
                    {word}
                </div>
            ))}
        </div>
    );
};

export default Bucket;
