import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import App from './App';
import Login from './routes/Login';
import Register from './routes/Register';
import Preferences from './routes/Preferences';

axios.defaults.baseURL = 'http://localhost:8080';

ReactDOM.render(
  <React.StrictMode>
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/preferences" element={<Preferences />} />
        </Routes>
      </BrowserRouter>
    </div>
  </React.StrictMode>,
  document.getElementById('root'),
);
