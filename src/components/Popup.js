import React from 'react';

function Popup({ message, closePopup }) {
  return (
    <div className="popup">
      <div className="popup-content">
        <p>{message}</p>
        <button onClick={closePopup}>Close</button>
      </div>
    </div>
  );
}

export default Popup;
