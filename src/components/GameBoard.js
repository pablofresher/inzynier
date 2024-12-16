import React, { useState } from 'react';
import Word from './Word';
import Bucket from './Bucket';

function GameBoard({ handleGuess }) {
  const words = [
    'word1', 'word2', 'word3', 'word4',
    'word5', 'word6', 'word7', 'word8',
    'word9', 'word10', 'word11', 'word12',
    'word13', 'word14', 'word15', 'word16'
  ];
  const [selectedWords, setSelectedWords] = useState([]);

  const addWordToBucket = (word) => {
    if (selectedWords.length < 4 && !selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const clearBucket = () => {
    setSelectedWords([]);
  };

  return (
    <div className="game-board">
      <div className="words-container">
        {words.map(word => (
          <Word key={word} word={word} addWordToBucket={addWordToBucket} />
        ))}
      </div>
      <Bucket selectedWords={selectedWords} />
      <div className="buttons">
        <button onClick={() => handleGuess(selectedWords)}>Guess!</button>
        <button onClick={clearBucket}>Clear</button>
      </div>
    </div>
  );
}

export default GameBoard;
