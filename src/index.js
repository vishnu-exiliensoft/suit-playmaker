/**
 * APPLICATION ENTRY POINT
 * =======================
 * 
 * This is the main entry point for the React application.
 * It initializes the React DOM and renders the main App component.
 * 
 * Features:
 * - React 18 with createRoot API
 * - Strict mode for development warnings
 * - Performance monitoring with Web Vitals
 * - Global CSS imports
 * 
 * @author Your Name
 * @version 1.0.0
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
