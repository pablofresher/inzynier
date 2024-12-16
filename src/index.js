import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot instead of ReactDOM
import App from './App';
import './styles.css'; // Ensure your CSS is imported here

const container = document.getElementById('root'); // Get the root element
const root = createRoot(container); // Create a root for React 18

root.render(
  //  <React.StrictMode>
        <App />
    //</React.StrictMode>
);
