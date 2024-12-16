import React from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts'; 
import { FaTimes } from 'react-icons/fa'; 
import instructionsImage from './instructions-image.PNG';
import './styles.css'; 

const IconPopup = ({ type, closePopup, content }) => {
  const data = [
    { name: '1', attempts: 12 },
    { name: '2', attempts: 8 },
    { name: '3', attempts: 15 },
    { name: '4', attempts: 5 }
  ];

  return (
    <div className="popup">
      <div className={`popup-content large ${type}`}>
        <button className="close-button" onClick={closePopup}>
          <FaTimes />
        </button>

        {type === 'lightbulb' && (
          <div className="instructions-content">
            <p className="instructions-text mt-4 text-center">
              <b>Jak grać? </b>To proste!
              <br /> <br />
              <img 
                src={instructionsImage} 
                alt="Game instructions" 
                className="instructions-image" 
              />
              <br/><b>1.</b> Celem gry jest połączenie 16 słów w 4 kategorie przed utratą wszystkich szans. 
              <br />
              <b>2.</b> Wybierz 4 hasła, które według ciebie łączy ta sama kategoria. Na obrazku kategoria: 
			  <br/> <b>Do zaobserwowania na niebie</b>.
              <br />
              <b>3.</b> Wciśnij guzik po lewej, żeby sprawdzić swój <span className="sploty">splot</span>!
              <br />
              <b>4.</b> Udało ci się zgadnąć? Gratulacje! Jeżeli nie, nie poddawaj się, nadal pozostały ci 3 próby.
              <br />
              <b>5.</b> Jeżeli 3 na 4 hasła zostaną przypasowane poprawnie, otrzymasz komunikat "Było blisko!".
            </p>
          </div>
        )}

        {type === 'statistics' && (
          <div className="statistics-content">
            <h2>Statystyki gry</h2>
            <div className="statistics-chart-container">
              <BarChart width={500} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#fff' }} />
                <Bar dataKey="attempts" fill="#e5e5ff" />
              </BarChart>
            </div>
          </div>
        )};

        {type === 'footer' && (
          <div className="footer-content">
            <p>{content}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IconPopup; 