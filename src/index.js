import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { TemaSağlayıcı } from './context/ThemeContext';

ReactDOM.render(
  <React.StrictMode>
    <TemaSağlayıcı>
      <App/>
    </TemaSağlayıcı>
  </React.StrictMode>,
  document.getElementById('root')
);
